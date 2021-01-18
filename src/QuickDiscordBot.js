const Discord = require('discord.js');
const DiscordMessageHandler = require('./DiscordMessageHandler');

module.exports = class QuickDiscordBot {
    constructor(config) {
        if (
            config.botToken === undefined ||
            typeof config.botToken !== 'string'
        ) {
            throw new Error(
                'Invalid configuration for TwitchChatBot. botToken is required.'
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
        const { commandsDir, testChannel } = config;
        this.config = config;
        this.client = new Discord.Client();
        this.messageHandler = new DiscordMessageHandler(
            commandsDir,
            testChannel
        );
    }

    connect() {
        this.client.on('ready', () => {
            console.log('Learn Build Teach is active');
        });
        this.client.on('message', this.messageHandler.handleMessage);
        this.client.login(this.config.botToken);
    }
};
