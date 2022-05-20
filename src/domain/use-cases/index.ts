import { connectionDb } from '@data-access';
import { WSClient } from '@infrastructure/websocket';

import { makeJoinQuiz } from './join-quiz';
import { makeLeaveQuiz } from './leave-quiz';
import { makeNotifyPlayer } from './notify-player';
import { makeNotifyPlayers } from './notify-players';

const notifyPlayers = makeNotifyPlayers({ connectionDb, WSClient });
const notifyPlayer = makeNotifyPlayer({ WSClient });
const joinQuiz = makeJoinQuiz({ connectionDb, notifyPlayers });
const leaveQuiz = makeLeaveQuiz({ connectionDb, notifyPlayers });

export { joinQuiz, leaveQuiz, notifyPlayers, notifyPlayer };
