const Discord = require('discord.js');
const DiscordMessageHandler = require('./DiscordMessageHandler');

module.exports = class QuickDiscordBot {
    constructor(config) {
        const { commandsDir, testChannel, testMode, botToken } = config;
        if (botToken === undefined || typeof botToken !== 'string') {
            throw new Error(
                'Invalid configuration for TwitchChatBot. botToken is required.'
            );
        }
        if (commandsDir === undefined || typeof commandsDir !== 'string') {
            throw new Error(
                'Invalid configuration for TwitchChatBot. Commands directory is required.'
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
        });
        this.client.on('message', this.messageHandler.handleMessage);
        this.client.login(this.config.botToken);
    }
};
