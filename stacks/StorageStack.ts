import { Bucket, StackContext, Table, Function } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const createSignedUrlForInstructions = new Function(
    stack,
    "createSignedUrlForInstructions",
    {
      handler: "packages/functions/src/create-signed-url-for-instructions.main",
    }
  );

  // Create an S3 bucket
  const bucketUploads = new Bucket(stack, "Uploads", {
    blockPublicACLs: true,
    // notifications: {
    //   writeFunction: {
    //     function: createSignedUrlForInstructions,
    //     filters: [{ prefix: "final/" }, { suffix: ".html" }],
    //   },
    // },
  });
  createSignedUrlForInstructions.bind([bucketUploads]);

  // Create the DynamoDB table
  const table = new Table(stack, "Rooms", {
    fields: {
      roomId: "string",
      visitId: "string",
    },
    primaryIndex: { partitionKey: "roomId", sortKey: "visitId" },
  });

  // create outputs
    stack.addOutputs({
        BucketUploadsName: bucketUploads.bucketName,
        TableName: table.tableName,
    });

  return {
    bucketUploads,
    table,
  };
}
