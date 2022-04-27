import { Construct } from 'constructs';
import {
  ParameterTier,
  StringListParameter,
  StringParameter,
} from 'aws-cdk-lib/aws-ssm';

/***
 * Properties for creating a SSM parameter
 */
export interface SSMParamCreateProps {
  readonly scope: Construct;
  readonly paramName: string;
  readonly projectName: string;
  readonly stackEnv: string;
  readonly value: string;
  readonly uniqueKey?: string;
  readonly tier?: ParameterTier;
}

/***
 * Properties for creating an SSM parameter list
 */
export interface SSMParamListCreateProps {
  readonly scope: Construct;
  readonly paramName: string;
  readonly projectName: string;
  readonly stackEnv: string;
  readonly value: string[];
  readonly tier?: ParameterTier;
}

/***
 * Properties for retrieving an SSM parameter/list/secret
 */
export interface SSMParamGetProps {
  readonly scope: Construct;
  readonly paramName: string;
  readonly projectName: string;
  readonly stackEnv: string;
  readonly extract?: boolean;
  readonly uniqueKey?: string;
}

/**
 * Provides Parameter Store utility functions
 * **Note**
 * All the `paramName` from this class adhere to the [Parameter naming](#parameter-naming) convention.
 */
export class SSMUtil {
  /**
   * ```typescript
   * import { SSMUtil } from 'aws-cdk-lib-util';
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
   *     const paramName = 'vpc/sg/id/lambda';
   *     const apiSG = SecurityGroupUtil.createSecurityGroup({
   *       ...
   *     });
   *
   *     SSMUtil.createSSMParameter({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       paramName: paramName,
   *       value: apiSG.securityGroupId,
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
   * @param uniqueKey
   * @param tier
   */
  public static createSSMParameter = ({
    scope,
    projectName,
    stackEnv,
    paramName,
    value,
    uniqueKey,
    tier,
  }: SSMParamCreateProps) =>
    new StringParameter(
      scope,
      `${projectName}-${paramName}${uniqueKey !== undefined ? uniqueKey : ''}`,
      {
        description: `${projectName}`,
        parameterName: paramName.startsWith('/')
          ? `${paramName}${stackEnv.toLowerCase()}`
          : `/${projectName.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}`,
        stringValue: value,
        tier: tier ?? ParameterTier.STANDARD,
      }
    );

  /**
   * ```typescript
   * import { SSMUtil } from 'aws-cdk-lib-util';
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
   *     const paramName = 'sn/topics/alarms';
   *
   *     SSMUtil.createSSMParameterList({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       paramName: paramName,
   *       value: [...],
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
   * @param tier
   */
  public static createSSMParameterList = ({
    scope,
    projectName,
    stackEnv,
    paramName,
    value,
    tier,
  }: SSMParamListCreateProps) =>
    new StringListParameter(scope, `${projectName}-${paramName}`, {
      description: `${projectName}`,
      parameterName: paramName.startsWith('/')
        ? `${paramName}${stackEnv.toLowerCase()}`
        : `/${projectName.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}`,
      stringListValue: value,
      tier: tier ?? ParameterTier.STANDARD,
    });

  /**
   * ```typescript
   * import { SSMUtil } from 'aws-cdk-lib-util';
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
   *     const paramName = 'vpc/sg/id/api';
   *
   *     const apiSgId = SSMUtil.getSSMParameter({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       paramName: paramName,
   *     });
   *   ...
   *   }
   * }
   * ```
   * @param scope
   * @param paramName
   * @param projectName
   * @param stackEnv
   * @param uniqueKey
   * @param extract
   */
  public static getSSMParameter = ({
    scope,
    paramName,
    projectName,
    stackEnv,
    uniqueKey,
    extract,
  }: SSMParamGetProps) => {
    const extractValue = extract || extract === undefined;

    let fullParamName;

    if (paramName.startsWith('/')) {
      fullParamName = `${paramName}${stackEnv.toLowerCase()}`;
    } else {
      fullParamName = `/${projectName.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}`;
    }
    const paramVal = StringParameter.fromStringParameterName(
      scope,
      `${fullParamName}${uniqueKey}`,
      fullParamName
    );

    return extractValue ? paramVal.stringValue : paramVal;
  };

  /**
   * ```typescript
   * import { SSMUtil } from 'aws-cdk-lib-util';
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
   *     const paramName = 'sn/arn/topics/alarms';
   *
   *     const snsAlarmTopicArns = SSMUtil.getSSMParameterList({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       paramName: paramName,
   *     });
   *   ...
   *   }
   * }
   * ```
   * @param scope
   * @param paramName
   * @param projectName
   * @param stackEnv
   * @param extract
   * @param uniqueKey
   */
  public static getSSMParameterList = ({
    scope,
    paramName,
    projectName,
    stackEnv,
    extract,
    uniqueKey,
  }: SSMParamGetProps) => {
    const extractValue = extract || extract === undefined;

    let fullParamName;

    if (paramName.startsWith('/')) {
      fullParamName = `${paramName}${stackEnv.toLowerCase()}`;
    } else {
      fullParamName = `/${projectName.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}`;
    }

    const paramVal = StringListParameter.fromStringListParameterName(
      scope,
      `${fullParamName}${uniqueKey}`,
      fullParamName
    );

    return extractValue ? paramVal.stringListValue : paramVal;
  };

  /**
   * ```typescript
   * import { SSMUtil } from 'aws-cdk-lib-util';
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
   *     const paramName = 'api/key/sendgrid/';
   *
   *     const sendGridKey = SSMUtil.getSSMSecureParameter({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       paramName: paramName,
   *     });
   *   ...
   *   }
   * }
   * ```
   * @param scope
   * @param paramName
   * @param projectName
   * @param stackEnv
   * @param uniqueKey
   */
  public static getSSMSecureParameter = ({
    scope,
    paramName,
    projectName,
    stackEnv,
    uniqueKey,
  }: SSMParamGetProps) => {
    let fullParamName;

    if (paramName.startsWith('/')) {
      fullParamName = `${paramName}${stackEnv.toLowerCase()}`;
    } else {
      fullParamName = `/${projectName.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}`;
    }

    StringParameter.fromSecureStringParameterAttributes(
      scope,
      `${fullParamName}${uniqueKey}`,
      {
        parameterName: fullParamName,
      }
    );
  };
}
