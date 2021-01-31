'use strict';

if (parseFloat(process.version.split('.')[0]) < 12) {
    throw Error('You must be use nodejs v12 or later');
};

const client = require('./client/Client');

module.exports = module.exports.default = {
    // Client
    BaseClient: require('./client/BaseClient'),
    client,

    // Core
    core: require('./core/core'),

    // Plugins
    discordjs: require('./plugins/discordjs'),
    eris: require('./plugins/eris'),

    // version
    version: require('../package.json').version,

    // util
    Util: require('./util/Util'),
};