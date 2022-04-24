---
sidebar_position: 1
---

# LambdaUtilStack
Stack props can be found in [LambdaProps](https://github.com/crisboarna/aws-cdk-lib-util/tree/master/packages/aws-cdk-lib-util/src/lambda/LambdaUtilStack.ts)

[Example configuration](https://github.com/crisboarna/react-cv/tree/master/apps/infra/src/config/lambda.ts)

This stack provides an `L3` equivalent construct that creates a Lambda with:
1. Versioning and Aliasing, each Cloudformation deployment releases a new version and updates alias
2. Extra actions that allow configuring external interactions with the lambda by providing the `scope`, `alias`, `role` and [other](https://github.com/crisboarna/aws-cdk-lib-util/tree/master/packages/aws-cdk-lib-util/src/lambda/LambdaUtilStack.ts)
3. SQS DLQ
4. Alarms sent to SNS topic
5. Layers support via arn, zip, parameter store arn
6. VPC support
7. Role generation per environment

## Example
```typescript title="YourStack.ts"
import { App } from 'aws-cdk-lib';
import { LambdaUtilStack } from 'aws-cdk-lib-util';

const app = new App();

export const lambdaCvExport: LambdaProps = {
  alarmTopicParam: `/${PROJECT_NAME_MAIN.toLowerCase()}${PARAM_SNS_ALARMS_ARN}`,
  artifactPath: artifactPathCvExport,
  environmentGeneration: () => ({
    APP_NAME: nameCapitalizedCvExport,
    CV_URL: `cv.${process.env.CDK_DOMAIN_NAME}`,
  }),
  extraActions: ({ lambdaAlias }) =>
    lambdaAlias.grantInvoke(
      new ServicePrincipal('cloudformation.amazonaws.com')
    ),
  isInVpc: false,
  isProvisioned: false,
  managedPolicies: ['service-role/AWSLambdaBasicExecutionRole'],
  memorySize: 1024,
  layers: [{ paramName: PARAM_LAMBDA_CV_EXPORT_LAYER_ARN }],
  name: `${PROJECT_NAME}-${nameCapitalizedCvExport}`,
  paramName: PARAM_LAMBDA_CV_EXPORT_ALIAS_ARN,
  paramNameRole: PARAM_LAMBDA_CV_EXPORT_ROLE_ARN,
  runtime: Runtime.NODEJS_14_X,
  policies: (env, stackEnv) =>
    getApiIAMPolicies(lambdaNameCvExport)(env, PROJECT_NAME, stackEnv),
};

const lambda = new LambdaUtilStack(
  app,
  `${PROJECT_NAME}-Lambda-API-${process.ENV}`,
  lambdaCvExport
);
```
