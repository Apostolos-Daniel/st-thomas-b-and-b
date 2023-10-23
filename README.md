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
pm add datadog-cdk-constructs-v2  
```