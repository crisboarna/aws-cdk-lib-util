/**
 * Provides string manipulation functions for CDK purposes
 */
import { Construct } from 'constructs';

export class CDKContextUtil {
  /**
   * Check from CDK context if a specified key for provided construct scope exists
   * ```typescript
   * import { CDKContextUtil } from 'aws-cdk-lib-util';
   * ...
   *
   * export class YourStack extends Stack {
   *   constructor(scope: Construct, id: string, props: IYourStackProps) {
   *     super(scope, id, props);
   *
   *     const {
   *       projectName,
   *       stackEnv,
   *     } = props;
   *     ...
   *   const hasTarget = CDKContextUtil.hasContextKey(this, 'SOME_CONTEXT_KEY_TARGET');
   *   if(hasTarget) {
   *     const target = scope.node.tryGetContext('SOME_CONTEXT_KEY_TARGET');
   *   }
   *   ...
   *   }
   * }
   * ```
   * @param scope
   * @param key
   */
  public static hasContextKey(scope: Construct, key: string) {
    const keyValue = scope.node.tryGetContext(key);
    if (keyValue === undefined) {
      return false;
    }

    if (typeof keyValue === 'string') return keyValue.trim() !== '';

    return true;
  }
}
