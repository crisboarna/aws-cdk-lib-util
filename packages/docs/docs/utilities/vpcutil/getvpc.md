---
sidebar_position: 1
---

# getVpc

## Example usage
```typescript title="YourStack.ts"
import { VpcUtil } from 'aws-cdk-lib-util';
...

export class YourStack extends Stack {
  constructor(scope: Construct, id: string, props: IYourStackProps) {
    super(scope, id, props);

    const {
      projectName,
      stackEnv,
    } = props;
    ...

    const vpc = StackUtils.getVPC({ 
      scope: this, 
      projectName, 
      stackEnv 
    });
  ...
  }
}
```
