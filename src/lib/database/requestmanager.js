//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// WORK IN PROGRESS MODULE, NOT FUNCTIONAL

/* Recieves commands from website's database to take action on discord, most often this will be
to update member roles or promote upcomming events or some such */

const logger = require('../logger.js');
const messageChannelRequests = require('./messagechannelrequests.js');
const messageUserRequests = require('./messageuserrequests.js');
const roleRequests = require('./rolerequests.js');
const TAG = ('Request Manager');

// Command handler
let action = {
    messageChannel: function(received) {
        messageChannelRequests.execute(received);
    },

    messageUser: function(received) {
        messageUserRequests.execute(received);
    },

    roles: function(received) {
        roleRequests.execute(received);
    }
};

module.exports = {
    execute: function() {
        run();
    }
};

// Recieve some command (fake while under construction)

/* Roles command
let test = {
    command: 'roles',
    add: 'PS2',
    remove: 'Overwatch',
    user: '90161375896178688'
};
*/

/* Message users
let test = {
    command: 'messageUser',
    user: '90161375896178688',
    content: 'Dear Sir/Maddamn, I am writing to you today to inform you of our 2 for 1 offer on salt ' +
        'here at DIG we\'ve been manufacturing salt and refining our distribution network on Miller ' +
        'for years. If you would like to purchase salt please contact Fluttyman on Miller VS. May the ' +
        'salt be with you.'
};
*/

// Message channels
let test = {
    command: 'messageChannel',
    channel: '227718729448816641',
    content: 'Dear Sir/Maddamn, I am writing to you today to inform you of our 2 for 1 offer on salt ' +
        'here at DIG we\'ve been manufacturing salt and refining our distribution network on Miller ' +
        'for years. If you would like to purchase salt please contact Fluttyman on Miller VS. May the ' +
        'salt be with you.'
};


let command = JSON.stringify(test);

// Sort command
let received = JSON.parse(command);
command = received.command;

function run() {
    action[received.command](received);
};