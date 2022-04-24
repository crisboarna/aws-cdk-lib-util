---
sidebar_position: 1
---

# actionViaCustomResource
To be used when you need to perform custom actions during a `Cloudformation` stack deployment via a custom lambda.
Custom lambda is to be provisioned separately, via [LambdaUtilStack](/docs/stacks/lambda) ;) for example and the function is to be passed in as the target to be invoked during `onCreate`, `onUpdate` `onDelete` lifecycle events.

## Example usage

```typescript title="YourStack.ts"
import { CDKCustomResourceUtil } from 'aws-cdk-lib-util';
import { LambdaUtilStack } from "./LambdaUtilStack";

...

export class YourStack extends Stack {
  constructor(scope: Construct, id: string, props: IYourStackProps) {
    super(scope, id, props);

    const {
      projectName,
      stackEnv,
      lambdaConfig,
      functionName,
      targetParamName,
      targetAccount,
    } = props;
    ...
    const lambda = new Function(...);
  
    CDKCustomResourceUtil.actionViaCustomResource({
      scope: this,
      projectName,
      stackEnv,
      functionArn: lambda.functionArn,
    });
  ...
  }
}
```
