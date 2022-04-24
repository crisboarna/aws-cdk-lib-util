import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

/**
 * Properties for retrieving a security group
 */
export interface GetVPCProps {
  readonly scope: Construct;
  readonly projectName: string;
  readonly stackEnv: string;
  readonly paramNameVpcId: string;
  readonly paramNameVpcName: string;
  readonly uniqueKey?: string;
}

/**
 * Provides VPC utility functions
 */
export class VpcUtil {
  /**
   * ```typescript
   * import { VpcUtil } from 'aws-cdk-lib-util';
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
   *     const vpc = StackUtils.getVPC({
   *       scope: this,
   *       projectName,
   *       stackEnv
   *     });
   *   ...
   *   }
   * }
   * ```
   * @param scope
   * @param projectName
   * @param stackEnv
   * @param paramNameVpcId
   * @param paramNameVpcName
   * @param uniqueKey
   */
  public static getVpc = ({
    scope,
    projectName,
    stackEnv,
    paramNameVpcId,
    paramNameVpcName,
    uniqueKey,
  }: GetVPCProps) => {
    const [vpcId, vpcName] = [
      `/${projectName.toLowerCase()}/${paramNameVpcId}${stackEnv.toLowerCase()}`,
      `/${projectName.toLowerCase()}/${paramNameVpcName}${stackEnv.toLowerCase()}`,
    ].map((paramName) => StringParameter.valueFromLookup(scope, paramName));

    return Vpc.fromLookup(scope, `${projectName}-VPC${uniqueKey}-${stackEnv}`, {
      vpcName,
      vpcId,
      isDefault: false,
    });
  };
}
