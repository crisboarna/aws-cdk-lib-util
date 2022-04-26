import { existsSync, mkdirSync } from 'fs';
import * as fs from 'fs';

/**
 * This provides directory utility functions
 */
export class CDKDirectoryUtil {
  /**
   * Simple file utility to be used when you want to ensure that a artifact path for a Lambda or a Lambda layer exists, even if you do not plan on deploying that specific stack.
   *
   * Useful when you have multiple stacks in same `CDK` app file but only intend to deploy one stack without building all dependencies.
   * ```typescript
   * import { App } from 'aws-cdk-lib';
   * import { CDKDirectoryUtil } from 'aws-cdk-lib-util';
   *
   * const artifactPath = './dist/apps/stack2';
   *
   * const app = new App();
   *
   * const stack1 = new YourStack1(app,'Stack1',{...});
   *
   * CDKDirectoryUtil.checkArtifactDirectoryExists(artifactPath);
   *
   * const stack2 = new YourStack1(app,'Stack2',{artifactPath,...});
   * ...
   * ```
   * @param artifactPath
   */
  public static checkArtifactDirectoryExists = (artifactPath: string) => {
    if (!existsSync(artifactPath)) {
      mkdirSync(artifactPath, { recursive: true });
    }
  };

  /**
   * Similar to `checkArtifactDirectoryExists`, useful when you have multiple stacks and only want to deploy one of them without building all stack dependencies.
   * Difference consists of this one also creating an empty file, which is useful for when you are passing a `zip` file directly as commonly done for `Lambda` `Layers`.
   * ```typescript
   * import { App } from 'aws-cdk-lib';
   * import { CDKDirectoryUtil } from 'aws-cdk-lib-util';
   *
   * const artifactPath = './dist/libs/layer1/layer.zip';
   *
   * const app = new App();
   *
   * const stack1 = new YourStack1(app,'Stack1',{...});
   *
   * CDKDirectoryUtil.checkArtifactFileExists(artifactPath);
   *
   * const stack2 = new YourStack1(app,'Stack2',{artifactPath,...});
   * ...
   * ```
   * @param artifactPath
   */
  public static checkArtifactFileExists = (artifactPath: string) => {
    const lastSlashIndex = artifactPath.lastIndexOf('/');
    const pathSegment = artifactPath.slice(0, lastSlashIndex);
    const fileName = artifactPath.slice(lastSlashIndex + 1);

    CDKDirectoryUtil.checkArtifactDirectoryExists(pathSegment);

    fs.closeSync(fs.openSync(`${pathSegment}/${fileName}`, 'a'));
  };

  /**
   * Facilitates the naming of the CDK stack based on the file containing the app.
   * ```typescript title="YourStack.ts"
   * import { App } from 'aws-cdk-lib';
   * import { CDKDirectoryUtil } from 'aws-cdk-lib-util';
   *
   * const app = new App();
   *
   * const stack1 = new YourStackImpl(app,CDKDirectoryUtil.getStackName(__dirname, __filename),{...});
   * ...
   * ```
   * Stack will be named YourStack.
   * @param directoryName
   * @param fileName
   */
  public static getStackName = (directoryName: string, fileName: string) =>
    fileName.slice(directoryName.length + 1, -3);
}
