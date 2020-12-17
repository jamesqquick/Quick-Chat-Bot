const tmi = require('tmi.js');
const TwitchMessageHandler = require('./TwitchMessageHandler');
module.exports = class QuickTwitchBot {
    constructor(config) {
        if (
            config.username === undefined ||
            typeof config.username !== 'string'
        ) {
            throw new Error(
                'Invalid configuration for TwitchChatBot. Username is required.'
            );
        }
        if (
            config.password === undefined ||
            typeof config.password !== 'string'
        ) {
            throw new Error(
                'Invalid configuration for TwitchChatBot. Password is required.'
            );
        }
        if (
            config.channel === undefined ||
            typeof config.channel !== 'string'
        ) {
            throw new Error(
                'Invalid configuration for TwitchChatBot. Channel is required.'
            );
        }
        if (
            config.commandsDir === undefined ||
            typeof config.commandsDir !== 'string'
        ) {
            throw new Error(
                'Invalid configuration for TwitchChatBot. Commands directory is required.'
            );
        }
        const { username, password, channel, commandsDir } = config;
        this.twitchClient = new tmi.Client({
            options: { debug: true },
            connection: {
                reconnect: true,
                secure: true,
            },
            identity: {
                username,
                password,
            },
            channels: [channel],
        });
        this.messageHandler = new TwitchMessageHandler(commandsDir);
    }

    connect() {
        this.twitchClient.connect();
        this.twitchClient.on('message', (channel, tags, message, self) =>
            this.messageHandler.handleMessage(
                channel,
                tags,
                message,
                self,
                this.twitchClient
            )
        );
    }
};
