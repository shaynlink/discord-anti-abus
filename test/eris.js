'use strict';

const Eris = require('eris');
const bot = new Eris(
    require('./config').token,
);

const discordAntiAbus = require('../src');
const AntiAbus = discordAntiAbus.client(discordAntiAbus.eris);

const antiabus = new AntiAbus(bot, {
    // messageHandler: function (message, callback) {}, // Message handler code
    antispam: true, // enable antispam
    // antispam: {
    //    triggerAntiSpam: function (id, parsing) {}, // step 1 (main function)
    //    mounted: function (id, parsing, tas) {}, // step 2 (function after main function)
    // },
    blockCallback: false, // enable message callback
    antispamInterval: 1e4, // antispam interval (ms)
    antispamCount: 2, // message count
    enableDM: true, // enable anti-abus in DM
    // enableDM: {
    //  antispam: true,  
    // },
    onMessage: function(message, abus) { // Custom message in message handler
        if (abus.antispam) {
            const timeout = (this.options.antispamInterval - (Date.now() - abus.antispam.lastTimestamp)) / 1000;
            bot.createMessage(message.channel.id, `[ANTISPAM] <@${message.author.id}> You must wait ${timeout} seconde(s). [${abus.antispam.count} messages]`);
            message.delete();
            return null;
        };
        message.customMessage = true;

        return message;
    },
    exceptionMembers: [ // Ignore members
        '363603951163015168',// Ignore this user
        ['499932143611412493', { // Custom features
            antispam: false,
        }]
    ],
    exceptionGuilds: [ // ignore guilds
        '612430086624247828', // Ignore this guild
        ['612430086624247828', { // Custom features
            antispam: false,
        }],
    ],
    exceptionChannels: [ // ignore channels
        '792853159781203968', // Ignore this channel
        ['794646978968944680', { // Custom features
            antispam: false,
        }],
    ],
});

bot.on('ready', () => {
    console.log('Bot ready !');
});

bot.on('messageCreate', (...args) => antiabus.messageHandler(...args, (message, exept) => {
    if (exept) {
        console.warn('%s abus detected !', Object.values(exept).filter((v) => v).length);
    };

    if (!message) return;

    console.log('Custom message ? %s', message.customMessage); // return true

    if (message.content == 'Hello') bot.createMessage(message.channel.id, 'World !');
}));

bot.connect();