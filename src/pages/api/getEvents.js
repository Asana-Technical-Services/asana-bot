import axios from "axios";
import { randomUUID } from "crypto";
import { getSession } from "next-auth/react";
import { DynamoDB } from "aws-sdk";

export default async function asanaAPI(req, res) {
  const data = req.body;
  const headers = req.headers;
  const session = await getSession({ req });

  if (!session?.access_token | !data.webhookgid) {
    res.json({ error: "user error" });
  } else {
    try {
      let response = await axios({
        method: "GET",
        url: "https://app.asana.com/api/1.0/webhooks/" + data.webhookgid,
        headers: {
          authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json; charset=utf-8",
        },
      });
      console.log(response);
      if (response.status != 200) {
        res.json({ error: "user error" });
        return;
      }

      const WebhookHistoryTable = new DynamoDB.DocumentClient({
        accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
        region: "us-east-1",
      });

      const params = {
        TableName: "WebhookHistoryLog",
        IndexName: "webhookgid-Date-index",
        KeyConditionExpression: "webhookgid = :hkey",
        ExpressionAttributeValues: {
          ":hkey": data.webhookgid,
        },
        ScanIndexForward: false,
        Limit: 40,
      };

      const webhookResponse = await WebhookHistoryTable.query(params).promise();

      console.log(webhookResponse);

      res.send(webhookResponse.Items);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  }
}
