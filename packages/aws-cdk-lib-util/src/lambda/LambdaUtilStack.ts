import { Duration, Environment, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IVpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import {
  AssetCode,
  Code,
  FunctionProps,
  LayerVersion,
  Runtime,
  Function,
  Tracing,
  Alias,
  IFunction,
  IAlias,
} from 'aws-cdk-lib/aws-lambda';
import { Queue, QueueEncryption } from 'aws-cdk-lib/aws-sqs';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Alarm, TreatMissingData } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import {
  LambdaDeploymentGroup,
  ILambdaDeploymentConfig,
  LambdaDeploymentConfig,
} from 'aws-cdk-lib/aws-codedeploy';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { ILayerVersion } from 'aws-cdk-lib/aws-lambda/lib/layers';
import { IBaseStackProps } from '../interfaces';
import { SSMUtil } from '../ssm';
import { SecurityGroupUtil } from '../sg';
import { VpcUtil } from '../vpc';

/**
 * Properties for extraActions function of LambdaProps. Provides the parameters
 * exposed from within the stack for extra configurations of linking systems
 */
export interface ILambdaActionProps {
  scope: Construct;
  stackEnv: string;
  lambda: IFunction;
  lambdaAlias: IAlias;
  lambdaName: string;
  lambdaSG: SecurityGroup;
  lambdaRole: Role;
}

/**
 * Properties for configuring the LambdaUtilStack. Provides all the standard
 * and optional parameters configuring the extra options with best practices
 * built-in
 */
export interface LambdaProps {
  readonly alarmTopicParam: string;
  readonly artifactPath: string;
  readonly deploymentConfig?: ILambdaDeploymentConfig;
  readonly environmentGeneration?: (
    scope: Construct,
    stackEnv: string
  ) => Record<string, string>;
  readonly isInVpc: boolean;
  readonly isProvisioned?: boolean;
  readonly layers?: {
    artifactPath?: string;
    compatibleVersions?: Runtime[];
    paramName?: string;
    arn?: string;
  }[];
  readonly managedPolicies?: string[];
  readonly memorySize?: number;
  readonly name: string;
  readonly paramName: string;
  readonly paramNameRole: string;
  readonly paramVpcSGName?: string;
  readonly provisioningConfig?: {
    readonly minCapacity?: number;
    readonly maxCapacity?: number;
    readonly utilizationTarget?: number;
  };
  readonly vpcConfig?: {
    readonly paramNameVpcId: string;
    readonly paramNameVpcName: string;
  };
  readonly handler?: string;
  readonly policies: (env: Environment, stackEnv: string) => PolicyStatement[];
  readonly runtime?: Runtime;
  readonly timeout?: number;
  readonly extraActions?: (lambda: ILambdaActionProps) => void;
}

export type ILambdaUtilProps = {
  readonly lambda: LambdaProps;
};

export type ILambdaUtilStackProps = ILambdaUtilProps & IBaseStackProps;

/**
 * This stack provides an `L3` equivalent construct that creates a Lambda with:
 * 1. Versioning and Aliasing, each Cloudformation deployment releases a new version and updates alias
 * 2. Extra actions that allow configuring external interactions with the lambda by providing the `scope`, `alias`, `role` and [other](src/lambda/LambdaUtilStack.ts)
 * 3. SQS DLQ
 * 4. Alarms sent to SNS topic
 * 5. Layers support via arn, zip, parameter store arn
 * 6. VPC support
 * 7. Role generation per environment
 *
 * ```typescript
 * import { App } from 'aws-cdk-lib';
 * import { LambdaUtilStack } from 'aws-cdk-lib-util';
 *
 * const app = new App();
 *
 * export const lambdaCvExport: LambdaProps = {
 *   alarmTopicParam: `/${PROJECT_NAME_MAIN.toLowerCase()}${PARAM_SNS_ALARMS_ARN}`,
 *   artifactPath: artifactPathCvExport,
 *   environmentGeneration: () => ({
 *     APP_NAME: nameCapitalizedCvExport,
 *     CV_URL: `cv.${process.env.CDK_DOMAIN_NAME}`,
 *   }),
 *   extraActions: ({ lambdaAlias }) =>
 *     lambdaAlias.grantInvoke(
 *       new ServicePrincipal('cloudformation.amazonaws.com')
 *     ),
 *   isInVpc: false,
 *   isProvisioned: false,
 *   managedPolicies: ['service-role/AWSLambdaBasicExecutionRole'],
 *   memorySize: 1024,
 *   layers: [{ paramName: PARAM_LAMBDA_CV_EXPORT_LAYER_ARN }],
 *   name: `${PROJECT_NAME}-${nameCapitalizedCvExport}`,
 *   paramName: PARAM_LAMBDA_CV_EXPORT_ALIAS_ARN,
 *   paramNameRole: PARAM_LAMBDA_CV_EXPORT_ROLE_ARN,
 *   runtime: Runtime.NODEJS_14_X,
 *   policies: (env, stackEnv) =>
 *     getApiIAMPolicies(lambdaNameCvExport)(env, PROJECT_NAME, stackEnv),
 * };
 *
 * const lambda = new LambdaUtilStack(
 *   app,
 *   `${PROJECT_NAME}-Lambda-API-${process.ENV}`,
 *   lambdaCvExport
 * );
 * ```
 */
