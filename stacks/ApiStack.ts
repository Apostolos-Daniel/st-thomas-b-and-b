import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";
//import { Datadog } from "datadog-cdk-constructs-v2";

export function ApiStack({ stack }: StackContext) {

  const { table, bucketUploads } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    customDomain: "rooms.stay-in-athens.com",
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      "GET /rooms": {
        function: {
          handler: "packages/functions/src/rooms.main",
        },
      },
      "GET /hello-world": {
        function: {
          handler: "packages/functions/src/hello-world.main",
          bind: [bucketUploads],
        },
      },
      "GET /instructions": {
        function: {
          handler: "packages/functions/src/instructions.main",
          bind: [bucketUploads],
        },
      },
      "POST /rooms": "packages/functions/src/create.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    CustomDomainUrl: api.customDomainUrl,
  });

  // Return the API resource
  return {
    api,
  };
}
