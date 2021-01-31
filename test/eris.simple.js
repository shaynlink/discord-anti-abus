'use strict';

const Eris = require('eris');
const discordAntiAbus = require('../src');
const AntiAbus = discordAntiAbus.client(discordAntiAbus.eris);
const bot = new Eris(
    require('./config').token,
);

const antiabus = new AntiAbus(bot, {
    antispam: true,
});

bot.on('ready', () => {
    console.log('Bot ready !');
});

bot.on('messageCreate', (...args) => antiabus.messageHandler(...args, (message, exept) => {
    if (exept) {
        console.warn('%s abus detected !', Object.values(exept).filter((v) => v).length);
        if (abus.antispam) {
            const timeout = (this.options.antispamInterval - (Date.now() - abus.antispam.lastTimestamp)) / 1000;
            bot.createMessage(message.channel.id, `[ANTISPAM] <@${message.author.id}> You must wait ${timeout} seconde(s). [${abus.antispam.count} messages]`);
            message.delete();
        };
    };

    if (!message) return;

    if (message.content == 'Hello') bot.createMessage(message.channel.id, 'World !');
}));

bot.connect();