class ChatCommand {
    constructor(commandConfig) {
        if (!commandConfig) {
            throw new Error(
                'Invalid parameters. Must pass a chat command configuration'
            );
        }
        if (!commandConfig.text) {
            throw new Error(
                'Invalid parameters. Command configuration must include a text property'
            );
        }

        if (
            !commandConfig.callback ||
            typeof commandConfig.callback !== 'function'
        ) {
            throw new Error(
                'Invalid parameters. Command configuration must include a callback property.'
            );
        }
        if (
            commandConfig.userCooldown !== undefined &&
            (typeof commandConfig.userCooldown !== 'number' ||
                commandConfig.userCooldown < 0)
        ) {
            throw new Error(
                'Invalid parameters. User cooldown must be a number greater than 0.'
            );
        }

        if (
            commandConfig.globalCooldown !== undefined &&
            (typeof commandConfig.globalCooldown !== 'number' ||
                commandConfig.globalCooldown < 0)
        ) {
            throw new Error(
                'Invalid parameters. Global cooldown must be a number greater than 0.'
            );
        }
        this.text = commandConfig.text;
        this.callback = commandConfig.callback;
        this.userCooldown = commandConfig.userCooldown || 0;
        this.globalCooldown = commandConfig.globalCooldown || 0;
        this.globalLastUsed = 0;
        this.userLastUsedMap = {};
    }

    tryUseCommand(username, ...args) {
        let canCallCallback = true;
        let lastUsedByUser = this.userLastUsedMap[username] || 0;
        //check user cooldown first
        if (canCallCallback && this.userCooldown > 0) {
            const date = Date.now();

            const secondsSinceLastUsed = (date - lastUsedByUser) / 1000;
            console.log(
                `Seconds since last user usage: ${secondsSinceLastUsed}`
            );
            if (secondsSinceLastUsed > this.userCooldown) {
                lastUsedByUser = date;
            } else {
                console.log('user cool down in effect!');
                canCallCallback = false;
            }
        }

        //Check for global cooldown
        if (canCallCallback && this.globalCooldown > 0) {
            //compare the last used timestamp to current timestamp
            const date = Date.now();
            const secondsSinceLastUsed = (date - this.globalLastUsed) / 1000;
            console.log(
                `Seconds since last global usage: ${secondsSinceLastUsed}`
            );
            if (secondsSinceLastUsed > this.globalCooldown) {
                this.globalLastUsed = date;
            } else {
                console.log('global cool down in effect!');
                canCallCallback = false;
            }
        }

        if (canCallCallback) {
            this.userLastUsedMap[username] = lastUsedByUser;
            this.callback(...args);
        }
    }
}

module.exports = ChatCommand;
