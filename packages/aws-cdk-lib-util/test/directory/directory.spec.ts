import { CDKDirectoryUtil } from '../../src';
import { existsSync, rmSync } from 'fs';

describe('CDKDirectoryUtil', () => {
  it('checkArtifactDirectoryExists', () => {
    //given
    const path = `/tmp/random-checkArtifactDirectoryExists-${new Date().valueOf()}`;
    if (existsSync(path)) {
      rmSync(path);
    }

    //when
    CDKDirectoryUtil.checkArtifactDirectoryExists(path);

    //then
    expect(existsSync(path)).toEqual(true);
  });

  it('checkArtifactFileExists', () => {
    //given
    const path = `/tmp/random-checkArtifactDirectoryExists-${new Date().valueOf()}`;
    const fileName = 'directory.test.zip';
    const filePath = `${path}/${fileName}`;

    if (existsSync(path)) {
      rmSync(path);
    }

    //when
    CDKDirectoryUtil.checkArtifactFileExists(filePath);

    //then
    expect(existsSync(filePath)).toEqual(true);
  });
});
