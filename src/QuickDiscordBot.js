const Discord = require('discord.js');
const DiscordMessageHandler = require('./DiscordMessageHandler');

module.exports = class QuickDiscordBot {
    constructor(config) {
        const { commandsDir, testChannel, testMode, botToken } = config;
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

        if (testMode && (!testChannel || typeof testChannel !== 'string')) {
            throw new Error(
                'Invalid configuration for DiscordChatBot. testChannel is required to run in test mode.'
            );
        }
        this.config = config;
        this.client = new Discord.Client();
        this.messageHandler = new DiscordMessageHandler({
            commandsDir,
            testChannel,
            testMode,
        });
    }

    connect() {
        this.client.on('ready', () => {
            console.log('Learn Build Teach is active');
            if (this.config.testMode && this.config.testChannel) {
                console.log(
                    `***RUNNING IN TEST MODE*** and only listening to channel ${this.config.testChannel}`
                );
            }
        });
        this.client.on('message', this.messageHandler.handleMessage);
        this.client.login(this.config.botToken);
    }
};
