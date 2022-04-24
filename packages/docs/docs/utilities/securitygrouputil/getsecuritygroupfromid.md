---
sidebar_position: 2
---

# getSecurityGroupFromId
Performs a two-step process.
1. Retrieves value from `SSM` `Parameter Store` given specified parameter name.
2. Retrieves `SecurityGroup` object associated with the id above.

:::tip Note
The `SSM` parameter name must adhere to the naming convention specified in [Parameter naming](/docs/intro#parameter-naming).
:::

## Example usage
```typescript title="YourStack.ts"
import { SecurityGroupUtil } from 'aws-cdk-lib-util';
...

export class YourStack extends Stack {
  constructor(scope: Construct, id: string, props: IYourStackProps) {
    super(scope, id, props);

    const {
      projectName,
      stackEnv,
    } = props;
    ...
    // looks for SSM param with name /${projectName.toLowerCase()}/vpc/sg/api/${stackEnv.toLowerCase()}
    const apiSG = SecurityGroupUtil.getSecurityGroupFromId({
      scope: this,
      projectName,
      stackEnv,
      paramName: 'vpc/sg/api/',
    });

    // looks for SSM param with name /executorsproject/vpc/sg/worker/${stackEnv.toLowerCase()}
    const executorSG = SecurityGroupUtil.getSecurityGroupFromId({
      scope: this,
      projectName,
      stackEnv,
      paramName: '/executorsproject/vpc/sg/worker/',
    });
  ...
  }
}
```
