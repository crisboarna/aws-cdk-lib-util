---
sidebar_position: 2
---

# getSSMParamViaCustomResource
This allows cross-account/region querying of `Systems Manager` `Parameter Store` entries from within `CDK` code which can then be used within the same stack.
This uses behind the scenes the `AWS CDK` `Provider` framework to resolve via custom lambda's the call in the appropriate account location.

## Example usage
```typescript title="YourStack.ts"
import { CDKCustomResourceUtil } from 'aws-cdk-lib-util';
...
export class YourStack extends Stack {
  constructor(scope: Construct, id: string, props: IYourStackProps) {
    super(scope, id, props);
    
    const {
      projectName,
      stackEnv,
      functionName,
      targetParamName,
      targetAccount
    } = props;
    ...
    const parameterValue = const CDKCustomResourceUtil.getSSMParamViaCustomResource({
      scope: this,
      projectName,
      stackEnv,
      functionName,
      account: targetAccount,
      paramName: targetParamName,
    });
    ...
  }
}
```
