# Quick Chat Bot

Easily create chat bots for different platforms with some nice built in features.

-   easy command creation/imports
-   support for user and global cooldown

This package currently supports the following platforms for handling chat commands.

-   Twitch
-   Discord

## Configuring a Twitch Chat Bot

You'll need 4 properties for creating your QuickTwitchBot.

1. `username` - the Twitch username you are connecting with
2. `password` - the Twitch password/token you are connecting with (you can find/generate your token [here](https://twitchapps.com/tmi/))
3. `channel` - the channel you are connecting to (this can be the same as your username)
4. `commandsDir` - the directory where your command files are stored

With those credentials in place, you can create your Twitch bot.

```javascript
require('dotenv').config();
const { QuickTwitchBot } = require('quick-chat-bot');
const path = require('path');
const bot = new QuickTwitchBot({
    username: <YOUR_USERNAME>, //ex. 'jamesqquick'
    password: <YOUR_PASSWORD>,
    channel: <TWITCH_CHANNEL_NAME>, //ex. 'jamesqquick'
    commandsDir: path.join(__dirname, <YOUR_COMMANDS_DIR>), // ex. 'commands'
});
bot.connect();
```

## Configuring a Discord Chat Bot

You'll need 2 properties for creating your QuickDiscordBot.

1. `botToken` - the token for your discord bot (get this from discord.com)
2. `commandsDir` - the directory where your command files are stored
3. `testMode` (optional) - a boolean that forces the bot to only listen to commands from the `testChannel` channel
4. `testChannel` (optional) - the channel to listen for messages in if the bot is in test mode
5. `ignoreChannels` (optional) - array of channel names to ignore
6. `showLiveMessages` (optional and defaults to true) - a boolean that will turn on/off logging of all messages

With those credentials in place, you can create your Discord bot.

```javascript
require('dotenv').config();
const { QuickDiscordBot } = require('quick-chat-bot');
const path = require('path');
const bot = new QuickDiscordBot({
    botToken: <YOUR_BOT_TOKEN>,
    commandsDir: path.join(__dirname, <YOUR_COMMANDS_DIR>) , // ex. 'commands'
    ignoreChannels: [], //array of channels to ignore messages
    testMode: false,
    testChannel: "test", //single channel to listen to while in test mode
    ignoreBots: true, //ignore messages from bots
    showLiveMessages: true // outputs all chat from the discord server to the console
});
bot.connect();
```

## Creating Chat Bot Commands

Commands will be parsed automatically by the Chat Bot clients by searching for `.js` files inside of the directory specified by the `commandsDir` property. These command files can have the following properties.

-   text (optional) - the text that is used for the command. If no `text` property is included, the name of the file will be used by default
-   callback (required) - callback function to be called when command is triggered
-   userCooldown (optional) - amount of time (in seconds) that the user will have to wait before sending the same command again
-   globalCooldown (optional) - amount of time (in seconds) that a any user will have to wait before sending the same command again

### Example Twitch Command

```javascript
module.exports = {
    text: '!ping',
    callback: (channel, tags, message, self, client) => {
        client.say(channel, 'pong');
    },
};
```

### Example Discord Command

```javascript
module.exports = {
    text: '!ping',
    callback: (msg) => {
        console.log('Pong');
    },
};
```
