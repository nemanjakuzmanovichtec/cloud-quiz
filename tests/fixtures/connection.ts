import { ConnectionEntity } from '@domain/entities/connection';

export const makeFakeConnection = (
  overrides?: Partial<ConnectionEntity>
): ConnectionEntity => {
  const connection = { connectionId: '1234', roomId: 'test-room' };

  return { ...connection, ...overrides };
};
