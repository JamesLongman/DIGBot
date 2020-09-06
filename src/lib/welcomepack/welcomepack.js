//  Copyright © 2018 DIG Development team. All rights reserved.

// Module to control welcomepack sent to new users joining the server

const logger = require('../logger');

const TAG = 'welcomepack';

const recentJoiners = [];
const users = [];

module.exports = {
    // Checks if the user should recieve a welcome message, if so send one
    check(mem) {
        logger.event(TAG, 'check');
        if (users.indexOf(mem.user.id) !== -1) {
            logger.info(TAG, `User: ${mem.user.id} re-joined server but they are already logged as a member`);
            return false;
        }
        if (duplicationCheck(mem) === false) {
            logger.info(TAG, `${mem.displayName} joined the server, but a member by the same name `
                + 'has recently been welcomed');
            return false;
        }
        users.push(mem.user.id);
        logger.debug(TAG, `New user count: ${users.length}`);
//         mem.send({ files: [{ attachment: 'src/assets/pictures/welcome-banner.png' }] })
//             .then(() => {
//                 logger.debug(TAG, 'Message succesfully sent');
//                 sendLot(mem);
//             })
//             .catch((err) => {
//                 logger.warning(TAG, `File failed to send, error: ${err}`);
//             });
        return true;
    },

    message:
        'Hello! Welcome to the DIG server, I\'m your friendly neighbourhood bot. Let me give you a '
        + 'quick run-down on how things work around here.'
        + '\n'
        + '\n__**Quickstart Guide:**__'
        + '\n'
        + '\n - To keep our Discord clutter-free, a lot of channels are hidden. If you want to see a channel '
        + 'that you don\'t have access to simply assign yourself roles in the #role-assignment channel:'
        + '\n'
        + 'https://discordapp.com/channels/90078410642034688/707928568054939700/707930312360853675'
        + '\n'
        + '\n - For the best Discord experience, make sure you download the Desktop client: '
        + 'https://discordapp.com/api/download?platform=win (windows). We also recommend that you '
        + 'turn on the "Game Activity" option within the desktop version, which will grant you access '
        + 'to our game specific channels automatically. More info on this can be found here: '
        + 'https://support.discordapp.com/hc/en-us/articles/217960107-Games-Detection-101'
        + '\n'
        + '\n - We are a mature gaming community, however we ask that anything NSFW goes into the '
        + '#herebedragons channel. What you see there is not moderated and never will be. You have '
        + 'been warned. This channel is an opt-in channel. In order to gain access, type the '
        + 'command **!dragons** in the #digbot channel and you\'ll be granted access.'
        + '\n - DIG Website: http://www.dignityofwar.com'
        + '\n'
        + '\n__**Bot Guide:**__'
        + '\n'
        + '\n - The only command you\'ll have to remember is "**!help**", type that in any channel and '
        + 'I\'ll PM you with a handy list of available commands.',
};

/* Checks if a member by an identical name recently joined the server, if so don't welcome them
(probably the same person joining on browser/app with two accounts) */
function duplicationCheck(mem) {
    for (let i = 0; i < recentJoiners.length; i += 1) {
        if (recentJoiners[i] === mem.displayName) { return false; }
    }
    recentJoiners.push(mem.displayName);
    if (recentJoiners.length > 5) {
        recentJoiners.splice(0, 1);
    }
    return true;
}

function sendLot(mem) {
    logger.event(TAG, 'sendLot');
    mem.send(module.exports.message)
        .then(() => {
            logger.info(TAG, `Sent welcome message to: ${mem.displayName}, ID: ${mem.user.id}`);
        })
        .catch((err) => {
            logger.warning(TAG, `Message failed to send, error: ${err}`);
        });
}
