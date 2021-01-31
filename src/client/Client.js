'use strict';

const BaseClient = require('./BaseClient');
const core = require('./../core/core');
const discordjs = require('../plugins/discordjs');

function mixins (base) {
    if (!base || (base && !base(class Temp {}).isBase)) base = discordjs;

    class Client extends core(base(BaseClient)) {
        constructor(...args) {
            super(...args);
        };
    };

    return Client;
};

module.exports = mixins;