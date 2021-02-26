const Discord = require('discord.js');
const DiscordMessageHandler = require('./DiscordMessageHandler');

module.exports = class QuickDiscordBot {
    constructor(config) {
        const {
            commandsDir,
            testChannel,
            testMode,
            botToken,
            ignoreChannels,
        } = config;
        if (botToken === undefined || typeof botToken !== 'string') {
            throw new Error(
                'Invalid configuration for DiscordChatBot. botToken is required.'
            );
        }
        if (commandsDir === undefined || typeof commandsDir !== 'string') {
            throw new Error(
                'Invalid configuration for DiscordChatBot. Commands directory is required.'
            );
        }

        if (ignoreChannels && !Array.isArray(ignoreChannels)) {
            throw new Error(
                'Invalid configuration for DiscordChatBot. ignoreChannels must be an array.'
            );
        }

        if (testMode && (!testChannel || typeof testChannel !== 'string')) {
            throw new Error(
                'Invalid configuration for DiscordChatBot. testChannel is required to run in test mode.'
            );
        }
        this.config = config;
        this.client = new Discord.Client();
        this.messageHandler = new DiscordMessageHandler(config);
    }

    connect() {
        this.client.on('ready', () => {
            console.log('Connected to Discord');
            if (this.config.testMode && this.config.testChannel) {
                console.log(
                    `***RUNNING IN TEST MODE*** and only listening to channel ${this.config.testChannel}`
                );
            }
            if (this.config.ignoreChannels) {
                console.log(
                    `Ignoring the following channels`,
                    this.config.ignoreChannels
                );
            }
        });
        this.client.on('message', this.messageHandler.handleMessage);
        this.client.login(this.config.botToken);
    }
};
