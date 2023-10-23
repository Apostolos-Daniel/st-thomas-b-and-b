import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";
//import { Datadog } from "datadog-cdk-constructs-v2";

export function ApiStack({ stack }: StackContext) {
  const { table } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      "GET /rooms": "packages/functions/src/rooms.main",
      "POST /rooms": "packages/functions/src/create.main",
    },
  });

  // const datadog = new Datadog(stack, "Datadog", {
  //   nodeLayerVersion: 65,
  //   extensionLayerVersion: 13,
  //   apiKey: process.env.DATADOG_API_KEY,
  // });
  // datadog.addLambdaFunctions(stack.getAllFunctions());

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Return the API resource
  return {
    api,
  };
}