export class LambdaUtilStack extends Stack {
  constructor(scope: Construct, id: string, props: ILambdaUtilStackProps) {
    super(scope, id, props);

    const { env, lambda, projectName, stackEnv } = props;

    const {
      artifactPath,
      alarmTopicParam,
      deploymentConfig,
      environmentGeneration,
      extraActions,
      handler,
      isInVpc,
      isProvisioned,
      layers,
      managedPolicies,
      memorySize,
      name,
      paramVpcSGName,
      paramName,
      paramNameRole,
      provisioningConfig,
      policies,
      runtime,
      timeout,
      vpcConfig,
    } = lambda;

    let lambdaSG;

    let vpc: IVpc;

    const alarmTopicArn = <string>SSMUtil.getSSMParameter({
      scope: this,
      projectName,
      stackEnv,
      paramName: alarmTopicParam,
    });

    const alarmTopic = Topic.fromTopicArn(
      this,
      `${projectName}-${lambda.name}-Alarm-Topic-${stackEnv}`,
      alarmTopicArn
    );

    if (isInVpc) {
      if (!vpcConfig) {
        throw new Error(
          'If `isInVpc` is set to true, `vpcConfig` must be provided.'
        );
      }

      const { paramNameVpcName, paramNameVpcId } = vpcConfig;
      vpc = VpcUtil.getVpc({
        scope: this,
        projectName,
        stackEnv,
        paramNameVpcName,
        paramNameVpcId,
      });

      lambdaSG = SecurityGroupUtil.createSecurityGroup({
        scope: this,
        vpc,
        projectName,
        stackEnv,
        securityGroupName: name.substring(projectName.length + 1),
      });
    }

    const extraManagedPolicies = managedPolicies
      ? managedPolicies.map((policy) =>
          ManagedPolicy.fromAwsManagedPolicyName(policy)
        )
      : [];

    const lambdaRole = new Role(this, `${name}-Role-${stackEnv}`, {
      roleName: `${name}-Role-${stackEnv}`,
      description: `${name} API Lambda Role`,
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AWSXrayWriteOnlyAccess'),
        ...extraManagedPolicies,
      ],
    });

    policies(env, stackEnv).forEach((policy) => lambdaRole.addToPolicy(policy));

    const lambdaLayers: ILayerVersion[] = [];

    (layers ?? []).map((layer, idx) => {
      if (layer.artifactPath && layer.compatibleVersions) {
        const layerNameParts = layer.artifactPath.split('/');
        const layerName = layerNameParts[layerNameParts.length - 1];

        lambdaLayers.push(
          new LayerVersion(
            this,
            `${name}-Layer-${layer.artifactPath.substring(15)}`,
            {
              code: Code.fromAsset(layer.artifactPath),
              layerVersionName: `${name}-${layerName.substring(
                0,
                layerName.length - 4
              )}`,
              description: `${name} Layer ${layerName}`,
              removalPolicy: RemovalPolicy.RETAIN,
            }
          )
        );
      } else if (layer.arn) {
        lambdaLayers.push(
          LayerVersion.fromLayerVersionArn(
            this,
            `${projectName}-Layer-${idx}-${stackEnv}`,
            layer.arn
          )
        );
      } else {
        const layerArn = <string>SSMUtil.getSSMParameter({
          scope: this,
          projectName,
          stackEnv,
          paramName: layer.paramName,
        });

        lambdaLayers.push(
          LayerVersion.fromLayerVersionArn(
            this,
            `${projectName}-Layer-${idx}-${stackEnv}`,
            layerArn
          )
        );
      }
    });

    const deadLetterQueue = new Queue(this, `${lambda.name}-DLQ-${stackEnv}`, {
      queueName: `${lambda.name}-DLQ-${stackEnv}`,
      encryption: QueueEncryption.KMS_MANAGED,
    });

