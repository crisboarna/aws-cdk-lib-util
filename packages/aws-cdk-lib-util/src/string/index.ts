/**
 * Provides string manipulation functions for CDK purposes
 */
export class CDKStringUtil {
  /**
   * ```typescript
   * import { CDKStringUtil } from 'aws-cdk-lib-util';
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
   *
   *     const lambda = new Function(this,`${projectName}-Lambda-API-${stackEnv}`, {
   *       functionName: `${projectName}-${CDKStringUtil.capitalizeInputString('lambda-api')}-${stackEnv}`
   *       ...
   *     });
   *   ...
   *   }
   * }
   * ```
   * @param input
   */
  public static capitalizeInputString = (input: string) =>
    input
      .split('-')
      .map((fragment) => fragment.charAt(0).toUpperCase() + fragment.slice(1))
      .join('-');
}
