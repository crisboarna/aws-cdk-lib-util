---
sidebar_position: 1
---

# Introduction

Let's discover **aws-cdk-lib-util in less than 5 minutes**.

## Getting Started

Get started by **adding the lib as a dependency**.

```bash
npm install aws-cdk-lib-util
```

## Importing
```typescript
import { CDKCustomResourceUtil, SSMUtil, etc... } from 'aws-cdk-lib-util';
```

### What you'll need

- [Node.js](https://nodejs.org/en/download/):
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) (Optional)

## Description

Utility library for writing `AWS CDK` code in `Typescript` or `NodeJS` that provides several benefits:
1. Built-in guidelines/best practices to maintaining clear structure to your `AWS Cloudformation` resources in usage and naming convention.
2. Cleanup your `CDK` stack by reducing lines of code needed to add or import select resource types.

Most utility functions force adherence to naming convetion of type:
`projectName`-`component identifier`-`stack environment`
such as `MyProject-Lambda-API-DEV`

This enforcement starts from requiring `projectName` prefix and `stackEnv` suffix for most components, but it also extends for some to more advanced requirements.

I found these naming conventions to greatly improve the navigation and comprehension of the resource available, as we all know, a consistent naming convention
reduces the mental load and speeds up our comprehension and processing of what resources are deployed and how they interconnect.

## Parameter naming
In multiple utilities I make use of `SSM` parameters. Parameters created by this library take the shape of
```typescript
/projectname/<provided_parameter_name>/stackenv
```

It is recommended for the `<provided_parameter_name` to be a hierarchical naming that makes sense for the parameter such as

`/vpc/sg/id/api/`

which would give the full parameter of

`/projectname/vpc/sg/id/api/dev`

making it quite easy to read and search for in SSM.

Furthermore, to accommodate for situation where a parameter is from a different project, the utility behaves different according to the
`<provided_parameter_name` first character.

If the first char is `/`, it assumes a different project and uses the `paramName` value only appending `stackEnv` at the end

**Example**:
1. `/someProjectName/vpc/sg/id/api` becomes `/someProjectName/vpc/sg/id/api/dev`
2. `vpc/sg/id/api` becomes `/projectName/vpc/sg/id/api/dev`
