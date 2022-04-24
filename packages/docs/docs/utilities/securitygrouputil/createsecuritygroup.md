---
sidebar_position: 1
---

# createSecurityGroup
Helps in creating a standardized `Security Group` with a standardized name following the pattern:

```markdown
`${projectName}-${securityGroupName.toUpperCase()}-SG-${stackEnv}`
```
**Example:**

projectName: `MyProject`

securityGroupName: `API`

stackEnv: `DEV`

Result: `MyProject-API-SG-DEV`

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
    SecurityGroupUtil.createSecurityGroup({
      scope: this,
      projectName,
      stackEnv,
      securityGroupName: 'API',
    });
  ...
  }
}
```
