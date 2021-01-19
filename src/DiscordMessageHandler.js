const fs = require('fs');
const ChatCommand = require('./ChatCommand');
module.exports = class DiscordMessageHandler {
    commands = {};
    constructor({ commandsDir, testChannel, testMode }) {
        if (!commandsDir) {
            throw new Error(
                'Invalid parameters. You must include a commands directory to create a DiscordMessageHandler'
            );
        }
        this.testChannel = testChannel;
        this.testMode = testMode;
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
        if (
            this.testMode &&
            this.testChannel !== undefined &&
            msg.channel.name !== this.testChannel
        ) {
            return console.log(
                `Ignoring message in test mode since it's not in the test channel`
            );
        }
        console.info(`${msg.author.username}: ${msg.content}`);
        if (msg.author.bot) return;
        const username = msg.author.username;
        const parts = msg.content.split(' ');

        const command = parts[0];
        if (this.commands[command]) {
            this.commands[command].tryUseCommand(username, msg);
        }
    };
};
