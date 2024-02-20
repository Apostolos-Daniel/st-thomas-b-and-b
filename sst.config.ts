import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack";
import { Stack } from "sst/constructs";
import { Datadog } from "datadog-cdk-constructs-v2";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CronJobStack } from "./stacks/CronJobsStack";

// 
export default {
  config(_input) {
    return {
      name: "rooms",
      region: "us-east-1",
    };
  },
  async stacks(app) {

    // Exclude from the function bundle
    // since they'll be loaded from the Layer
    app.setDefaultFunctionProps({
      nodejs: {
        install: ["dd-trace", "datadog-lambda-js"],
      },
    });

    app.stack(StorageStack).stack(CronJobStack).stack(ApiStack);

    await app.finish();
  }
} satisfies SSTConfig;



