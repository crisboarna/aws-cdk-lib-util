---
sidebar_position: 1
---

# checkArtifactDirectoryExists
Simple file utility to be used when you want to ensure that a artifact path for a Lambda or a Lambda layer exists, even if you do not plan on deploying that specific stack.

Useful when you have multiple stacks in same `CDK` app file but only intend to deploy one stack without building all dependencies.

## Example usage
```typescript title="YourStack.ts"
import { App } from 'aws-cdk-lib';
import { CDKDirectoryUtil } from 'aws-cdk-lib-util';

const artifactPath = './dist/apps/stack2';

const app = new App();

const stack1 = new YourStack1(app,'Stack1',{...});

CDKDirectoryUtil.checkArtifactDirectoryExists(artifactPath);

const stack2 = new YourStack1(app,'Stack2',{artifactPath,...});
...

```
