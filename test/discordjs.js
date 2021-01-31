'use strict';

const discord = require('discord.js');
const client = new discord.Client();

const discordAntiAbus = require('../src');
const AntiAbus = discordAntiAbus.client(discordAntiAbus.discordjs);

const antiabus = new AntiAbus(client, {
    // messageHandler: function (message, callback) {}, // Message handler code
    antispam: true, // enable antispam
    // antispam: {
    //    triggerAntiSpam: function (id, parsing) {}, // step 1 (main function)
    //    mounted: function (id, parsing, tas) {}, // step 2 (function after main function)
    // },
    blockCallback: false, // enable message callback
    antispamInterval: 1e4, // antispam interval (ms)
    antispamCount: 2, // message count
    antispamResetCount: false, // reset count after send message
    enableDM: true, // enable anti-abus in DM
    // enableDM: {
    //  antispam: true,  
    // },
    onMessage: function(message, abus) { // Custom message in message handler
        if (abus.antispam) {
            const timeout = (this.options.antispamInterval - (Date.now() - abus.antispam.lastTimestamp)) / 1000;
            message.channel.send(`[ANTISPAM] ${message.author.toString()} You must wait ${timeout} seconde(s). [${abus.antispam.count} messages]`);
            message.delete();
            return null;
        };
        message.customMessage = true;

        return message;
    },
    exceptionMembers: [ // Ignore members
        //'363603951163015168',// Ignore this user
        ['499932143611412493', { // Custom features
            antispam: false,
        }]
    ],
    exceptionGuilds: [ // ignore guilds
        //'612430086624247828', // Ignore this guild
        ['612430086624247828', { // Custom features
            antispam: false,
        }],
    ],
    exceptionChannels: [ // ignore channels
        //'792853159781203968', // Ignore this channel
        ['794646978968944680', { // Custom features
            antispam: false,
        }],
    ],
});

client.on('ready', () => {
    console.log('Bot ready !');
});

client.on('message', (...args) => antiabus.messageHandler(...args, (message, exept) => {
    if (exept) {
        console.warn('%s abus detected !', Object.values(exept).filter((v) => v).length);
    };

    if (!message) return;

    console.log('Custom message ? %s', message.customMessage); // return true

    if (message.content == 'Hello') message.channel.send('World !');
}));

client.login(
    require('./config').token,
);