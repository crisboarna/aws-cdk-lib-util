import { App, Duration } from 'aws-cdk-lib';
import { CDKDirectoryUtil, LambdaUtilStack, SSMUtil } from '../../src';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { LambdaProps } from '../../src/lambda/LambdaUtilStack';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaDeploymentConfig } from 'aws-cdk-lib/aws-codedeploy';

describe('LambdaUtilStack', () => {
  // given
  let app;
  let lambdaConfig: LambdaProps;
  const artifactPath = '/tmp/lambda-test/lambda.zip';
  const projectName = 'projectName';
  const stackEnv = 'stackEnv';
  const paramName = `/${projectName}/lambda/api/oauth/`;
  const paramNameRole = `/${projectName}/lambda/role/api/oauth/`;
  const alarmTopicParam = `/${projectName}/sns/alarm/`;
  const paramValue = { password: 'secret' };
  const name = `${projectName}-API`;

  beforeAll(() => CDKDirectoryUtil.checkArtifactFileExists(artifactPath));

  beforeEach(() => {
    app = new App();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    lambdaConfig = {
      artifactPath,
      alarmTopicParam,
      isInVpc: false,
      isProvisioned: false,
      name,
      paramName,
      paramNameRole,
      policies: () => [],
    };
  });

  it('throws given no vpc', () => {
    //given
    expect(
      () =>
        new LambdaUtilStack(app, 'LambdaUtilStack', {
          env: {
            account: '1234567890123',
            region: 'us-east-1',
          },
          lambda: {
            ...lambdaConfig,
            isInVpc: true,
          },
          projectName,
          stackEnv,
        })
    ).toThrow('If `isInVpc` is set to true, `vpcConfig` must be provided.');
  });

  it('default', () => {
    //given
    const stack = new LambdaUtilStack(app, 'LambdaUtilStack', {
      env: {
        account: '1234567890123',
        region: 'us-east-1',
      },
      lambda: lambdaConfig,
      projectName,
      stackEnv,
    });

    //when
    const template = Template.fromStack(stack);

    //then
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      Description: `${projectName}-API API Lambda Role`,
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/AWSXrayWriteOnlyAccess',
            ],
          ],
        },
      ],
      RoleName: `${name}-Role-${stackEnv}`,
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [Match.anyValue(), 'Arn'],
            },
          },
          {
            Action: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });

    template.hasResourceProperties('AWS::SQS::Queue', {
      KmsMasterKeyId: 'alias/aws/sqs',
      QueueName: `${name}-DLQ-stackEnv`,
    });

    template.hasResourceProperties('AWS::Lambda::Function', {
      Role: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      DeadLetterConfig: {
        TargetArn: {
          'Fn::GetAtt': [Match.anyValue(), 'Arn'],
        },
      },
      Description: `Lambda containing ${name} API functionality`,
      Environment: {
        Variables: {
          CLOUD_DEPLOYED: 'true',
          ENV: stackEnv,
          PROJECT_NAME: projectName,
          REGION: 'us-east-1',
        },
      },
      FunctionName: `${name}-${stackEnv}`,
      Handler: 'main.handler',
      MemorySize: 256,
      Runtime: 'nodejs14.x',
      Timeout: 25,
      TracingConfig: {
        Mode: 'Active',
      },
    });

    template.hasResource('AWS::Lambda::Version', 1);

    template.hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
      Qualifier: {
        'Fn::GetAtt': [Match.anyValue(), 'Version'],
      },
      MaximumRetryAttempts: 1,
    });

    template.hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: `/aws/lambda/${name}-${stackEnv}`,
      RetentionInDays: 30,
    });

    template.hasResourceProperties('AWS::Lambda::Alias', {
      FunctionVersion: {
        'Fn::GetAtt': [Match.anyValue(), 'Version'],
      },
      Name: stackEnv,
    });

    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      AlarmDescription: `Alarm that monitors ${name} DLQ Depth`,
      AlarmName: `${name}-${stackEnv}-DLQ`,
      Dimensions: [
        {
          Name: 'QueueName',
          Value: {
            'Fn::GetAtt': [Match.anyValue(), 'QueueName'],
          },
        },
      ],
      MetricName: 'ApproximateNumberOfMessagesVisible',
      Namespace: 'AWS/SQS',
      Period: 300,
      Statistic: 'Maximum',
      Threshold: 1,
      TreatMissingData: 'notBreaching',
    });

    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      AlarmDescription: `Alarm that monitors ${name} Errors and performs deployment rollback on release`,
      AlarmName: `${name}-${stackEnv}-Error`,
      Dimensions: [
        {
          Name: 'FunctionName',
        },
        {
          Name: 'Resource',
          Value: {
            'Fn::Join': [
              '',
              [
                {
                  Ref: Match.anyValue(),
                },
                ':stackEnv',
              ],
            ],
          },
        },
      ],
      MetricName: 'Errors',
      Namespace: 'AWS/Lambda',
      Period: 300,
      Statistic: 'Sum',
      Threshold: 1,
      TreatMissingData: 'notBreaching',
    });

    template.hasResourceProperties('AWS::CodeDeploy::Application', {
      ComputePlatform: 'Lambda',
    });

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'codedeploy.us-east-1.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSCodeDeployRoleForLambdaLimited',
            ],
          ],
        },
      ],
    });

    template.hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      ServiceRoleArn: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      AlarmConfiguration: {
        Alarms: [
          {
            Name: {
              Ref: Match.anyValue(),
            },
          },
        ],
        Enabled: true,
      },
      AutoRollbackConfiguration: {
        Enabled: true,
        Events: ['DEPLOYMENT_FAILURE', 'DEPLOYMENT_STOP_ON_ALARM'],
      },
      DeploymentConfigName: 'CodeDeployDefault.LambdaAllAtOnce',
      DeploymentGroupName: `${name}-Deployment-Group-${stackEnv}`,
      DeploymentStyle: {
        DeploymentOption: 'WITH_TRAFFIC_CONTROL',
        DeploymentType: 'BLUE_GREEN',
      },
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Type: 'String',
      Value: {
        Ref: Match.anyValue(),
      },
      Description: projectName,
      Name: `${paramName}${stackEnv.toLowerCase()}`,
      Tier: 'Standard',
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Type: 'String',
      Value: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      Description: 'projectName',
      Name: `${paramNameRole}${stackEnv.toLowerCase()}`,
      Tier: 'Standard',
    });
  });

  it('default with no default env', () => {
    //given
    const stack = new LambdaUtilStack(app, 'LambdaUtilStack', {
      env: {
        account: '1234567890123',
        region: 'us-east-1',
      },
      lambda: { ...lambdaConfig, environmentGenerationDefaults: false },
      projectName,
      stackEnv,
    });

    //when
    const template = Template.fromStack(stack);

    //then
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      Description: `${projectName}-API API Lambda Role`,
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/AWSXrayWriteOnlyAccess',
            ],
          ],
        },
      ],
      RoleName: `${name}-Role-${stackEnv}`,
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [Match.anyValue(), 'Arn'],
            },
          },
          {
            Action: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });

    template.hasResourceProperties('AWS::SQS::Queue', {
      KmsMasterKeyId: 'alias/aws/sqs',
      QueueName: `${name}-DLQ-stackEnv`,
    });

    template.hasResourceProperties('AWS::Lambda::Function', {
      Role: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      DeadLetterConfig: {
        TargetArn: {
          'Fn::GetAtt': [Match.anyValue(), 'Arn'],
        },
      },
      Description: `Lambda containing ${name} API functionality`,
      FunctionName: `${name}-${stackEnv}`,
      Handler: 'main.handler',
      MemorySize: 256,
      Runtime: 'nodejs14.x',
      Timeout: 25,
      TracingConfig: {
        Mode: 'Active',
      },
    });

    template.hasResource('AWS::Lambda::Version', 1);

    template.hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
      Qualifier: {
        'Fn::GetAtt': [Match.anyValue(), 'Version'],
      },
      MaximumRetryAttempts: 1,
    });

    template.hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: `/aws/lambda/${name}-${stackEnv}`,
      RetentionInDays: 30,
    });

    template.hasResourceProperties('AWS::Lambda::Alias', {
      FunctionVersion: {
        'Fn::GetAtt': [Match.anyValue(), 'Version'],
      },
      Name: stackEnv,
    });

    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      AlarmDescription: `Alarm that monitors ${name} DLQ Depth`,
      AlarmName: `${name}-${stackEnv}-DLQ`,
      Dimensions: [
        {
          Name: 'QueueName',
          Value: {
            'Fn::GetAtt': [Match.anyValue(), 'QueueName'],
          },
        },
      ],
      MetricName: 'ApproximateNumberOfMessagesVisible',
      Namespace: 'AWS/SQS',
      Period: 300,
      Statistic: 'Maximum',
      Threshold: 1,
      TreatMissingData: 'notBreaching',
    });

    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      AlarmDescription: `Alarm that monitors ${name} Errors and performs deployment rollback on release`,
      AlarmName: `${name}-${stackEnv}-Error`,
      Dimensions: [
        {
          Name: 'FunctionName',
        },
        {
          Name: 'Resource',
          Value: {
            'Fn::Join': [
              '',
              [
                {
                  Ref: Match.anyValue(),
                },
                ':stackEnv',
              ],
            ],
          },
        },
      ],
      MetricName: 'Errors',
      Namespace: 'AWS/Lambda',
      Period: 300,
      Statistic: 'Sum',
      Threshold: 1,
      TreatMissingData: 'notBreaching',
    });

    template.hasResourceProperties('AWS::CodeDeploy::Application', {
      ComputePlatform: 'Lambda',
    });

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'codedeploy.us-east-1.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSCodeDeployRoleForLambdaLimited',
            ],
          ],
        },
      ],
    });

    template.hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      ServiceRoleArn: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      AlarmConfiguration: {
        Alarms: [
          {
            Name: {
              Ref: Match.anyValue(),
            },
          },
        ],
        Enabled: true,
      },
      AutoRollbackConfiguration: {
        Enabled: true,
        Events: ['DEPLOYMENT_FAILURE', 'DEPLOYMENT_STOP_ON_ALARM'],
      },
      DeploymentConfigName: 'CodeDeployDefault.LambdaAllAtOnce',
      DeploymentGroupName: `${name}-Deployment-Group-${stackEnv}`,
      DeploymentStyle: {
        DeploymentOption: 'WITH_TRAFFIC_CONTROL',
        DeploymentType: 'BLUE_GREEN',
      },
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Type: 'String',
      Value: {
        Ref: Match.anyValue(),
      },
      Description: projectName,
      Name: `${paramName}${stackEnv.toLowerCase()}`,
      Tier: 'Standard',
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Type: 'String',
      Value: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      Description: 'projectName',
      Name: `${paramNameRole}${stackEnv.toLowerCase()}`,
      Tier: 'Standard',
    });
  });

  it('default with default env explicit', () => {
    //given
    const stack = new LambdaUtilStack(app, 'LambdaUtilStack', {
      env: {
        account: '1234567890123',
        region: 'us-east-1',
      },
      lambda: { ...lambdaConfig, environmentGenerationDefaults: true },
      projectName,
      stackEnv,
    });

    //when
    const template = Template.fromStack(stack);

    //then
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      Description: `${projectName}-API API Lambda Role`,
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/AWSXrayWriteOnlyAccess',
            ],
          ],
        },
      ],
      RoleName: `${name}-Role-${stackEnv}`,
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [Match.anyValue(), 'Arn'],
            },
          },
          {
            Action: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });

    template.hasResourceProperties('AWS::SQS::Queue', {
      KmsMasterKeyId: 'alias/aws/sqs',
      QueueName: `${name}-DLQ-stackEnv`,
    });

    template.hasResourceProperties('AWS::Lambda::Function', {
      Role: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      DeadLetterConfig: {
        TargetArn: {
          'Fn::GetAtt': [Match.anyValue(), 'Arn'],
        },
      },
      Description: `Lambda containing ${name} API functionality`,
      FunctionName: `${name}-${stackEnv}`,
      Handler: 'main.handler',
      MemorySize: 256,
      Runtime: 'nodejs14.x',
      Timeout: 25,
      TracingConfig: {
        Mode: 'Active',
      },
    });

    template.hasResource('AWS::Lambda::Version', 1);

    template.hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
      Qualifier: {
        'Fn::GetAtt': [Match.anyValue(), 'Version'],
      },
      MaximumRetryAttempts: 1,
    });

    template.hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: `/aws/lambda/${name}-${stackEnv}`,
      RetentionInDays: 30,
    });

    template.hasResourceProperties('AWS::Lambda::Alias', {
      FunctionVersion: {
        'Fn::GetAtt': [Match.anyValue(), 'Version'],
      },
      Name: stackEnv,
    });

    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      AlarmDescription: `Alarm that monitors ${name} DLQ Depth`,
      AlarmName: `${name}-${stackEnv}-DLQ`,
      Dimensions: [
        {
          Name: 'QueueName',
          Value: {
            'Fn::GetAtt': [Match.anyValue(), 'QueueName'],
          },
        },
      ],
      MetricName: 'ApproximateNumberOfMessagesVisible',
      Namespace: 'AWS/SQS',
      Period: 300,
      Statistic: 'Maximum',
      Threshold: 1,
      TreatMissingData: 'notBreaching',
    });

    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      AlarmDescription: `Alarm that monitors ${name} Errors and performs deployment rollback on release`,
      AlarmName: `${name}-${stackEnv}-Error`,
      Dimensions: [
        {
          Name: 'FunctionName',
        },
        {
          Name: 'Resource',
          Value: {
            'Fn::Join': [
              '',
              [
                {
                  Ref: Match.anyValue(),
                },
                ':stackEnv',
              ],
            ],
          },
        },
      ],
      MetricName: 'Errors',
      Namespace: 'AWS/Lambda',
      Period: 300,
      Statistic: 'Sum',
      Threshold: 1,
      TreatMissingData: 'notBreaching',
    });

    template.hasResourceProperties('AWS::CodeDeploy::Application', {
      ComputePlatform: 'Lambda',
    });

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'codedeploy.us-east-1.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSCodeDeployRoleForLambdaLimited',
            ],
          ],
        },
      ],
    });

    template.hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      ServiceRoleArn: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      AlarmConfiguration: {
        Alarms: [
          {
            Name: {
              Ref: Match.anyValue(),
            },
          },
        ],
        Enabled: true,
      },
      AutoRollbackConfiguration: {
        Enabled: true,
        Events: ['DEPLOYMENT_FAILURE', 'DEPLOYMENT_STOP_ON_ALARM'],
      },
      DeploymentConfigName: 'CodeDeployDefault.LambdaAllAtOnce',
      DeploymentGroupName: `${name}-Deployment-Group-${stackEnv}`,
      DeploymentStyle: {
        DeploymentOption: 'WITH_TRAFFIC_CONTROL',
        DeploymentType: 'BLUE_GREEN',
      },
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Type: 'String',
      Value: {
        Ref: Match.anyValue(),
      },
      Description: projectName,
      Name: `${paramName}${stackEnv.toLowerCase()}`,
      Tier: 'Standard',
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Type: 'String',
      Value: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      Description: 'projectName',
      Name: `${paramNameRole}${stackEnv.toLowerCase()}`,
      Tier: 'Standard',
    });
  });

  it('default with vpc, provisioning, layers', () => {
    const managedPolicy = 'managedPolicy';
    const layerArn = 'layerArn';
    const paramNameVpcName = 'paramNameVpcName';
    const paramNameVpcId = 'paramNameVpcId';
    const paramVpcSGName = 'paramVpcSGName';
    const paramExtraAction = 'paramExtraAction';

    //given
    const stack = new LambdaUtilStack(app, 'LambdaUtilStack', {
      env: {
        account: '1234567890123',
        region: 'us-east-1',
      },
      lambda: {
        ...lambdaConfig,
        deploymentConfig: LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
        isInVpc: true,
        isProvisioned: true,
        managedPolicies: [managedPolicy],
        paramVpcSGName,
        memorySize: 128,
        handler: 'test.handler',
        timeout: Duration.seconds(1).toSeconds(),
        runtime: Runtime.NODEJS_12_X,
        environmentGeneration: () => ({ TEST: '123' }),
        extraActions: ({ scope }) =>
          SSMUtil.createSSMParameter({
            scope,
            projectName,
            stackEnv,
            paramName: paramExtraAction,
            value: 'TEST',
          }),
        layers: [
          { arn: layerArn },
          { artifactPath, compatibleVersions: [Runtime.NODEJS_14_X] },
          { paramName },
        ],
        vpcConfig: { paramNameVpcName, paramNameVpcId },
        provisioningConfig: {
          minCapacity: 3,
          maxCapacity: 5,
          utilizationTarget: 0.3,
        },
      },
      projectName,
      stackEnv,
    });

    //when
    const template = Template.fromStack(stack);

    //then
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      Description: `${projectName}-API API Lambda Role`,
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/AWSXrayWriteOnlyAccess',
            ],
          ],
        },
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              `:iam::aws:policy/${managedPolicy}`,
            ],
          ],
        },
      ],
      RoleName: `${name}-Role-${stackEnv}`,
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'sqs:SendMessage',
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [Match.anyValue(), 'Arn'],
            },
          },
          {
            Action: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });

    template.hasResourceProperties('AWS::Lambda::LayerVersion', {
      Description: `${name} Layer lambda.zip`,
      LayerName: `${name}-lambda`,
    });

    template.hasResourceProperties('AWS::SQS::Queue', {
      KmsMasterKeyId: 'alias/aws/sqs',
      QueueName: `${name}-DLQ-stackEnv`,
    });

    template.hasResourceProperties('AWS::Lambda::Function', {
      Role: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      DeadLetterConfig: {
        TargetArn: {
          'Fn::GetAtt': [Match.anyValue(), 'Arn'],
        },
      },
      Description: `Lambda containing ${name} API functionality`,
      Environment: {
        Variables: {
          CLOUD_DEPLOYED: 'true',
          ENV: stackEnv,
          PROJECT_NAME: projectName,
          REGION: 'us-east-1',
          TEST: '123',
        },
      },
      FunctionName: `${name}-${stackEnv}`,
      Handler: 'test.handler',
      MemorySize: 128,
      Runtime: 'nodejs12.x',
      Timeout: 1,
      TracingConfig: {
        Mode: 'Active',
      },
      Layers: [layerArn, Match.anyValue(), Match.anyValue()],
    });

    template.hasResource('AWS::Lambda::Version', 1);

    template.hasResourceProperties('AWS::Lambda::EventInvokeConfig', {
      Qualifier: {
        'Fn::GetAtt': [Match.anyValue(), 'Version'],
      },
      MaximumRetryAttempts: 1,
    });

    template.hasResourceProperties('AWS::Logs::LogGroup', {
      LogGroupName: `/aws/lambda/${name}-${stackEnv}`,
      RetentionInDays: 30,
    });

    template.hasResourceProperties('AWS::Lambda::Alias', {
      FunctionVersion: {
        'Fn::GetAtt': [Match.anyValue(), 'Version'],
      },
      Name: stackEnv,
    });

    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      AlarmDescription: `Alarm that monitors ${name} DLQ Depth`,
      AlarmName: `${name}-${stackEnv}-DLQ`,
      Dimensions: [
        {
          Name: 'QueueName',
          Value: {
            'Fn::GetAtt': [Match.anyValue(), 'QueueName'],
          },
        },
      ],
      MetricName: 'ApproximateNumberOfMessagesVisible',
      Namespace: 'AWS/SQS',
      Period: 300,
      Statistic: 'Maximum',
      Threshold: 1,
      TreatMissingData: 'notBreaching',
    });

    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      ComparisonOperator: 'GreaterThanOrEqualToThreshold',
      EvaluationPeriods: 1,
      AlarmDescription: `Alarm that monitors ${name} Errors and performs deployment rollback on release`,
      AlarmName: `${name}-${stackEnv}-Error`,
      Dimensions: [
        {
          Name: 'FunctionName',
        },
        {
          Name: 'Resource',
          Value: {
            'Fn::Join': [
              '',
              [
                {
                  Ref: Match.anyValue(),
                },
                ':stackEnv',
              ],
            ],
          },
        },
      ],
      MetricName: 'Errors',
      Namespace: 'AWS/Lambda',
      Period: 300,
      Statistic: 'Sum',
      Threshold: 1,
      TreatMissingData: 'notBreaching',
    });

    template.hasResourceProperties('AWS::CodeDeploy::Application', {
      ComputePlatform: 'Lambda',
    });

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'codedeploy.us-east-1.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSCodeDeployRoleForLambdaLimited',
            ],
          ],
        },
      ],
    });

    template.hasResourceProperties('AWS::CodeDeploy::DeploymentGroup', {
      ServiceRoleArn: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      AlarmConfiguration: {
        Alarms: [
          {
            Name: {
              Ref: Match.anyValue(),
            },
          },
        ],
        Enabled: true,
      },
      AutoRollbackConfiguration: {
        Enabled: true,
        Events: ['DEPLOYMENT_FAILURE', 'DEPLOYMENT_STOP_ON_ALARM'],
      },
      DeploymentConfigName: 'CodeDeployDefault.LambdaCanary10Percent5Minutes',
      DeploymentGroupName: `${name}-Deployment-Group-${stackEnv}`,
      DeploymentStyle: {
        DeploymentOption: 'WITH_TRAFFIC_CONTROL',
        DeploymentType: 'BLUE_GREEN',
      },
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Type: 'String',
      Value: {
        Ref: Match.anyValue(),
      },
      Description: projectName,
      Name: `${paramName}${stackEnv.toLowerCase()}`,
      Tier: 'Standard',
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Type: 'String',
      Value: {
        'Fn::GetAtt': [Match.anyValue(), 'Arn'],
      },
      Description: 'projectName',
      Name: `${paramNameRole}${stackEnv.toLowerCase()}`,
      Tier: 'Standard',
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Type: 'String',
      Value: {
        'Fn::GetAtt': [Match.anyValue(), 'GroupId'],
      },
      Description: 'projectName',
      Name: `/${projectName.toLowerCase()}/paramVpcSGName${stackEnv.toLowerCase()}`,
      Tier: 'Standard',
    });

    template.hasResourceProperties('AWS::SSM::Parameter', {
      Type: 'String',
      Value: 'TEST',
      Description: 'projectName',
      Name: `/${projectName.toLowerCase()}/paramExtraAction${stackEnv.toLowerCase()}`,
      Tier: 'Standard',
    });

    template.hasResourceProperties(
      'AWS::ApplicationAutoScaling::ScalableTarget',
      {
        MaxCapacity: 5,
        MinCapacity: 3,
        ResourceId: {
          'Fn::Join': [
            '',
            [
              'function:',
              {
                'Fn::Select': [
                  6,
                  {
                    'Fn::Split': [
                      ':',
                      {
                        Ref: Match.anyValue(),
                      },
                    ],
                  },
                ],
              },
              `:${stackEnv}`,
            ],
          ],
        },
        RoleARN: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::1234567890123:role/aws-service-role/lambda.application-autoscaling.amazonaws.com/AWSServiceRoleForApplicationAutoScaling_LambdaConcurrency',
            ],
          ],
        },
        ScalableDimension: 'lambda:function:ProvisionedConcurrency',
        ServiceNamespace: 'lambda',
      }
    );

    template.hasResourceProperties(
      'AWS::ApplicationAutoScaling::ScalingPolicy',
      {
        PolicyType: 'TargetTrackingScaling',
        ScalingTargetId: {
          Ref: Match.anyValue(),
        },
        TargetTrackingScalingPolicyConfiguration: {
          PredefinedMetricSpecification: {
            PredefinedMetricType: 'LambdaProvisionedConcurrencyUtilization',
          },
          TargetValue: 0.3,
        },
      }
    );
  });
});
