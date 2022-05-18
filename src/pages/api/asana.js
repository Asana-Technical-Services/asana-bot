import axios from "axios";
import { randomUUID } from "crypto";
import { getSession } from "next-auth/react";
import { DynamoDB } from "aws-sdk";

export default async function asanaAPI(req, res) {
  const data = req.body;
  const headers = req.headers;
  const session = await getSession({ req });

  if (!session?.access_token) {
    res.json({ error: "user error" });
  } else if (data.method == "POST") {
    try {
      // generate random ID to send
      let webhookCode = randomUUID();
      console.log(data);
      let targetUrl = new URL(data.data.data.target);
      console.log(targetUrl);
      if (targetUrl.search) {
        data.data.target =
          data.data.data.target + `&webhookCode=${webhookCode}`;
      } else {
        data.data.data.target =
          data.data.data.target + `?webhookCode=${webhookCode}`;
      }

      console.log({
        method: data.method,
        url: "https://app.asana.com/api/1.0/" + data.endpoint,
        params: data.params,
        headers: {
          authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        data: data.data,
      });

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

      console.log(response.data);

      if (response.status === 200 || response.status === 201) {
        // make request to dynamo DB to set webhook -> code

        const webhookXrefTable = new DynamoDB.DocumentClient({
          accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
          region: "us-east-1",
        });

        var params = {
          TableName: "WebhookCodeToGidXref",
          Item: {
            webhookCode: webhookCode,
            gid: response.data.data.gid,
          },
        };

        console.log(params);

        let result = await webhookXrefTable.put(params).promise();

        console.log(result);
        res.send(result);
      } else {
        res.json({ error: response.status + " Error - " + response.data });
      }
    } catch (err) {
      res.json({ error: err.message });
    }
  } else {
    axios({
      method: data.method,
      url: "https://app.asana.com/api/1.0/" + data.endpoint,
      params: data.params,
      headers: {
        authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      data: data.data,
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          res.send(response.data);
        } else {
          res.json({ error: response.status + " Error - " + response.data });
        }
      })
      .catch((err) => {
        res.json({ error: err.message });
      });
  }
}
