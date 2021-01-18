const fs = require('fs');
const ChatCommand = require('./ChatCommand');
module.exports = class DiscordMessageHandler {
    commands = {};
    constructor(dir, testChannel) {
        if (!dir) {
            throw new Error(
                'Invalid parameters. You must include a commands directory to create a DiscordMessageHandler'
            );
        }
        this.testChannel = testChannel;
        try {
            const commandFiles = fs.readdirSync(dir);
            commandFiles
                .filter((commandFile) => commandFile.endsWith('.js'))
                .forEach((commandFile) => {
                    const commandConfig = require(`${dir}/${commandFile}`);
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
        //Ignore if in the test channel
        if (
            this.testChannel !== undefined &&
            msg.channel.name === this.testChannel
        ) {
            return console.log('Ignoring message in test channel');
        }
        console.info(`${msg.author.username}: ${msg.content}`);
        if (msg.author.bot) return;
        const username = msg.author.username;
        const parts = msg.content.split(' ');

        const command = parts[0];
        console.log(command);
        if (this.commands[command]) {
            this.commands[command].tryUseCommand(username, msg);
        }
    };
};
