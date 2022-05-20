export interface ConnectionEntity {
  roomId: string;
  connectionId: string;
}

type Dependencies = ConnectionEntity;

export const makeConnection = ({
  connectionId,
  roomId,
}: Dependencies): ConnectionEntity => {
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
