import { Construct } from 'constructs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

/**
 * Properties for creating a Secrets Manager secret
 */
export interface SMParamCreateProps {
  readonly scope: Construct;
  readonly paramName: string;
  readonly projectName: string;
  readonly stackEnv: string;
  readonly value: Record<string, string>;
}

export class SecretManagerUtil {
  /**
   * Creates `Secrets Manager` secret while adhering to same naming convention mentioned in [Parameter naming](#parameter-naming)
   * ```typescript
   * import { SecretManagerUtil } from 'aws-cdk-lib-util';
   * ...
   *
   * export class YourStack extends Stack {
   *   constructor(scope: Construct, id: string, props: IYourStackProps) {
   *     super(scope, id, props);
   *
   *     const {
   *       projectName,
   *       stackEnv,
   *       secret
   *     } = props;
   *     ...
   *     const paramName = 'db/rds/auth/';
   *     const paramValue = {secret};
   *
   *     SecretManagerUtil.createSecretManagerSecret({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       paramName: paramName,
   *       value: paramValue,
   *     });
   *   ...
   *   }
   * }
   * ```
   * @param scope
   * @param projectName
   * @param stackEnv
   * @param paramName
   * @param value
   */
  public static createSecretManagerSecret = ({
    scope,
    projectName,
    stackEnv,
    paramName,
    value,
  }: SMParamCreateProps) => {
    return new Secret(scope, `${projectName}${paramName}`, {
      secretName: `${paramName}${stackEnv.toLowerCase()}`,
      description: `${projectName}`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify(value),
        generateStringKey: '_ignore',
      },
    });
  };
}
