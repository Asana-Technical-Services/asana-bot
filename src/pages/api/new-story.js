import Status from 'http-status-codes';
import endpoints from "../../utils/asana/endpoints"
import axios from "axios"
import parser from "../../utils/asana/parser"

module.exports = async (req, res) => {

    const xHookHeader = req.headers["x-hook-secret"];

    // Request to connect a new webhook
    if (xHookHeader) {
        res.setHeader('x-hook-secret', xHookHeader)
        // res.send("OK")
    } else {
        // Go through events
        const { body } = req
        const promises = body.events.map(async event => {
            if (event.resource.resource_subtype == "comment_added") {
                // Retrieve task metadata (name)
                let getStoryResponse = await axios.get(endpoints.stories + event.resource.gid, {
                    headers: {
                        'Authorization': process.env.ASANA_TOKEN
                    },
                    params: {
                        'opt_fields': "text"
                    }
                })
                if (getStoryResponse.status !== Status.OK) {
                    console.log('Retrieving story %d failed', event.resource.gid)
                    console.log(error)
                } else {
                    let story = getStoryResponse.data.data
                    let parserRes = await parser(story.text)
                    if (parserRes.update) {
                        let updateData = {
                            data: {
                                due_on: parserRes.dueDate.toISOString().slice(0, 10) // format YYYY-MM-DD
                            }
                        }
                        let updateTaskResponse = await axios.put(endpoints.tasks + event.parent.gid, updateData, {
                            headers: {
                                'Authorization': process.env.ASANA_TOKEN
                            }
                        })
                        if (updateTaskResponse.status === Status.OK) {
                            console.log('Task %d properties updated', event.parent.gid)
                        } else {
                            console.log('Task %d properties failed', event.parent.gid)
                            console.log(error)
                        }
                    }
                }
                return true
            }
        })
        let eventsPromise = await Promise.all(promises)

    }

    res.send("🤖 at work *beep!*")
}
