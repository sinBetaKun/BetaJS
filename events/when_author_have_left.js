const { Events, Client } = require('discord.js');
const AUTO_LEAVE = require('../beta_modules/authors_finder.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
    * @param {Client} client クライアント
    */
    async execute(client) {
        client.guilds.cache.forEach(async(guild) => {await AUTO_LEAVE.findOrLeave(guild, client)});
    },
};