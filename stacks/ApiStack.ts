import { Api, Config, StackContext, EventBus, Function, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";
//import { Datadog } from "datadog-cdk-constructs-v2";

export function ApiStack({ stack }: StackContext) {
  const { table, bucketUploads } = use(StorageStack);


  const bus = new EventBus(stack, "Bus", {
    rules: {
      helloWorldRule: {
        pattern: { source: ["instructionsRead"], detailType: ["Instructions"]},
        targets: {
          helloWorld: 
          new Function(stack, "roomManager", {
          handler: "packages/functions/src/room-manager.main",
        })
        },
      },
    },
  });

  // Create the API
  const customDomain =
    process.env.SST_STAGE == "prod"
      ? "rooms.stay-in-athens.com"
      : `${process.env.SST_STAGE}.stay-in-athens.com`;

  const ST_THOMAS_B_AND_B_INSTRUCTIONS_SECRET_BASE64 = new Config.Secret(
    stack,
    "ST_THOMAS_B_AND_B_INSTRUCTIONS_SECRET_BASE64"
  );
  const ST_THOMAS_B_AND_B_INSTRUCTIONS_STEP_1 = new Config.Secret(
    stack,
    "ST_THOMAS_B_AND_B_INSTRUCTIONS_STEP_1"
  );
  const ST_THOMAS_B_AND_B_INSTRUCTIONS_STEP_3 = new Config.Secret(
    stack,
    "ST_THOMAS_B_AND_B_INSTRUCTIONS_STEP_3"
  );
  const api = new Api(stack, "Api", {
    customDomain: customDomain,
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
          bind: [
            bucketUploads,
            bus,
            ST_THOMAS_B_AND_B_INSTRUCTIONS_SECRET_BASE64,
            ST_THOMAS_B_AND_B_INSTRUCTIONS_STEP_1,
            ST_THOMAS_B_AND_B_INSTRUCTIONS_STEP_3,
          ],
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
