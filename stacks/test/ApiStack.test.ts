import { beforeAll, it } from "vitest";
import * as aws_cdk_lib from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import * as storageStackContext from "../StorageStack";
import * as apiStackContext from "../ApiStack";
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
  // Create the Storage stack
  app.stack(storageStackContext.StorageStack);

  // Create the API stack
  app.stack(apiStackContext.ApiStack);

  // Wait for resources to finalize
  await app.finish();

  // Get the CloudFormation template of the stack
  // THEN
  const stack = getStack(apiStackContext.ApiStack);
  template = Template.fromStack(stack as unknown as aws_cdk_lib.Stack);
});

it("has an API Gateway", () => {
  template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
    Name: Match.stringLikeRegexp("Api"),
  });
});

it("has an API Gateway route `POST /rooms`", () => {
  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "POST /rooms",
  });
});

it("has an API Gateway stage", () => {
  template.hasResourceProperties("AWS::ApiGatewayV2::Stage", {
    StageName: "$default",
  });
});

it("outputs the API endpoint", () => {
  template.hasOutput("ApiEndpoint", {
    Value: {
      "Fn::GetAtt": [
        "ApiCD79AAA0",
        "ApiEndpoint"
      ]
    }
  });
});

it('Lambda functions run against nodejs16.x', () => {
  const lambdas = template.findResources('AWS::Lambda::Function');

  template.resourcePropertiesCountIs(
    'AWS::Lambda::Function',
    {
      Runtime: 'nodejs16.x',
    },
    Object.keys(lambdas).length, // ignore the CustomResourceHandler & busRetrierFunction lambda implicitly created by SST
  );
});