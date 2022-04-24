import { App, Stack } from 'aws-cdk-lib';
import { SecretManagerUtil } from '../../src';
import { Template } from 'aws-cdk-lib/assertions';

describe('SecretManagerUtil', () => {
  // given
  let app;
  const projectName = 'projectName';
  const stackEnv = 'stackEnv';
  const paramName = `/${projectName}/lambda/api/oauth/`;
  const paramValue = { password: 'secret' };

  beforeEach(() => (app = new App()));

  describe('createSecretManagerSecret', () => {
    it('creates secret', () => {
      //given
      const stack = new Stack(app, 'SecretManagerUtil');

      //when
      SecretManagerUtil.createSecretManagerSecret({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramName,
        value: paramValue,
      });
      const template = Template.fromStack(stack);

      //then
      template.hasResourceProperties('AWS::SecretsManager::Secret', {
        Name: `${paramName}${stackEnv.toLowerCase()}`,
        Description: projectName,
        GenerateSecretString: {
          GenerateStringKey: '_ignore',
          SecretStringTemplate: JSON.stringify(paramValue),
        },
      });
    });
  });
});
