import { IVpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

/***
 * Properties for creating a security group
 */
export interface SecurityGroupCreateProps {
  readonly vpc: IVpc;
  readonly scope: Construct;
  readonly securityGroupName: string;
  readonly projectName: string;
  readonly stackEnv: string;
  readonly allowAllOutbound?: boolean;
}

/***
 * Properties for retrieving a security group from an SSM parameter
 */
export interface SecurityGroupGetProps {
  readonly scope: Construct;
  readonly projectName: string;
  readonly stackEnv: string;
  readonly paramName: string;
  readonly uniqueKey?: string;
}

/**
 * Provides Security Group utility functions
 */
export class SecurityGroupUtil {
  /**
   * Helps in creating a standardized `Security Group` with a standardized name following the pattern:
   *
   * ```markdown
   * `${projectName}-${securityGroupName.toUpperCase()}-SG-${stackEnv}`
   * ```
   * **Example:**
   *
   * projectName: `MyProject`
   *
   * securityGroupName: `API`
   *
   * stackEnv: `DEV`
   *
   * Result: `MyProject-API-SG-DEV`
   * ```typescript
   * import { SecurityGroupUtil } from 'aws-cdk-lib-util';
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
   *     SecurityGroupUtil.createSecurityGroup({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       securityGroupName: 'API',
   *     });
   *   ...
   *   }
   * }
   * ```
   * @param scope
   * @param vpc
   * @param projectName
   * @param stackEnv
   * @param securityGroupName
   * @param allowAllOutbound
   */
  public static createSecurityGroup = ({
    scope,
    vpc,
    projectName,
    stackEnv,
    securityGroupName,
    allowAllOutbound,
  }: SecurityGroupCreateProps) =>
    new SecurityGroup(scope, `${securityGroupName}-SG`, {
      vpc,
      allowAllOutbound,
      securityGroupName: `${projectName}-${securityGroupName.toUpperCase()}-SG-${stackEnv}`,
      description: `SG where ${securityGroupName} is placed.`,
    });

  /**
   * Performs a two-step process.
   * 1. Retrieves value from `SSM` `Parameter Store` given specified parameter name.
   * 2. Retrieves `SecurityGroup` object associated with the id above.
   *
   * **Note**
   * The `SSM` parameter name must adhere to the naming convention specified in [Parameter naming](#parameter-naming).
   * ```typescript
   * import { SecurityGroupUtil } from 'aws-cdk-lib-util';
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
   *     // looks for SSM param with name /${projectName.toLowerCase()}/vpc/sg/api/${stackEnv.toLowerCase()}
   *     const apiSG = SecurityGroupUtil.getSecurityGroupFromId({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       paramName: 'vpc/sg/api/',
   *     });
   *
   *     // looks for SSM param with name /executorsproject/vpc/sg/worker/${stackEnv.toLowerCase()}
   *     const executorSG = SecurityGroupUtil.getSecurityGroupFromId({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       paramName: '/executorsproject/vpc/sg/worker/',
   *     });
   *   ...
   *   }
   * }
   * ```
   * @param scope
   * @param projectName
   * @param stackEnv
   * @param paramName
   * @param uniqueKey
   */
  public static getSecurityGroupFromId = ({
    scope,
    projectName,
    stackEnv,
    paramName,
    uniqueKey,
  }: SecurityGroupGetProps) => {
    let fullParamName;

    if (paramName.startsWith('/')) {
      fullParamName = `${paramName}${stackEnv.toLowerCase()}`;
    } else {
      fullParamName = `/${projectName.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}`;
    }

    const ssmParamSGId = StringParameter.fromStringParameterName(
      scope,
      `${fullParamName.substring(7)}-StringParam-${uniqueKey}-${stackEnv}`,
      fullParamName
    ).stringValue;

    return SecurityGroup.fromSecurityGroupId(
      scope,
      `${paramName}-${uniqueKey}-SG-${stackEnv}`,
      ssmParamSGId,
      { allowAllOutbound: false }
    );
  };
}
