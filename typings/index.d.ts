declare module "discord-anti-abus" {
    import { EventEmitter } from 'events';
    
    //#region

    export type Snowflake = string;

    export interface TAS {
        lastTimestamp: number,
        count: number,
        __delete: NodeJS.Timeout,
        __checkDelete: () => boolean,
        __clear: () => void,
        message?: Parsing,
    };

    export interface ClientOptions {
        messageHandler: (message: any, callback: (message: any, exept: AntiAbusCallback) => void) => any | null;
        antispam: {
            triggerAntiSpam: ((id: Snowflake, parsing: Parsing) => TAS | null) | null,
            mounted: ((id: Snowflake, parsing: Parsing, tas: TAS) => any) | null,
        } | boolean,
        blockCallback: boolean,
        antispamInterval: boolean,
        antispamCount: number,
        antispamResetCount: number,
        enableDM: {
            antispam: boolean,
        } | boolean,
        onMessage: (message: any, abus: AntiAbusCallback) => any,
        exceptionMembers: [string | [string, {
            antispam: boolean,
        }]] | null,
        exceptionGuilds: [string | [string, {
            antispam: boolean,
        }]] | null,
        exceptionChannels: [string | [string, {
            antispam: boolean,
        }]] | null,
    };

    export interface AntiAbusCallback {
        antispam: TAS | boolean;
    };

    export class BaseClient extends EventEmitter {
        constructor(client: any, options: ClientOptions);
        
        public options: ClientOptions;
    };

    export function mixins(base: pluginCore): Client;
    
    export class Client extends core(pluginCore(BaseClient)) {
        constructor(client: any, options: ClientOptions);
    };

    export function core(base: PluginCore): Core;

    export class Core extends pluginCore<BaseClient> {
        constructor(client: any, options: ClientOptions);

        public spams: Map<Snowflake, TAS>;

        public checkExec(parsing: Parsing): boolean;
        public __messageHandle(message: any, callback: (message: any, abus: AntiAbusCallback) => void): this;
        public messageHandler(message: any): any;
        public triggerAntiSpam(id: Snowflake, parsing: Parsing): TAS;
    };

    export function pluginCore(base: BaseClient): PluginCore;

    export class PluginCore extends BaseClient {
        constructor(client: any, options: ClientOptions);

        public clientUser: {
            id?: Snowflake,
        };

        public parseClient(client: any): void;
        public parseMessage(message: any): {
            content: string,
            author: {
                id: Snowflake,
            },
            channel: {
                id: Snowflake,
            },
            guild: {
                id: Snowflake,
            } | null,
            isGuild: boolean,
        };

        static get isBase(): true;
    };

    export interface Parsing {
        content: string;
        author: {
            id: Snowflake;
        };
        channel: {
            id: string;
        };
        guild: {
            id: Snowflake,
        } | null,
        isGuild: boolean,
    };

    export function discordjs(base: BaseClient): PluginCore;
    export function eris(base: BaseClient): PluginCore;

    //#endregion
}
