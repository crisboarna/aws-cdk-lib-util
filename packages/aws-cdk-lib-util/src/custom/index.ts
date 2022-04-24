import { Construct } from 'constructs';
import { Arn, CustomResource, Environment } from 'aws-cdk-lib';
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  AwsSdkCall,
  PhysicalResourceId,
  Provider,
} from 'aws-cdk-lib/custom-resources';
import { Function } from 'aws-cdk-lib/aws-lambda';

/***
 * Properties for an AWS SDK call via custom resource
 */
export interface SSMParamGetViaCustomResourceProps {
  readonly scope: Construct;
  readonly account: Environment;
  readonly paramName: string;
  readonly functionName: string;
  readonly assumeRoleName?: string;
  readonly projectName: string;
  readonly stackEnv: string;
}

/**
 * Properties for a custom resource execution during Cloudformation deployment
 */
export interface ActionViaCustomResourceProps {
  readonly scope: Construct;
  readonly functionArn: string;
  readonly projectName: string;
  readonly stackEnv: string;
  readonly uniqueKey?: string;
  readonly resourceProperties?: Record<string, string>;
}

/**
 * This utility class provides shorthand access to both `Custom::AWS` and `AWS::CloudFormation::CustomResource` resources.
 */
export class CDKCustomResourceUtil {
  /**
   * This allows cross-account/region querying of `Systems Manager` `Parameter Store` entries from within `CDK` code which can then be used within the same stack.
   * This uses behind the scenes the `AWS CDK` `Provider` framework to resolve via custom lambda's the call in the appropriate account location.
   * ```typescript
   * import { CDKCustomResourceUtil } from 'aws-cdk-lib-util';
   * ...
   * export class YourStack extends Stack {
   *   constructor(scope: Construct, id: string, props: IYourStackProps) {
   *     super(scope, id, props);
   *
   *     const {
   *       projectName,
   *       stackEnv,
   *       functionName,
   *       targetParamName,
   *       targetAccount
   *     } = props;
   *     ...
   *     const parameterValue = const CDKCustomResourceUtil.getSSMParamViaCustomResource({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       functionName,
   *       account: targetAccount,
   *       paramName: targetParamName,
   *     });
   *     ...
   *   }
   * }
   * ```
   * @param scope
   * @param projectName
   * @param stackEnv
   * @param account
   * @param paramName
   * @param functionName
   * @param assumeRoleName
   */
  public static getSSMParamViaCustomResource = ({
    scope,
    projectName,
    stackEnv,
    account,
    paramName,
    functionName,
    assumeRoleName,
  }: SSMParamGetViaCustomResourceProps) => {
    let fullParamName;
    if (paramName.startsWith('/')) {
      fullParamName = `${paramName}${stackEnv.toLowerCase()}`;
    } else {
      fullParamName = `/${projectName.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}`;
    }

    const awsSdkCall: AwsSdkCall = {
      assumedRoleArn: assumeRoleName
        ? Arn.format({
            partition: 'aws',
            account: account.account,
            region: account.region,
            service: 'iam',
            resource: 'role',
            resourceName: assumeRoleName,
          })
        : undefined,
      service: 'SSM',
      action: 'getParameter',
      region: account.region,
      parameters: {
        Name: fullParamName,
      },
      physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
    };

    const customResource = new AwsCustomResource(
      scope,
      `${projectName}-Infra-${functionName}-${stackEnv}`,
      {
        functionName: `${projectName}-Infra-${functionName}-${stackEnv}`,
        onCreate: awsSdkCall,
        onUpdate: awsSdkCall,
        policy: AwsCustomResourcePolicy.fromSdkCalls({
          resources: [
            Arn.format({
              partition: 'aws',
              account: account.account,
              region: account.region,
              service: 'ssm',
              resource: 'parameter',
              resourceName: fullParamName.slice(1),
            }),
          ],
        }),
      }
    );

    return customResource.getResponseField('Parameter.Value');
  };

  /**
   * To be used when you need to perform custom actions during a `Cloudformation` stack deployment via a custom lambda.
   * Custom lambda is to be provisioned separately, via [LambdaUtilStack](#LambdaUtilStack) ;) for example and the function is to be passed in as the target to be invoked during `onCreate`, `onUpdate` `onDelete` lifecycle events.
   *
   * ```typescript
   * import { CDKCustomResourceUtil } from 'aws-cdk-lib-util';
   * import { LambdaUtilStack } from "./LambdaUtilStack";
   *
   * ...
   *
   * export class YourStack extends Stack {
   *   constructor(scope: Construct, id: string, props: IYourStackProps) {
   *     super(scope, id, props);
   *
   *     const {
   *       projectName,
   *       stackEnv,
   *       lambdaConfig,
   *       functionName,
   *       targetParamName,
   *       targetAccount,
   *     } = props;
   *     ...
   *     const lambda = new Function(...);
   *
   *     CDKCustomResourceUtil.actionViaCustomResource({
   *       scope: this,
   *       projectName,
   *       stackEnv,
   *       functionArn: lambda.functionArn,
   *     });
   *   ...
   *   }
   * }
   * ```
   * @param scope
   * @param projectName
   * @param stackEnv
   * @param functionArn
   * @param uniqueKey
   * @param resourceProperties
   */
  public static actionViaCustomResource = ({
    scope,
    projectName,
    stackEnv,
    functionArn,
    uniqueKey,
    resourceProperties,
  }: ActionViaCustomResourceProps) => {
    const onEventHandler = Function.fromFunctionAttributes(
      scope,
      `${projectName}-${uniqueKey}-Import-${stackEnv}`,
      {
        functionArn,
        sameEnvironment: true,
      }
    );

    const provider = new Provider(
      scope,
      `${projectName}-${uniqueKey}-Provider-${stackEnv}`,
      {
        providerFunctionName: `${projectName}-${uniqueKey}-Provider-${stackEnv}`,
        onEventHandler,
      }
    );

    return new CustomResource(
      scope,
      `${projectName}-${uniqueKey}-Custom-Resource-${stackEnv}`,
      {
        serviceToken: provider.serviceToken,
        properties: resourceProperties,
      }
    );
  };
}
