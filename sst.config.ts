import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack";
import { CronJobStack } from "./stacks/CronJobsStack";
import { WebStack } from "./stacks/WebStack";

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
      runtime: "nodejs18.x",
    });

    app.stack(StorageStack).stack(CronJobStack).stack(ApiStack).stack(WebStack);

    await app.finish();
  }
} satisfies SSTConfig;



