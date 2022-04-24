---
sidebar_position: 2
---

# checkArtifactFileExists
Similar to `checkArtifactDirectoryExists`, useful when you have multiple stacks and only want to deploy one of them without building all stack dependencies.
Difference consists of this one also creating an empty file, which is useful for when you are passing a `zip` file directly as commonly done for `Lambda` `Layers`.

## Example usage
```typescript title="YourStack.ts"
import { App } from 'aws-cdk-lib';
import { CDKDirectoryUtil } from 'aws-cdk-lib-util';

const artifactPath = './dist/libs/layer1/layer.zip';

const app = new App();

const stack1 = new YourStack1(app,'Stack1',{...});

CDKDirectoryUtil.checkArtifactFileExists(artifactPath);

const stack2 = new YourStack1(app,'Stack2',{artifactPath,...});
...

```
