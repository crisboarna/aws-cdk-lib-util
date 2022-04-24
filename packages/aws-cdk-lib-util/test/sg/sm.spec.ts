import { App, Stack } from 'aws-cdk-lib';
import { SecurityGroupUtil } from '../../src';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

describe('SecurityGroupUtil', () => {
  // given
  let app;
  const projectName = 'projectName';
  const projectNameX = 'projectNameX';
  const stackEnv = 'stackEnv';
  const paramName = `/${projectName}/vpc/sg/api/`;

  beforeEach(() => (app = new App()));

  describe('createSecurityGroup', () => {
    it('creates sg', () => {
      //given
      const stack = new Stack(app, 'SecurityGroupUtil');
      const vpc = new Vpc(stack, 'VPC', {
        enableDnsHostnames: false,
        enableDnsSupport: false,
        maxAzs: 1,
        natGateways: 0,
      });

      //when
      SecurityGroupUtil.createSecurityGroup({
        scope: stack,
        vpc,
        projectName,
        stackEnv,
        securityGroupName: paramName,
      });
      const template = Template.fromStack(stack);

      //then
      template.hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: `SG where ${paramName} is placed.`,
        GroupName: 'projectName-/PROJECTNAME/VPC/SG/API/-SG-stackEnv',
        SecurityGroupEgress: [
          {
            CidrIp: '0.0.0.0/0',
            Description: 'Allow all outbound traffic by default',
            IpProtocol: '-1',
          },
        ],
        VpcId: {
          Ref: Match.anyValue(),
        },
      });
    });
  });

  describe('getSecurityGroupFromId', () => {
    it('get sg', () => {
      const paramName = `vpc/sg/api/`;

      //given
      const stack = new Stack(app, 'SecurityGroupUtil');
      //when
      SecurityGroupUtil.getSecurityGroupFromId({
        scope: stack,
        projectName,
        stackEnv,
        paramName,
      });

      const template = Template.fromStack(stack);

      //then
      template.hasParameter('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${projectName.toLowerCase()}/vpc/sg/api/${stackEnv.toLowerCase()}`,
      });
    });

    it('get sg from other project', () => {
      const paramName = `/${projectNameX.toLowerCase()}/vpc/sg/api/`;

      //given
      const stack = new Stack(app, 'SecurityGroupUtil');
      //when
      SecurityGroupUtil.getSecurityGroupFromId({
        scope: stack,
        projectName,
        stackEnv,
        paramName,
      });

      const template = Template.fromStack(stack);

      //then
      template.hasParameter('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${projectNameX.toLowerCase()}/vpc/sg/api/${stackEnv.toLowerCase()}`,
      });
    });
  });
});
