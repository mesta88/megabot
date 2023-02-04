var Discord = require('discord.io');
var logger = require('winston');
var axios = require('axios');
require('dotenv').config();
var youtube_channelID = process.env.YOUTUBE_CHANNEL_ID;
var discord_token = process.env.DISCORD_API_TOKEN;
var discord_channelID = process.env.DISCORD_CHANNEL_ID;

var bot = new Discord.Client({
    token: discord_token,
    autorun: true
});

const youtube_url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${youtube_channelID}&type=video&eventType=live&key=${process.env.YOUTUBE_API_KEY}`;

async function checkChannelStatus() {
    try {
        const response = await axios.get(youtube_url);

        // Check if the channel is live streaming
        if (response.data.pageInfo.totalResults > 0) {
            logger.info("This channel is live streaming!");
            bot.sendMessage({
                to: discord_channelID,
                message: 'This channel is live streaming!'
            });
        } else {
            logger.info("This channel is not live streaming.");
        }
    } catch (error) {
        logger.error("Failed to retrieve information about the channel:", error);
    }
}

// Schedule the call to check the status of the channel every 5 minutes
setInterval(checkChannelStatus, 300000);

// configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Update the discord channel ID to the channel where the message event was triggered
    discord_channelID = channelID;

    if (message === "!test") {
        bot.sendMessage({
            to: channelID,
            message: 'Testing'
        });
    }

});
