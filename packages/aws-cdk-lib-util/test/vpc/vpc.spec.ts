import { App, Stack } from 'aws-cdk-lib';
import { VpcUtil } from '../../src';
import { Template } from 'aws-cdk-lib/assertions';

describe('VpcUtil', () => {
  // given
  let app;
  const projectName = 'projectName';
  const stackEnv = 'stackEnv';
  const paramNameVpcId = `vpc/api/id/`;
  const paramNameVpcName = `vpc/api/name`;
  const account = '1234567890123';
  const region = 'us-east-1';

  beforeEach(
    () =>
      (app = new App({
        context: {
          'ssm:account=1234567890123:parameterName=/projectname/vpc/api/id/stackenv:region=us-east-1':
            'vpcId',
          'ssm:account=1234567890123:parameterName=/projectname/vpc/api/namestackenv:region=us-east-1':
            'vpcName',
          'vpc-provider:account=1234567890123:filter.isDefault=false:filter.tag:Name=dummy-value-for-/projectname/vpc/api/namestackenv:filter.vpc-id=dummy-value-for-/projectname/vpc/api/id/stackenv:region=us-east-1:returnAsymmetricSubnets=true':
            'sg',
        },
      }))
  );

  describe('getVpc', () => {
    it('retrieves vpc', () => {
      //given
      const stack = new Stack(app, 'VpcUtil', { env: { account, region } });

      //when
      VpcUtil.getVpc({
        scope: stack,
        projectName,
        stackEnv,
        paramNameVpcId,
        paramNameVpcName,
      });
      const template = Template.fromStack(stack);

      //then
      template.resourceCountIs('*', 0);
    });
  });
});
