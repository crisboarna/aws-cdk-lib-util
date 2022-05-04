import { CDKContextUtil } from '../../src';
import { App } from 'aws-cdk-lib';

describe('CDKContextUtil', () => {
  // given
  let app;
  const TEST_KEY = 'TEST_KEY_VALUE';

  describe('hasContext', () => {
    it('context empty', () => {
      app = new App();
      expect(CDKContextUtil.hasContextKey(app, 'TEST_KEY')).toEqual(false);
    });

    it('context has number', () => {
      app = new App({ context: { TEST_KEY: 123 } });
      expect(CDKContextUtil.hasContextKey(app, 'TEST_KEY')).toEqual(true);
    });

    it('context has string empty', () => {
      app = new App({ context: { TEST_KEY: '' } });
      expect(CDKContextUtil.hasContextKey(app, 'TEST_KEY')).toEqual(false);
    });

    it('context has string', () => {
      app = new App({ context: { TEST_KEY } });
      expect(CDKContextUtil.hasContextKey(app, 'TEST_KEY')).toEqual(true);
    });
  });
});
