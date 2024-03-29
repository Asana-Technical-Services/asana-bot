import Status from "http-status-codes";
import endpoints from "/src/lib/asana/endpoints";
import axios from "axios";
import parser from "/src/lib/asana/parser";
import { DynamoDB } from "aws-sdk";
import validateWebhook from "/src/lib/asana/validateWebhook";

module.exports = async (req, res) => {
  const xHookHeader = req.headers["x-hook-secret"];

  // Request to connect a new webhook
  if (xHookHeader) {
    res.setHeader("x-hook-secret", xHookHeader);
    console.log(xHookHeader);
    console.log(req.query);
    res.send("🤖 at work *beep!*");
  } else {
    const {
      query: { webhookCode },
    } = req;

    const webhookXrefTable = new DynamoDB.DocumentClient({
      accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY,
      region: "us-east-1",
    });

    var getCodeParams = {
      TableName: "WebhookCodeToGidXref",
      Key: {
        webhookCode,
      },
    };

    let webhookGidResult = await webhookXrefTable.get(getCodeParams).promise();

    console.log(webhookGidResult);

    let webhookGid = webhookGidResult.Item.gid;

    // Go through events
    const { body } = req;
    console.log(JSON.stringify(body));
    console.log(
      validateWebhook("", JSON.stringify(body), req.headers["x-hook-signature"])
    );

    let requestItems = body.events.map((e, dex) => {
      return {
        PutRequest: {
          Item: {
            ...e,
            webhookgid: webhookGid,
            Date: Date.now().toString(),
            GidDate: webhookGid + e.created_at + dex.toString(),
          },
        },
      };
    });

    console.log(requestItems[0].PutRequest.Item);

    let putWebhookEventParams = {
      RequestItems: {
        WebhookHistoryLog: requestItems,
      },
    };

    let putWebhookEventsResult = await webhookXrefTable
      .batchWrite(putWebhookEventParams)
      .promise();
    console.log(putWebhookEventsResult);

    res.send("OK");
  }
};
