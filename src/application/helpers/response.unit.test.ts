import { OK } from './response';

describe('response', () => {
  it('called with no body', async () => {
    const result = OK();

    expect(result).toMatchObject({
      statusCode: 200,
      body: '{"status":"success","statusCode":200,"data":{}}',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      },
    });
  });
});
