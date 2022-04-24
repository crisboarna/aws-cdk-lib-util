---
sidebar_position: 1
---

# createSecretManagerSecret
Creates `Secrets Manager` secret while adhering to same naming convention mentioned in [Parameter naming](#parameter-naming)

## Example usage
```typescript title="YourStack.ts"
import { SecretManagerUtil } from 'aws-cdk-lib-util';
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
    const paramName = 'db/rds/auth/';
    const paramValue = {secret};
    
    SecretManagerUtil.createSecretManagerSecret({
      scope: this,
      projectName,
      stackEnv,
      paramName: paramName,
      value: paramValue,
    });
  ...
  }
}
```
