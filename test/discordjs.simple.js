'use strict';

const discord = require('discord.js');
const client = new discord.Client();

const discordAntiAbus = require('../src');
const AntiAbus = discordAntiAbus.client();

const antiabus = new AntiAbus(client, {
    antispam: true,
});

client.on('ready', () => {
    console.log('Bot ready !');
});

client.on('message', (...args) => antiabus.messageHandler(...args, (message, exept) => {
    if (exept) {
        console.warn('%s abus detected !', Object.values(exept).filter((v) => v).length);
        if (exept.antispam) {
            const timeout = (antiabus.options.antispamInterval - (Date.now() - exept.antispam.lastTimestamp)) / 1000;
            message.channel.send(`[ANTISPAM] ${message.author.toString()} You must wait ${timeout} seconde(s). [${exept.antispam.count} messages]`);
            message.delete();
        };
    };

    if (!message) return;

    if (message.content == 'Hello') message.channel.send('World !');
}));

client.login(
    require('./config').token,
);