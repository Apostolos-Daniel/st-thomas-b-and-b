import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { Bucket } from "sst/node/bucket";
import { Config } from "sst/node/config";
import { Readable } from "stream";
import { EventBus } from "sst/node/event-bus";
import AWS from "aws-sdk";

const client = new AWS.EventBridge();

const s3Client = new S3Client({ region: "us-east-1" });

const bucketName = Bucket.Uploads.bucketName;
const htmlObjectKey = "final/instructions.html";
const cssObjectKey = "final/css/styles.css";

// Helper function to convert a stream to a string
const streamToString = (stream: Readable): Promise<string> => {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.once("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.once("error", reject);
  });
};

export async function main(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    // should content be returned?
    const authHeader =
      event.headers["Authorization"] || event.headers["authorization"];

    if (!authHeader) {
      return {
        statusCode: 401,
        headers: { "WWW-Authenticate": "Basic" },
        body: "Unauthorized",
      };
    }

    const encodedCreds = authHeader.split(" ")[1]; // Authorization: Basic <encoded-creds>

    // Replace 'expectedUsername' and 'expectedPassword' with your actual credentials
    if (encodedCreds !== Config.ST_THOMAS_B_AND_B_INSTRUCTIONS_SECRET_BASE64) {
      return {
        statusCode: 401,
        headers: { "WWW-Authenticate": "Basic" },
        body: "Unauthorized",
      };
    }

    // Fetch HTML content from S3
    const htmlCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: htmlObjectKey,
    });
    const signedUrlHtml = await getSignedUrl(s3Client, htmlCommand, {
      expiresIn: 3600,
    }); // Signed URL expires in 1 hour
    const cssCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: cssObjectKey,
    });
    const signedUrlCss = await getSignedUrl(s3Client, cssCommand, {
      expiresIn: 3600,
    }); // Signed URL expires in 1 hour
    console.log(`Redirecting to pre-signed URL: ${signedUrlHtml}`);
    console.log(`Css pre-signed URL: ${signedUrlCss}`);

    const { Body } = await s3Client.send(htmlCommand);
    const originalHtmlContent = await streamToString(Body as Readable);

    console.log("Sending event to EventBridge");
    client
      .putEvents({
        Entries: [
          {
            EventBusName: EventBus.Bus.eventBusName,
            Source: "instructionsRead",
            DetailType: "Instructions",
            Detail: JSON.stringify({
              id: "123",
              name: "My order",
              items: [
                {
                  id: "1",
                  name: "My item",
                  price: 10,
                },
              ],
            }),
          },
        ],
      })
      .promise()
      .catch((e) => {
        console.log(e);
      });

    return {
      statusCode: 200, // HTTP status code for redirection
      headers: { "Content-Type": "text/html" },
      body: originalHtmlContent
        .replace(`href="css/styles.css"`, `href="${signedUrlCss}"`)
        .replace("${STEP1}", Config.ST_THOMAS_B_AND_B_INSTRUCTIONS_STEP_1)
        .replace("${STEP3}", Config.ST_THOMAS_B_AND_B_INSTRUCTIONS_STEP_3), // No body is needed for a redirect response
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return { statusCode: 500, body: "Internal server error" };
  }
}
