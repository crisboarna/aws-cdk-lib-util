---
sidebar_position: 2
---

# createSSMParameterList
:::tip Note
The `SSM` parameter name must adhere to the naming convention specified in [Parameter naming](/docs/intro#parameter-naming).
:::

## Example usage
```typescript title="YourStack.ts"
import { SSMUtil } from 'aws-cdk-lib-util';
import { ParameterTier } from 'aws-cdk-lib/aws-ssm';
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
    const paramName = 'sn/topics/alarms';
    
    SSMUtil.createSSMParameterList({
      scope: this,
      projectName,
      stackEnv,
      paramName: paramName,
      value: [...],
      tier: ParameterTier.ADVANCED,
    });
  ...
  }
}
```
