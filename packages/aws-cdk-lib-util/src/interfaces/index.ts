import { StackProps } from 'aws-cdk-lib';

export type IBaseStackProps = StackProps & {
  readonly projectName: string;
  readonly stackEnv: string;
};
