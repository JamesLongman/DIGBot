//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

/* This module handles the creation of temp channels for events, for now this is hardcoded but will
eventually be controlled by the website somehow */

const config = require('../../../config/config.js');
const logger = require('../logger.js');
const hardcode = require('./channels/hardcodeevents.js');
const server = require('../server/server.js');
const TAG = 'events';

module.exports = {
    // Called every 5 mins by admin.js, checks for events starting and ending
    check: function() {
        let events = hardcode.pass();
        let time = new Date();
        for (let i = 0; i < events.length; i++) {
            if (events[i].days.indexOf(time.getDay()) !== -1) {
                if (events[i].starthour == time.getHours()) {
                    hourCheck(time, events[i]);
                }
                if (events[i].starthour == time.getHours() + 1) {
                    preHourCheck(time, events[i]);
                }
            }
        }
        return true;
    },

    ready: function() {
        hardcode.ready();
    },
};

// Alerts relevent roles when an event is about to start
function alert(eventObj) {
    let serverObj = server.getGuild(config.getConfig().general.server);
    let mentions = '';

    for (let i = 0; i < eventObj.roles.length; i++) {
        let role = serverObj.roles.get(eventObj.roles[i]);

        if (!role) {
            logger.warning(TAG, `Was unable to get role ${eventObject.roles[i]} for event ${eventObj.name}`);
            return false;
        }
        mentions += serverObj.roles.get(eventObj.roles[i]) + ' ';
    }

    let message = 'The event **' + eventObj.name + '** is about to start!' +
        '\n' +
        '\nStarts: **' + eventObj.starthour + ':' + format(eventObj.startminute) + '** UTC' +
        '\nEnds: **' + eventObj.endhour + ':' + format(eventObj.endminute) + '** UTC' +
        '\n' +
        '\n' + description(eventObj.description);

    if (server.getChannel('events') !== null) {
        server.getChannel('events').sendMessage(message + '\n\n' + mentions)
            .then(() => {
                logger.info(TAG, 'Notified DIG Discord of event start');
            })
            .catch(err => {
                logger.warning(TAG, `Was unable to notify DIG Discord of an event - error: ${err}`);
            });
    }

    if (eventObj.millernotification === true) {
        if (server.getChannel('millerCommunityEvents') !== null) {
            server.getChannel('millerCommunityEvents').sendMessage(message)
                .then(() => {
                    logger.info(TAG, 'Notified Miller Community Discord of event start');
                })
                .catch(err => {
                    logger.warning(TAG, `Was unable to notify Miller Community Discord of an event - error: ${err}`);
                });
        } else {
            if (config.getConfig().environment !== 'production') {
                logger.info(TAG, 'Non live enviroment so will not attempt to notify Miller Discord');
            } else {
                logger.warning(TAG, 'Attempted to notify millerCommunityEvents channel but channel not set');
            }
        }
        if (server.getChannel('millerVSEvents') !== null) {
            server.getChannel('millerVSEvents').sendMessage(message)
                .then(() => {
                    logger.info(TAG, 'Notified Miller VS Discord of event start');
                })
                .catch(err => {
                    logger.warning(TAG, `Was unable to notify Miller VS Discord of an event - error: ${err}`);
                });
        } else {
            if (config.getConfig().environment !== 'production') {
                logger.info(TAG, 'Non live enviroment so will not attempt to notify Miller VS Discord');
            } else {
                logger.warning(TAG, 'Attempted to notify millerCommunityEvents channel but channel not set');
            }
        }
    }
}

// This function is called to create channels for events
function createChannels(eventObj) {
    for (let i = 0; i < eventObj.channels.length; i++) {
        if (eventObj.channels[i].type === 'text') {
            server.getGuild(config.getConfig().general.server)
                .defaultChannel.clone(eventObj.channels[i].name + '-e-')
                    .then(channel => {
                        channel.setTopic(eventObj.description);
                        logger.info(TAG, `Created new channel ` + channel.name);
                    })
                    .catch(err => {
                        logger.warning(TAG, `Failed to create channel, error: ${err}`);
                    });
        } else {
            server.getGuild(config.getConfig().general.server).createChannel(
                '⏰ ' + eventObj.channels[i].name + '-e-',
                eventObj.channels[i].type
            )
                .then(channel => {
                    channel.setTopic(eventObj.description);
                    logger.info(TAG, `Created new channel ` + channel.name);
                })
                .catch(err => {
                    logger.warning(TAG, `Failed to create channel, error: ${err}`);
                });
        }
    }
}

// Check if there is a description for the event, if so format and return for alert
function description(desc) {
    if (desc != undefined) {
        desc = '*' + desc + '*';
        return desc;
    }
    return '';
}

// Formats into clock format for single digit minutes, so 9 will return 09, Ex: 17:0 => 17:00
function format(num) {
    if (num < 10) {
        num = '0' + num.toString();
    }
    return num;
}

// Called whenever the check sees an event starts this day this hour
function hourCheck(time, eventObj) {
    let minutes = eventObj.startminute - time.getMinutes();
    if (minutes >= 15 && minutes < 20) {
        alert(eventObj);
    }
    if (minutes >= 30 && minutes < 35) {
        createChannels(eventObj);
    }
}

// Called whenever the check sees an event starts this day next hour
function preHourCheck(time, eventObj) {
    let minutes = eventObj.startminute + 60 - time.getMinutes();
    if (eventObj.startminute < 30) {
        if (minutes >= 30 && minutes < 35) {
            createChannels(eventObj);
        }
    }
    if (eventObj.startminute < 20) {
        if (minutes >= 15 && minutes < 20) {
            alert(eventObj);
        }
    }
}