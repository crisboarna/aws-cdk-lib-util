import { App, Stack } from 'aws-cdk-lib';
import { CDKCustomResourceUtil } from '../../src';
import { Match, Template } from 'aws-cdk-lib/assertions';

describe('CDKCustomResourceUtil', () => {
  // given
  let app;
  const account = { account: '1234567891234', region: 'us-east-1' };
  const projectName = 'projectName';
  const projectNameX = 'ProjectX';
  const stackEnv = 'stackEnv';
  const functionName = 'Function-Name';
  beforeEach(() => (app = new App()));

  describe('getSSMParamViaCustomResource', () => {
    it('same project param', () => {
      //given
      const paramName = `/${projectName}/vpc/sg/api/`;
      const stack = new Stack(app, 'CDKCustomResourceUtil');

      //when
      CDKCustomResourceUtil.getSSMParamViaCustomResource({
        scope: stack,
        projectName,
        stackEnv,
        paramName,
        functionName,
        account,
      });

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
        ManagedPolicyArns: [
          {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              ],
            ],
          },
        ],
      });

      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'ssm:GetParameter',
              Effect: 'Allow',
              Resource: `arn:aws:ssm:${account.region}:${
                account.account
              }:parameter${paramName}${stackEnv.toLowerCase()}`,
            },
          ],
          Version: '2012-10-17',
        },
      });

      template.hasResourceProperties('Custom::AWS', {
        ServiceToken: {
          'Fn::GetAtt': [Match.anyValue(), 'Arn'],
        },
        Create: Match.stringLikeRegexp(
          `{"service":"SSM","action":"getParameter","region":"${
            account.region
          }","parameters":{"Name":"${paramName}${stackEnv.toLowerCase()}"},"physicalResourceId":{"id":`
        ),
        Update: Match.stringLikeRegexp(
          `{"service":"SSM","action":"getParameter","region":"${
            account.region
          }","parameters":{"Name":"${paramName}${stackEnv.toLowerCase()}"},"physicalResourceId":{"id":`
        ),
        InstallLatestAwsSdk: true,
      });
    });

    it('different project param', () => {
      //given
      const paramName = `vpc/sg/api/`;
      const stack = new Stack(app, 'CDKCustomResourceUtil');

      //when
      CDKCustomResourceUtil.getSSMParamViaCustomResource({
        scope: stack,
        projectName: projectNameX,
        stackEnv,
        paramName,
        functionName,
        account,
      });

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
        ManagedPolicyArns: [
          {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              ],
            ],
          },
        ],
      });

      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'ssm:GetParameter',
              Effect: 'Allow',
              Resource: `arn:aws:ssm:${account.region}:${
                account.account
              }:parameter/${projectNameX.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}`,
            },
          ],
          Version: '2012-10-17',
        },
      });

      template.hasResourceProperties('Custom::AWS', {
        ServiceToken: {
          'Fn::GetAtt': [Match.anyValue(), 'Arn'],
        },
        Create: Match.stringLikeRegexp(
          `{"service":"SSM","action":"getParameter","region":"${
            account.region
          }","parameters":{"Name":"/${projectNameX.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}"},"physicalResourceId":{"id":`
        ),
        Update: Match.stringLikeRegexp(
          `{"service":"SSM","action":"getParameter","region":"${
            account.region
          }","parameters":{"Name":"/${projectNameX.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}"},"physicalResourceId":{"id":`
        ),
        InstallLatestAwsSdk: true,
      });
    });

    it('different project param with assumeRoleArn', () => {
      //given
      const paramName = `vpc/sg/api/`;
      const stack = new Stack(app, 'CDKCustomResourceUtil');
      const assumeRoleName = 'assumeRoleName';

      //when
      CDKCustomResourceUtil.getSSMParamViaCustomResource({
        scope: stack,
        projectName: projectNameX,
        stackEnv,
        paramName,
        functionName,
        account,
        assumeRoleName,
      });

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
        ManagedPolicyArns: [
          {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              ],
            ],
          },
        ],
      });

      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Resource:
                'arn:aws:iam:us-east-1:1234567891234:role/assumeRoleName',
            },
          ],
          Version: '2012-10-17',
        },
      });

      template.hasResourceProperties('Custom::AWS', {
        ServiceToken: {
          'Fn::GetAtt': [Match.anyValue(), 'Arn'],
        },
        Create: Match.stringLikeRegexp(
          `{"assumedRoleArn":"arn:aws:iam:us-east-1:1234567891234:role/assumeRoleName","service":"SSM","action":"getParameter","region":"${
            account.region
          }","parameters":{"Name":"/${projectNameX.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}"},"physicalResourceId":{"id":`
        ),
        Update: Match.stringLikeRegexp(
          `{"assumedRoleArn":"arn:aws:iam:us-east-1:1234567891234:role/assumeRoleName","service":"SSM","action":"getParameter","region":"${
            account.region
          }","parameters":{"Name":"/${projectNameX.toLowerCase()}/${paramName}${stackEnv.toLowerCase()}"},"physicalResourceId":{"id":`
        ),
        InstallLatestAwsSdk: true,
      });
    });
  });

  describe('actionViaCustomResource', () => {
    const functionArn =
      'arn:aws:lambda:us-east-1:1234567890123:function/FunctionName';

    it('same project param', () => {
      //given
      const stack = new Stack(app, 'CDKCustomResourceUtil');

      //when
      CDKCustomResourceUtil.actionViaCustomResource({
        scope: stack,
        projectName,
        stackEnv,
        functionArn,
      });

      const template = Template.fromStack(stack);

      //then
      template.hasResourceProperties('AWS::Lambda::Permission', {
        Action: 'lambda:InvokeFunction',
        FunctionName: functionArn,
        Principal: {
          'Fn::GetAtt': [Match.anyValue(), 'Arn'],
        },
      });

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
        ManagedPolicyArns: [
          {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              ],
            ],
          },
        ],
      });

      template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'lambda:InvokeFunction',
              Effect: 'Allow',
              Resource: [functionArn, `${functionArn}:*`],
            },
          ],
          Version: '2012-10-17',
        },
      });

      template.hasResourceProperties('AWS::CloudFormation::CustomResource', {
        ServiceToken: {
          'Fn::GetAtt': [Match.anyValue(), 'Arn'],
        },
      });
    });
  });
});
