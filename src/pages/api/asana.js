import axios from "axios";
import { getSession } from "next-auth/react";

export default async function asanaAPI(req, res) {
  const data = req.body;
  const headers = req.headers;
  const session = await getSession({ req });

  if (!session?.access_token) {
    res.json({ error: "user error" });
  } else {
    try {
      let response = await axios({
        method: data.method,
        url: "https://app.asana.com/api/1.0/" + data.endpoint,
        params: data.params,
        headers: {
          authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        data: data.data,
      });
      if (response.status === 200 || response.status === 201) {
        res.send(response.data);
      } else {
        res.json({ error: response.status + " Error - " + response.data });
      }
    } catch (err) {
      res.json({ error: err.message });
    }
  }
}