    let lambdaProps: FunctionProps = {
      functionName: `${name}-${stackEnv}`,
      deadLetterQueue,
      deadLetterQueueEnabled: true,
      description: `Lambda containing ${name} API functionality`,
      code: new AssetCode(artifactPath),
      handler: handler ?? 'main.handler',
      runtime: runtime ?? Runtime.NODEJS_14_X,
      memorySize: memorySize ?? 256,
      timeout: Duration.seconds(timeout ?? 25),
      tracing: Tracing.ACTIVE,
      environment: {
        PROJECT_NAME: projectName,
        CREATION_DATE: new Date().toISOString(),
        CLOUD_DEPLOYED: 'true',
        ENV: stackEnv,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        REGION: env!.region!,
        ...(environmentGeneration ? environmentGeneration(this, stackEnv) : {}),
      },
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.RETAIN,
        retryAttempts: 1,
      },
      role: lambdaRole,
    };

    if (layers && layers.length > 0) {
      lambdaProps = {
        ...lambdaProps,
        layers: lambdaLayers,
      };
    }

    const lambdaFunction = new Function(this, `${name}`, lambdaProps);

    new LogGroup(this, `${name}-Logs`, {
      logGroupName: `/aws/lambda/${name}-${stackEnv}`,
      retention: RetentionDays.ONE_MONTH,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const alias = new Alias(this, `${name}-Alias-${stackEnv}`, {
      aliasName: stackEnv,
      version: lambdaFunction.currentVersion,
    });

    const dlqAlarm = new Alarm(this, `${lambda.name}-DLQ-Alarm-${stackEnv}`, {
      alarmName: `${lambda.name}-${stackEnv}-DLQ`,
      alarmDescription: `Alarm that monitors ${lambda.name} DLQ Depth`,
      metric: deadLetterQueue.metricApproximateNumberOfMessagesVisible(),
      threshold: 1,
      evaluationPeriods: 1,
      treatMissingData: TreatMissingData.NOT_BREACHING,
    });

    dlqAlarm.addAlarmAction(new SnsAction(alarmTopic));

    // const durationAlarm = new Alarm(
    //     this,
    //     `${lambda.name}-Duration-Alarm-${stackEnv}`,
    //     {
    //       alarmName: `${lambda.name}-${stackEnv}-Duration`,
    //       alarmDescription: `Alarm that monitors ${lambda.name} invocation duration`,
    //       metric: alias.metricDuration(),
    //       threshold: 4000,
    //       evaluationPeriods: 1,
    //       treatMissingData: TreatMissingData.NOT_BREACHING,
    //     }
    // );
    //
    // durationAlarm.addAlarmAction(new SnsAction(alarmTopic));
    //
    // const throttleAlarm = new Alarm(
    //     this,
    //     `${lambda.name}-Throttle-Alarm-${stackEnv}`,
    //     {
    //       alarmName: `${lambda.name}-${stackEnv}-Throttle`,
    //       alarmDescription: `Alarm that monitors ${lambda.name} throttle count`,
    //       metric: alias.metricThrottles(),
    //       threshold: 20,
    //       evaluationPeriods: 1,
    //       treatMissingData: TreatMissingData.NOT_BREACHING,
    //     }
    // );
    //
    // throttleAlarm.addAlarmAction(new SnsAction(alarmTopic));
    //
    const errorAlarm = new Alarm(
      this,
      `${lambda.name}-Rollback-Alarm-${stackEnv}`,
      {
        alarmName: `${lambda.name}-${stackEnv}-Error`,
        alarmDescription: `Alarm that monitors ${lambda.name} Errors and performs deployment rollback on release`,
        metric: alias.metricErrors(),
        threshold: 1,
        evaluationPeriods: 1,
        treatMissingData: TreatMissingData.NOT_BREACHING,
      }
    );

    errorAlarm.addAlarmAction(new SnsAction(alarmTopic));

    new LambdaDeploymentGroup(
      this,
      `${lambda.name}-DeploymentGroup-${stackEnv}`,
      {
        alias,
        deploymentGroupName: `${lambda.name}-Deployment-Group-${stackEnv}`,
        deploymentConfig:
          deploymentConfig ?? LambdaDeploymentConfig.ALL_AT_ONCE,
        alarms: [errorAlarm],
      }
    );

    if (isProvisioned) {
      const scalingTarget = alias.addAutoScaling({
        minCapacity: provisioningConfig?.minCapacity ?? 1,
        maxCapacity: provisioningConfig?.maxCapacity ?? 10,
      });

      scalingTarget.scaleOnUtilization({
        utilizationTarget: provisioningConfig?.utilizationTarget ?? 0.7,
      });
    }

    extraActions &&
      extraActions({
        scope: this,
        stackEnv,
        lambda: lambdaFunction,
        lambdaAlias: alias,
        lambdaName: name,
        lambdaRole: lambdaRole,
        lambdaSG: lambdaSG,
      });

    if (isInVpc && paramVpcSGName) {
      SSMUtil.createSSMParameter({
        scope: this,
        stackEnv,
        projectName,
        paramName: paramVpcSGName,
        value: lambdaSG.securityGroupId,
      });
    }

    SSMUtil.createSSMParameter({
      scope: this,
      stackEnv,
      projectName,
      paramName,
      value: alias.functionArn,
    });

    SSMUtil.createSSMParameter({
      scope: this,
      stackEnv,
      projectName,
      paramName: paramNameRole,
      value: lambdaRole.roleArn,
    });
  }
}
