'use strict';

const {
    mergeDefault
} = require('./../util/Util');

const {
    EventEmitter
} = require('events');

class BaseClient extends EventEmitter {
    constructor(client, options) {
        super();
        this.options = mergeDefault({
            messageHandler: null,
            antispam: false,
            blockCallback: false,
            antispamInterval: 20_000,
            antispamCount: 10,
            antispamResetCount: false,
            enableDM: true,
            onMessage: (message) => message,
            exceptionMembers: null,
            exceptionGuilds: null,
            exceptionChannels: null,
        }, options);
    };
};

module.exports = BaseClient;