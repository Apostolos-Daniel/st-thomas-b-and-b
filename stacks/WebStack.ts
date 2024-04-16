import { StackContext, NextjsSite } from "sst/constructs";

export function WebStack({ stack }: StackContext) {
  const site = new NextjsSite(stack, "site", {
    path: "packages/web-next",
  });
  stack.addOutputs({
    SiteUrl: site.url,
  });
}
