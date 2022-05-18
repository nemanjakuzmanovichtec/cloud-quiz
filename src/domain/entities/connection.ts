export interface ConnectionEntity {
  roomId: string;
  connectionId: string;
}

export const makeConnection = ({ connectionId, roomId }): ConnectionEntity => {
  console.log('makeConnection', { connectionId, roomId });

  if (!connectionId) {
    throw new Error('Connection must have a connectionId');
  }

  if (!roomId) {
    throw new Error('Connection must have a roomId');
  }

  return Object.freeze({
    roomId,
    connectionId,
  });
};
