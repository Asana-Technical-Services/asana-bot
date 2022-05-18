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
  } else {
    try {
      // generate random ID to send
      let webhookCode = randomUUID();
      let targetUrl = new URL(data.data.target);
      if (targetUrl.search) {
        targetUrl.search = targetUrl.search + `&webhookCode=${webhookCode}`;
      } else {
        targetUrl.search = `?webhookCode=${webhookCode}`;
      }

      data.data.target = targetUrl.toString();

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
        // make request to dynamo DB to set webhook -> code

        const webhookXrefTable = new DynamoDB.DocumentClient({
          accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID,
          secretAccessKey: NEXT_AWS_SECRET_ACCESS_KEY,
          region: "us-east-1",
        });

        var params = {
          TableName: "WebhookCodeToGidXref",
          Item: {
            webhookCode: webhookCode,
            gid: resoponse.data.data.gid,
          },
        };

        webhookXrefTable.put(params, function (err, data) {
          if (err) {
            console.log(err);
            res.json({ error: response.status + " Error - " + err });
          } else {
            res.send(response.data);
          }
        });
      } else {
        res.json({ error: response.status + " Error - " + response.data });
      }
    } catch (err) {
      res.json({ error: err.message });
    }
  }
}
