import { StackContext, use, Function, Cron, Bucket } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function CronJobStack({ stack }: StackContext) {
  const { bucketUploads } = use(StorageStack);

  const uploadInstructionsFunction = new Function(stack, "UploadInstructions", {
    handler: "packages/functions/src/upload-instructions.main",
  });

  uploadInstructionsFunction.bind([bucketUploads]);

  const cron = new Cron(stack, "Cron", {
    schedule: "rate(1 minute)",
    job: {
      function: uploadInstructionsFunction,
    },
    enabled: false,
  });
}
