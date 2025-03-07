const { Events , Client, Message } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     * @returns 
     */
    async execute(message, client) {
        if (message.content === `<@${client.user.id}>`) {
            message.channel.send(`<@${message.member.id}>`);
        }
    },
};