---
sidebar_position: 1
---

# capitalizeInputString
Useful for giving a uniform `PascalCase` naming to your constructs.

## Example usage
```typescript title="YourStack.ts"
import { CDKStringUtil } from 'aws-cdk-lib-util';
...

export class YourStack extends Stack {
  constructor(scope: Construct, id: string, props: IYourStackProps) {
    super(scope, id, props);

    const {
      projectName,
      stackEnv,
    } = props;
    ...

    const lambda = new Function(this,`${projectName}-Lambda-API-${stackEnv}`, {
      functionName: `${projectName}-${CDKStringUtil.capitalizeInputString('lambda-api')}-${stackEnv}`
      ...
    });
  ...
  }
}
```
