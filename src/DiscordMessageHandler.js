const fs = require('fs');
const ChatCommand = require('./ChatCommand');
module.exports = class DiscordMessageHandler {
    commands = {};
    constructor({
        commandsDir,
        testChannel,
        testMode = false,
        ignoreChannels = [],
        ignoreBots = true,
        showLiveMessages = true,
    }) {
        if (!commandsDir) {
            throw new Error(
                'Invalid parameters. You must include a commands directory to create a DiscordMessageHandler'
            );
        }
        if (ignoreChannels && !Array.isArray(ignoreChannels)) {
            throw new Error(
                'Invalid parameters. ignoreChannels must be an array.'
            );
        }
        this.testChannel = testChannel;
        this.testMode = testMode;
        this.ignoreChannels = ignoreChannels;
        this.ignoreBots = ignoreBots;
        this.showLiveMessages = showLiveMessages;
        try {
            const commandFiles = fs.readdirSync(commandsDir);
            commandFiles
                .filter((commandFile) => commandFile.endsWith('.js'))
                .forEach((commandFile) => {
                    const commandConfig = require(`${commandsDir}/${commandFile}`);
                    commandConfig.text =
                        commandConfig.text || `!${commandFile.slice(0, -3)}`;
                    try {
                        const chatCommand = new ChatCommand(commandConfig);
                        this.commands[chatCommand.text] = chatCommand;
                    } catch (err) {
                        console.error(err);
                        return;
                    }
                });
            console.log(`Registered commands: ${Object.keys(this.commands)}`);
        } catch (err) {
            console.error(err);
        }
    }

    handleMessage = async (msg) => {
        //In test mode, only respond to messages in the test channel
        const channel = msg.channel.name;
        if (
            this.testMode &&
            this.testChannel !== undefined &&
            channel !== this.testChannel
        ) {
            return console.log(
                `Ignoring message in test mode since it's not in the test channel`
            );
        }

        if (this.ignoreChannels && this.ignoreChannels.includes(channel)) {
            return console.log(
                `Ignoring message in channel ${channel} based on bot configuration.`
            );
        }
        !this.showLiveMessages &&
            console.log(`Live server chat messages will be suppressed.`);
        this.showLiveMessages &&
            console.info(`${msg.author.username}: ${msg.content}`);

        if (msg.author.bot && this.ignoreBots) return;
        const username = msg.author.username;
        const parts = msg.content.split(' ');

        const command = parts[0];
        if (this.commands[command]) {
            this.commands[command].tryUseCommand(username, msg);
        }
    };
};
