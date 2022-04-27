import { App, Stack } from 'aws-cdk-lib';
import { SSMUtil } from '../../src';
import { Template } from 'aws-cdk-lib/assertions';
import { ParameterTier } from 'aws-cdk-lib/aws-ssm';

describe('SSMUtil', () => {
  // given
  let app;
  const projectName = 'projectName';
  const stackEnv = 'stackEnv';
  const paramNameProjectSame = 'lambda/api/arn/';
  const paramNameProjectX = '/projectx/lambda/api/arn/';
  const uniqueKey = 'uniquekey';

  beforeEach(() => (app = new App()));

  describe('createSSMParameter', () => {
    const paramValue = 'parameterValue';

    it('creates same project param', () => {
      //given
      const stack = new Stack(app, 'SSMUtil');

      //when
      SSMUtil.createSSMParameter({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectSame,
        value: paramValue,
        tier: ParameterTier.ADVANCED,
      });
      const template = Template.fromStack(stack);

      //then
      template.hasResourceProperties('AWS::SSM::Parameter', {
        Type: 'String',
        Value: paramValue,
        Description: projectName,
        Name: `/${projectName.toLowerCase()}/${paramNameProjectSame}${stackEnv.toLowerCase()}`,
        Tier: 'Advanced',
      });
    });

    it('creates other project param', () => {
      //given
      const stack = new Stack(app, 'SSMUtil2');

      //when
      SSMUtil.createSSMParameter({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectX,
        value: paramValue,
      });
      const template = Template.fromStack(stack);

      //then
      template.hasResourceProperties('AWS::SSM::Parameter', {
        Type: 'String',
        Value: paramValue,
        Description: projectName,
        Name: `${paramNameProjectX}${stackEnv.toLowerCase()}`,
        Tier: 'Standard',
      });
    });

    it('creates other project param with unique key', () => {
      //given
      const stack = new Stack(app, 'SSMUtil2');

      //when
      SSMUtil.createSSMParameter({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectX,
        value: paramValue,
        uniqueKey,
      });
      const template = Template.fromStack(stack);

      //then
      template.hasResourceProperties('AWS::SSM::Parameter', {
        Type: 'String',
        Value: paramValue,
        Description: projectName,
        Name: `${paramNameProjectX}${stackEnv.toLowerCase()}`,
        Tier: 'Standard',
      });
    });
  });

  describe('createSSMParameterList', () => {
    const paramValue = ['parameterValue'];

    it('creates same project param', () => {
      //given
      const stack = new Stack(app, 'SSMUtil');

      //when
      SSMUtil.createSSMParameterList({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectSame,
        value: paramValue,
        tier: ParameterTier.ADVANCED,
      });
      const template = Template.fromStack(stack);

      //then
      template.hasResourceProperties('AWS::SSM::Parameter', {
        Type: 'StringList',
        Value: paramValue[0],
        Description: projectName,
        Name: `/${projectName.toLowerCase()}/${paramNameProjectSame}${stackEnv.toLowerCase()}`,
        Tier: 'Advanced',
      });
    });

    it('creates other project param', () => {
      //given
      const stack = new Stack(app, 'SSMUtil2');

      //when
      SSMUtil.createSSMParameterList({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectX,
        value: paramValue,
      });
      const template = Template.fromStack(stack);

      //then
      template.hasResourceProperties('AWS::SSM::Parameter', {
        Type: 'StringList',
        Value: paramValue[0],
        Description: projectName,
        Name: `${paramNameProjectX}${stackEnv.toLowerCase()}`,
        Tier: 'Standard',
      });
    });
  });

  describe('getSSMParameter', () => {
    it('creates same project param', () => {
      //given
      const stack = new Stack(app, 'SSMUtil');

      //when
      SSMUtil.getSSMParameter({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectSame,
      });
      const template = Template.fromStack(stack);

      //then
      template.findParameters('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${projectName}/lambda/api/arn/${stackEnv.toLowerCase()}`,
      });
    });

    it('creates other project param', () => {
      //given
      const stack = new Stack(app, 'SSMUtil2');

      //when
      SSMUtil.getSSMParameter({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectX,
        extract: false,
      });
      const template = Template.fromStack(stack);

      //then
      template.findParameters('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${paramNameProjectX}${stackEnv.toLowerCase()}`,
      });
    });

    it('creates other project param and extracts', () => {
      //given
      const stack = new Stack(app, 'SSMUtil2');

      //when
      SSMUtil.getSSMParameter({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectX,
      });
      const template = Template.fromStack(stack);

      //then
      template.findParameters('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${paramNameProjectX}${stackEnv.toLowerCase()}`,
      });
    });

    it('creates other project param and extracts', () => {
      //given
      const stack = new Stack(app, 'SSMUtil2');

      //when
      SSMUtil.getSSMParameter({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectX,
        extract: true,
      });
      const template = Template.fromStack(stack);

      //then
      template.findParameters('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${paramNameProjectX}${stackEnv.toLowerCase()}`,
      });
    });
  });

  describe('getSSMParameterList', () => {
    it('creates same project param', () => {
      //given
      const stack = new Stack(app, 'SSMUtil');

      //when
      SSMUtil.getSSMParameterList({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectSame,
      });
      const template = Template.fromStack(stack);

      //then
      template.findParameters('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${projectName}/lambda/api/arn/${stackEnv.toLowerCase()}`,
      });
    });

    it('creates other project param', () => {
      //given
      const stack = new Stack(app, 'SSMUtil2');

      //when
      SSMUtil.getSSMParameterList({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectX,
        extract: false,
      });
      const template = Template.fromStack(stack);

      //then
      template.findParameters('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${paramNameProjectX}${stackEnv.toLowerCase()}`,
      });
    });

    it('creates other project param and extracts', () => {
      //given
      const stack = new Stack(app, 'SSMUtil2');

      //when
      SSMUtil.getSSMParameterList({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectX,
        extract: true,
      });
      const template = Template.fromStack(stack);

      //then
      template.findParameters('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${paramNameProjectX}${stackEnv.toLowerCase()}`,
      });
    });
  });

  describe('getSSMSecureParameter', () => {
    it('creates same project param', () => {
      //given
      const stack = new Stack(app, 'SSMUtil');

      //when
      SSMUtil.getSSMSecureParameter({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectSame,
      });
      const template = Template.fromStack(stack);

      //then
      template.findParameters('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${projectName}/lambda/api/arn/${stackEnv.toLowerCase()}`,
      });
    });

    it('creates other project param', () => {
      //given
      const stack = new Stack(app, 'SSMUtil2');

      //when
      SSMUtil.getSSMSecureParameter({
        scope: stack,
        projectName,
        stackEnv,
        paramName: paramNameProjectX,
      });
      const template = Template.fromStack(stack);

      //then
      template.findParameters('*', {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: `/${paramNameProjectX}${stackEnv.toLowerCase()}`,
      });
    });
  });
});
