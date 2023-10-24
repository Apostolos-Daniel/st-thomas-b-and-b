# st-thomas-b-and-b
A website for stay-in-athens.com

## Using sst

https://sst.dev/chapters/what-does-this-guide-cover.html

https://pnpm.io/

### Create a new project

```bash
pnpm create sst rooms
cd rooms
pnpm install

```

## Prerequisites
- Node v18+ installed on your machine.
- PNPM v8+ installed on your machine.


Use aws cli to get a list of stack names:

```bash
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE --query "StackSummaries[].StackName" --output text
```

Get current aws profile used by aws cli:

```bash
aws configure list
```

## Adding Datadog
    
First, add the datadog-cdk-constructs-v2 package to your project:

```bash
pm add datadog-cdk-constructs-v2 -w -D
```

Essentially, this package is a wrapper around the Datadog construct library. It adds two Lambda layers:

1. The [Datadog Lambda Extension layer](https://github.com/Datadog/datadog-lambda-extension/releases), which is used to send logs and metrics to Datadog.
2. The [Datadog Node.js Lambda layer](https://github.com/Datadog/datadog-lambda-js/releases), which is used to instrument your Lambda functions.

There are two ways to add the two Datadog layers needed:

### 1. Add the layers to all Lambda functions in your stack in sst.config.ts

According to the [sst docs](https://docs.sst.dev/advanced/monitoring), you can add the layers to all Lambda functions in your stack by adding the following code to your sst.config.ts file:

```ts
import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack";
import { Stack } from "sst/constructs";
import { Datadog } from "datadog-cdk-constructs-v2";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

// 
export default {
  config(_input) {
    return {
      name: "rooms",
      region: "us-east-1",
    };
  },
  async stacks(app) {

    // Replace with the API Key Secret ARN from your
    // Datadog Integration CloudFormation stack

    const datadogApiKeySecretArn =
      "arn:aws:secretsmanager:us-east-1:643476110649:secret:DdApiKeySecret-XiVnMDcSAlrU-GhvrL0";

    // Allow functions to access secret
    app.addDefaultFunctionPermissions([
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [datadogApiKeySecretArn],
        actions: ["secretsmanager:GetSecretValue"],
      }),
    ]);
    // Exclude from the function bundle
    // since they'll be loaded from the Layer
    app.setDefaultFunctionProps({
      nodejs: {
        install: ["dd-trace", "datadog-lambda-js"],
      },
    });

    app.stack(StorageStack).stack(ApiStack);

    await app.finish();

    // Attach the Datadog contruct to each stack
    app.node.children.forEach((stack) => {
      if (stack instanceof Stack) {
        const datadog = new Datadog(stack, "datadog", {
          // Get the latest version from
          // https://github.com/Datadog/datadog-lambda-js/releases
          nodeLayerVersion: 99,
          // Get the latest version from
          // https://github.com/Datadog/datadog-lambda-extension/releases
          extensionLayerVersion: 49,
          site: "datadoghq.eu",
          apiKeySecretArn: datadogApiKeySecretArn,
          env: app.stage,
          service: app.name,
          // Just a recommendation, feel free to change the version per your CI/CD
          version: "1"
        });

        datadog.addLambdaFunctions(stack.getAllFunctions());
      }
    });
  }
} satisfies SSTConfig;
```

What this does is:

1. Adds the Datadog Lambda Extension and Datadog Node.js Lambda layers to all Lambda functions in your stack.
2. Uses a secret stored in AWS Secrets Manager to configure the Datadog Lambda Extension, by grabbing the Datadog API key from the secret.
3. Exludes the libraries `dd-trace` and `datadog-lambda-js` from the function bundle, since they'll be loaded from the layer.


### 2. Add the layers to all Lambda functions in your stack in each stack

TODO
https://sst.dev/examples/how-to-use-datadog-to-monitor-your-serverless-app.html