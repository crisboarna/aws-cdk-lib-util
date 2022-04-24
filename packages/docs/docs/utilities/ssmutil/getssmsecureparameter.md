---
sidebar_position: 45
---

# getSSMParameterList
You can optionally provide the `extract` parameter to false to return the `ParameterString` object. This can be used in locations where the `CDK` parameter object is expected, for example, by passing it in to ECS environment directly.

:::tip Note
The `SSM` parameter name must adhere to the naming convention specified in [Parameter naming](/docs/intro#parameter-naming).
:::

## Example usage
```typescript title="YourStack.ts"
import { SSMUtil } from 'aws-cdk-lib-util';
...

export class YourStack extends Stack {
  constructor(scope: Construct, id: string, props: IYourStackProps) {
    super(scope, id, props);

    const {
      projectName,
      stackEnv,
      secret
    } = props;
    ...
    const paramName = 'api/key/sendgrid/';
    
    const sendGridKey = SSMUtil.getSSMSecureParameter({
      scope: this,
      projectName,
      stackEnv,
      paramName: paramName,
    });
  ...
  }
}
```
