import { beforeAll, it } from "vitest";
import { Match, Template } from "aws-cdk-lib/assertions";
import * as RoomsApp from "../RoomsStack";
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
  app.stack(RoomsApp.API);

  // Wait for resources to finalize
  await app.finish();

  // Get the CloudFormation template of the stack
  // THEN
  const stack = getStack(RoomsApp.API);
  template = Template.fromStack(stack);
});

it("has an API", () => {
  template.hasResourceProperties("AWS::ApiGatewayV2::Api", {
    Name: Match.stringLikeRegexp("-api$"),
    ProtocolType: "HTTP",
  });
});

it("has route 'GET /", () => {
  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "GET /",
  });
});

it("API has  handler", () => {
  template.hasResourceProperties("AWS::Lambda::Function", {
    Handler: "packages/functions/src/lambda.handler",
  });
});