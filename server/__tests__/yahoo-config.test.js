const ORIGINAL_ENV = { ...process.env };

const loadYahooModule = () => {
  let yahoo;
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    yahoo = require('../lib/yahoo');
  });
  return yahoo;
};

describe('Yahoo OAuth configuration', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('falls back to the Yahoo consumer key aliases when client variables are absent', () => {
    delete process.env.YAHOO_CLIENT_ID;
    delete process.env.YAHOO_CLIENT_SECRET;
    process.env.YAHOO_CONSUMER_KEY = 'alias-client-id';
    process.env.YAHOO_CONSUMER_SECRET = 'alias-client-secret';
    process.env.NODE_ENV = 'production';

    const { buildAuthUrl } = loadYahooModule();
    const fakeRequest = {
      protocol: 'http',
      get: () => 'localhost:5000',
    };

    const authUrl = buildAuthUrl(fakeRequest, 'state123');
    const params = new URL(authUrl).searchParams;

    expect(params.get('client_id')).toBe('alias-client-id');
  });

  it('throws a descriptive error when credentials are missing in production', () => {
    delete process.env.YAHOO_CLIENT_ID;
    delete process.env.YAHOO_CLIENT_SECRET;
    delete process.env.YAHOO_CONSUMER_KEY;
    delete process.env.YAHOO_CONSUMER_SECRET;
    process.env.NODE_ENV = 'production';

    expect(() => loadYahooModule()).toThrow(/Yahoo OAuth credentials missing/i);
  });
});
