'use strict';

const eris = Base => class extends Base {
    constructor(...args) {
        super(...args);
        try {
            const eris = require('eris');

            if (parseFloat(eris.VERSION.split('.')[1]) < 13) {
                throw Error('You must have eris v0.13 or later');
            };
        } catch (error) {
            throw Error('You must install eris for use eris plugins');  
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
            guild: !!message.guildID ? {
                id: message.guildID,
            } : null,
            isGuild: !!message.guildID,
        };
    };

    static get isBase() {
        return true;
    };
};

module.exports = eris;