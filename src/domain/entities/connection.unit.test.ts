import { makeFakeConnection } from '@tests/fixtures/connection';
import { makeConnection } from './connection';

describe('makeConnection', () => {
  it('should throw connectionId required error', () => {
    const fakeConn = makeFakeConnection({ connectionId: null });

    expect(() => makeConnection(fakeConn)).toThrow(
      'Connection must have a connectionId'
    );
  });

  it('should throw roomId required error', () => {
    const fakeConn = makeFakeConnection({ roomId: null });

    expect(() => makeConnection(fakeConn)).toThrow(
      'Connection must have a roomId'
    );
  });

  it('should return connection entity', () => {
    const fakeConn = makeFakeConnection();

    expect(makeConnection(fakeConn)).toMatchObject(fakeConn);
  });
});
