import { Bucket, StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
    // Create an S3 bucket
    const bucket = new Bucket(stack, "Uploads");

    // Create the DynamoDB table
    const table = new Table(stack, "Rooms", {
        fields: {
            roomId: "string",
            visitId: "string",
        },
        primaryIndex: { partitionKey: "roomId", sortKey: "visitId" },
    });

    return {
        bucket,
        table,
    };
}