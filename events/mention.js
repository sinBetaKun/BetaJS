const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.content === `<@${client.user.id}>`) {
            message.channel.send(`<@${message.member.id}>`);
        }
    },
};