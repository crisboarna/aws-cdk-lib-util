import { CDKStringUtil } from '../../src';

describe('CDKStringUtil', () => {
  it('capitalizez string', () => {
    const input = 'inputstring';
    const expectedOutput = 'Inputstring';

    expect(CDKStringUtil.capitalizeInputString(input)).toEqual(expectedOutput);
  });
});
