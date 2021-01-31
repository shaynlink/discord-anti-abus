# discord-anti-abus
Discord anti-abus it's a super customizable module for check abus like
- spam ✅
- avatar nsfw content ❌
- bad message content ❌
- IA bad message filter ❌
- nsfw / lolicon message image ❌

# Installation

```bash
# npm
npm i discord-anti-abus

# yarn
yarn add discord-anti-abus
```

# Documentation

## Anti-Abus Options
! **Snowflakes => Discord ID**
```js
{
    // Default [null]
    messageHandler: function(message, callback) {}, // Message handler code
    // Default [false]
    antispam: false,
    // antispam: {
    //     triggerAntiSpam: function (id, parsing) {}, // step 1 (main function)
    //     mounted: function (id, parsing, tas) {}, // step 2 (function after main function)
    // },
    // Default [false]
    blockCallback: false, // enable message callback
    // Default [20_000]
    antispamInterval: 20_000, // antispam interval (ms)
    // Default [10]
    antispamCount: 10, // message count
    // Default [false]
    antispamResetCount: false, // reset count after send message
    // Default [true]
    enableDM: true, // enable anti-abus in DM
    // Default [(message) => message]
    onMessage: function(message) => {
        message.custom = 'Hello world';
        return message;
    },
    // Default [null]
    exceptionMembers: [
        'user id', // Ignore this user
        ['user id', { // Custom features
            antispam: true,
        }],
    ],
    // Default [null]
    exceptionGuilds: [
        'guild id', // Ignore this guild
        ['guild id', { // Custom features
            antispam: true,
        }],
    ],
    // Default [null]
    exceptionChannels: [
        'channel id', // Ignore this channel
        ['channel id', { // Custom features
            antispam: true,
        }],
    ], 
}
```

## class BaseClient `Extends EventEmitter`
```js
new BaseClient(/* Discord Client */, /* Anti-Abus Options */);
```
#### - `BaseClient#options` -> `ClientOptions`
## function client `Extends Core<CorePlugin<BaseClient>>`
```js
const Client = client(/* CorePlugins */);
```
#### - `client` -> `Client`
## class Client
```js
const client = new Client(/* Discord Client */, /* Anti-Abus Options */);
```
## function core
```js
const Core = core(/* CorePlugin<BaseClient> */);
```
#### - `core` -> `Core`
## class Core `Extends CorePlugin<BaseClient>`
```js
const core = new Core(/* Discord CLient */, /* Anti-Abus Options */);
```
#### - `Core#spams` -> `Map<Snowflake, {lastTimestamp: number, count: number}>`
#### - `Core#checkExec(<Parsing>)` -> `boolean`
#### - `Core#__messageHandle(<Message>, <Callback>)` -> `Core`
#### - `Core#messageHandle(<...args>)` -> `Core | any`
#### - `Core#triggerAntiSpam(<Snowflake>, <Parsing>)` -> `{lastTimestamp: number, count: number, message: Parsing}`
## function plugin
```js
// discord.js
const Plugin = discordjs(/* BaseClient */); // Plugin
// Eris
const Plugin = eris(/* BaseClient */); // Plugin
```
#### - `plugin` -> `Plugin`
## class Plugin `Extends BaseClient`
```js
const plugin = new Plugin(/* Discord Client */, /* Anti-Abus Options */);
```
#### - `Plugin#clientUser` -> `{id: Snowflake}`
#### - `Plugin#parseClient<DiscordClient>` -> `void`
#### - `Plugin#parseMessage<DiscordMessage>` -> `{content: string, author: {id: Snowflake}, channel: {id: Snowflake}, guild: {id: snowflake} | null, isGuild: boolean}`
#### - `static Plugin#isBase` -> `true`

# Example
## With Discord.js
[see discord simple here](https://github.com/Shaynlink/discord-anti-abus/blob/master/test/discordjs.simple.js)
```js
const discord = require('discord.js');
const client = new discord.Client();

const discordAntiAbus = require('discord-anti-abus');
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

    console.log('Custom message ? %s', message.customMessage); // return true

    if (message.content == 'Hello') message.channel.send('World !');
}));

client.login(
    "Bot Token",
);
```

## With Eris
[see eris simple here](https://github.com/Shaynlink/discord-anti-abus/blob/master/test/eris.simple.js)

```js
const Eris = require('eris');
const discordAntiAbus = require('discord-anti-abus');
const AntiAbus = discordAntiAbus.client(discordAntiAbus.eris);
const bot = new Eris(
    "Bot Token",
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
```

# Create your own Plugin

```js
const MyPlugin = Base => class extends Base {
    constructor(client, options) {
        super(client, options);

        this.clientUser = { // Date of your bot (you can complete this proprety with parseClient)
            // id: 'bot ID', (obligatory)
        }; 
    };

    parseClient(client) { // First call after Anti-Abus has been instanceid
        /**
         * @example
         * client.on('ready', () => this.clientUser.id = client.user.id);
         */
    };

    parseMessage(message) { // Call when bot received message
        /**
        * content: string, (obligatory)
        * author: {
        *   id: snowflake, (obligatory)
        * },
        * channel: {
        *   id: snowflake, (obligatory)
        * },
        * guild: {
        *   id: snowflake,
        * } | null,
        * isGuild: boolean, (obligatory)
        */

        /**
        * @exemple
        * return {
        *   content: message.content,
        *   author: {
        *       id: message.author.id,
        *   },
        *   channel: {
        *       id: message.channel.id,
        *   },
        *   guild: !!message.guild ? {
        *       id: message.guild.id,
        *   } : null,
        *   isGuild: !!message.guild,
        * }
        */
    };

    static get isBase() { // Obligatory for Anti-abus recognize a plugin
        return true;
    };
};