import { connectionDb } from '@infrastructure/repository';
import { WSClient } from '@infrastructure/websocket';

import { makeJoinQuizCommand } from './join-quiz';
import { makeLeaveQuizCommand } from './leave-quiz';
import { makeNotifyPlayers } from './notify-players';

const notifyPlayers = makeNotifyPlayers({ connectionDb, WSClient });
const JoinQuizCommand = makeJoinQuizCommand({ connectionDb, notifyPlayers });
const LeaveQuizCommand = makeLeaveQuizCommand({ connectionDb, notifyPlayers });

export { JoinQuizCommand, LeaveQuizCommand, notifyPlayers };
