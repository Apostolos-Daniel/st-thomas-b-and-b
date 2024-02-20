import { Bucket } from "sst/node/bucket";
import {
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bucketName = Bucket.Uploads.bucketName; // Replace with your actual bucket name
const finalFileKey = "final/test.html"; // S3 key for the modified file

// When no region or credentials are provided, the SDK will use the
// region and credentials from the local AWS config.
const client = new S3Client({});

export async function main(event: any) {
  console.log("Event from S3:", JSON.stringify(event, null, 2));

  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: finalFileKey,
  });
  
  try {
    const response = await client.send(getCommand);

    const signedUrl = await getSignedUrl(client, getCommand, { expiresIn: 3600 });

    console.log("Pre-signed URL:", signedUrl);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Pre-signed URL created in its own function: ${signedUrl}`,
        finalFileKey,
      }),
    };
  } catch (error) {
    console.error("Error creating pre-signed URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating pre-signed URL" }),
    };
  }
}
