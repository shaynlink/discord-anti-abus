'use strict';

const discordjs = Base => class extends Base {
    constructor(...args) {
        super(...args);
        try {
            const djs = require('discord.js');

            if (parseFloat(djs.version.split('.')[0]) < 12) {
                throw Error('You must have discord.js v12 or later');
            };
        } catch (error) {
            throw Error('You must install discord.js for use discordjs plugins');
        };

        this.clientUser = {};
    };

    parseClient(client) {
        client.once('ready', () => this.clientUser.id = client.user.id);
    };

    parseMessage(message) {
        return {
            content: message.content,
            author: {
                id: message.author.id,
            },
            channel: {
                id: message.channel.id,
            },
            guild: !!message.guild ? {
                id: message.guild.id,
            } : null,
            isGuild: !!message.guild,
        };
    };

    static get isBase() {
        return true;
    };
};

module.exports = discordjs;