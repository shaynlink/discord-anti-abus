'use strict';

/**
 * options
 * 
 * antispam (enable / disable antispam)
 * blockCallback (enable / disable callback after antiabus triggered)
 * antispamInterval (time after reset msg count)
 * antispamCount (message count)
 * onMessage (emit onMessage if antiabus triggered)
 */

const core = Base => class extends Base {
    constructor(client, ...args) {
        super(client, ...args);

        this.spams = new Map();

        this.parseClient(client);
    };

    checkExec(parsing) {
        let exec = true;
        if (this.options.exceptionMembers) {
            let customException = this.options.exceptionMembers.find((em) => typeof em == 'object' && em[0] == parsing.author.id);
            if (customException && customException[1] && !customException[1].antispam) exec = false;
        };

        if (this.options.exceptionGuilds && parsing.isGuild) {
            let customException = this.options.exceptionGuilds.find((em) => typeof em == 'object' && em[0] == parsing.guild.id);
            if (customException && customException[1] && !customException[1].antispam) exec = false;
        };

        if (this.options.exceptionChannels && parsing.isGuild) {
            let customException = this.options.exceptionChannels.find((em) => typeof em == 'object' && em[0] == parsing.channel.id);
            if (customException && customException[1] && !customException[1].antispam) exec = false;
        };

        return exec;
    };

    async __messageHandle(message, callback) {
        const parsing = this.parseMessage(message);

        if (this.clientUser.id == parsing.author.id) return;

        if (!this.options.enableDM && !parsing.isGuild) return;
        
        const abus = {};

        if (!!this.options.exceptionMembers) {
            if (this.options.exceptionMembers.includes(parsing.author.id)) return callback(this.options.onMessage.call(this, message, abus));
        };

        if (!!this.options.exceptionGuilds && parsing.isGuild) {
            if (this.options.exceptionGuilds.includes(parsing.guild.id)) return callback(this.options.onMessage.call(this, message, abus));
        };

        if (!!this.options.exceptionChannels && parsing.isGuild) {
            if (this.options.exceptionChannels.includes(parsing.channel.id)) return callback(this.options.onMessage.call(this, message, abus));
        };

        if (!!this.options.antispam && (parsing.isGuild ? true : typeof this.enableDM == 'object' ? this.enableDM.antispam : true)) {
            let exec = this.checkExec(parsing);

            if (exec) {
                let tas, mounted = false;
                if (typeof this.options.antispam == 'object') {
                    if (typeof this.options.antispam.triggerAntiSpam == 'function') {
                        tas = this.options.antispam.triggerAntiSpam.call(this, parsing.author.id, parsing);
                    };

                    if (typeof this.options.antispam.mounted == 'function') {
                        mounted = true;
                    }
                };
                if (!tas) tas = this.triggerAntiSpam(parsing.author.id, parsing);

                if (mounted) await this.options.antispam.mounted.call(this, parsing.author.id, parsing, tas);
    
                if (tas) {
                    this.emit('spam', message);
                    abus.antispam = tas;
                } else abus.antispam = false;
            };
            
        };
        
        if (Object.keys(abus).length > 0) {
            this.emit('textAbus', message, abus);
            callback(this.options.blockCallback ? null : this.options.onMessage.call(this, message, abus), Object.keys(abus).length > 0 ? abus : null);
        } else {
            callback(this.options.onMessage.call(this, message, abus), Object.keys(abus).length > 0 ? abus : null);
        };

        return this;
    };

    messageHandler(...args) {
        if (!this.options.messageHandler) return this.__messageHandle(...args);
        else return this.options.messageHandler(...args);
    };

    triggerAntiSpam(id, parsing) {
        if (!this.spams.has(id)) this.spams.set(id, {
            lastTimestamp: Date.now(),
            count: 0,
            __delete: setInterval(() => this.spams.has(id) ? this.spams.get(id).__checkDelete() ? this.spams.get(id).__clear() : null : null, this.options.antispamInterval),
            __checkDelete: () => {
                return this.spams.has(id) ? Date.now() - this.spams.get(id).lastTimestamp >= this.options.antispamInterval : false
            },
            __clear: () => {
                clearInterval(this.spams.get(id).__delete);
                this.spams.delete(id);
            },
        });

        let spam = this.spams.get(id);

        if (this.options.antispamResetCount) spam.lastTimestamp = Date.now();
        spam.count++;

        if (spam.count > this.options.antispamCount) return Object.assign(spam, {message: parsing});
        else return null;
    };
};

module.exports = core;