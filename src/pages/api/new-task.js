import Status from 'http-status-codes';
import endpoints from "/src/lib/asana/endpoints"
import axios from "axios"
import parser from "/src/lib/asana/parser"

module.exports = async (req, res) => {

    const xHookHeader = req.headers["x-hook-secret"];

    // Request to connect a new webhook
    if (xHookHeader) {
        res.setHeader('x-hook-secret', xHookHeader)
        // res.send("OK")
    } else {
        // Go through events
        const { body } = req
        // console.log(body.data)
        const promises = body.events.map(async event => {
            // Retrieve task metadata (name)
            let getTaskResponse = await axios.get(endpoints.tasks + event.resource.gid, {
                headers: {
                    'Authorization': process.env.ASANA_TOKEN
                },
                params: {
                    'opt_fields': "name"
                }
            })
            if (getTaskResponse.status !== Status.OK) {
                console.log('Retrieving task %d failed', event.resource.gid)
                console.log(error)
            } else {
                let task = getTaskResponse.data.data
                let parserRes = await parser(task.name)
                if (parserRes.update) {
                    let updateData = {
                        data: {
                            due_on: parserRes.dueDate.toISOString().slice(0, 10), // format YYYY-MM-DD
                            name: parserRes.text.trim()        
                        }
                    }
                    let updateTaskResponse = await axios.put(endpoints.tasks + task.gid, updateData, {
                        headers: {
                            'Authorization': process.env.ASANA_TOKEN
                        }
                    })
                    if (updateTaskResponse.status === Status.OK) {
                        console.log('Task %d properties updated', task.gid)
                    } else {
                        console.log('Task %d properties failed', task.gid)
                        console.log(error)
                    }
                }
            }
            return true
        })
        let eventsPromise = await Promise.all(promises)
    }

    res.send("🤖 at work *beep!*")
}
