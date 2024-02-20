import { Bucket } from "sst/node/bucket";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import replaceContent from "../../core/src/replace-content";

const bucketName = Bucket.Uploads.bucketName; // Replace with your actual bucket name
const originalFileKey = "original/test.html"; // Replace with the S3 key of your original HTML file
const modifiedFileKey = "final/test.html"; // S3 key for the modified file

// Helper function to convert a stream to a string
const streamToString = (stream: Readable): Promise<string> => {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.once("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.once("error", reject);
  });
};

// When no region or credentials are provided, the SDK will use the
// region and credentials from the local AWS config.
const client = new S3Client({});

export async function main(event: any) {
  console.log("Event from EventBridge:", JSON.stringify(event, null, 2));
  // console.log("Manual Uploads Bucket Name:", Bucket.Uploads.bucketName);
  console.log("Uploads Bucket Name:", bucketName);

  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: originalFileKey,
  });

//   const signedUrl = await getSignedUrl(client, getCommand, { expiresIn: 3600 });
//   console.log("Pre-signed URL:", signedUrl);

  const { Body } = await client.send(getCommand);
  const originalHtmlContent = await streamToString(Body as Readable);

  const command = new PutObjectCommand({
    Bucket: Bucket.Uploads.bucketName,
    Key: modifiedFileKey,
    Body: replaceContent(originalHtmlContent),
    ContentType: "text/html",
  });
  try {
    const response = await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `File uploaded successfully, response: ${response}`,
        modifiedFileKey,
      }),
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error uploading file" }),
    };
  }
}
