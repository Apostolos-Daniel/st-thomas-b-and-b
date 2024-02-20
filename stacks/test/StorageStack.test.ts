import { beforeAll, it } from "vitest";
import { Match, Template } from "aws-cdk-lib/assertions";
import * as stackContext from "../StorageStack";
import { initProject } from "sst/project";
import { App, getStack } from "sst/constructs";

// https://docs.aws.amazon.com/cdk/v2/guide/testing.html
// https://docs.sst.dev/testing#testing-infrastructure
// https://docs.sst.dev/testing
var template: Template;

beforeAll(async () => {
  await initProject({});
  const app = new App({ mode: "deploy" });
  // WHEN
  // Create the Database stack
  app.stack(stackContext.StorageStack);

  // Wait for resources to finalize
  await app.finish();

  // Get the CloudFormation template of the stack
  // THEN
  const stack = getStack(stackContext.StorageStack);
  template = Template.fromStack(stack);
});

it("has a table called `Rooms` with partitionKey and sortKey set", () => {
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    TableName: Match.stringLikeRegexp("-Rooms"),
    AttributeDefinitions: Match.arrayWith([
        {
            "AttributeName": "roomId",
            "AttributeType": "S"
           },
           {
            "AttributeName": "visitId",
            "AttributeType": "S"
           }
        ]),
    BillingMode: "PAY_PER_REQUEST",
  });
});

it("has a bucket", () => {
    template.hasResourceProperties("AWS::S3::Bucket", {  });
});

it("has a non-publicly accessible bucket", () => {
  template.hasResourceProperties("AWS::S3::Bucket", {
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: true,
    },
  });
});