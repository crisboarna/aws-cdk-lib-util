---
sidebar_position: 3
---

# getStackName
Facilitates the naming of the CDK stack based on the file containing the app.

## Example usage
```typescript title="YourStack.ts"
import { App } from 'aws-cdk-lib';
import { CDKDirectoryUtil } from 'aws-cdk-lib-util';

const app = new App();

const stack1 = new SomeStack(app,CDKDirectoryUtil.getStackName(__dirname, __filename),{...});
...
```
Stack name will be YourStack.
