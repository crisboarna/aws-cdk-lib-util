---
sidebar_position: 2
---

# hasContext
Useful for checking if a context key exists, either programatically set beforehand or from CLI via 

```shell
cdk -c KEY=....
```

## Example usage
```typescript title="YourStack.ts"
import { CDKContextUtil } from 'aws-cdk-lib-util';
...

export class YourStack extends Stack {
  constructor(scope: Construct, id: string, props: IYourStackProps) {
    super(scope, id, props);

    const {
      projectName,
      stackEnv,
    } = props;
    ...
    const hasTarget = CDKContextUtil.hasContextKey(this, 'SOME_CONTEXT_KEY_TARGET');
    if(hasTarget) {
      const target = scope.node.tryGetContext('SOME_CONTEXT_KEY_TARGET');
    }
  ...
  }
}
```
