import axios from 'axios'

export default async function asanaAPI(req, res) {
    const data = req.body

    if (!data.user) {
        res.json({ error: "user error" })
    } else {
        axios({
            method: data.method,
            url: "https://app.asana.com/api/1.0/" + data.endpoint,
            params: data.params,
            headers: {
                Authorization: process.env.ASANA_TOKEN,
                "Content-Type": "application/json; charset=utf-8",
            },
            data: data.data
        }).then(response => {
            if (response.status === 200 || response.status === 201) {
                res.send(response.data)
            } else {
                res.json({ error: response.status + " Error - " + response.data })
            }
        }).catch(err => {
            res.json({ error: err.message })
        })
    }
}