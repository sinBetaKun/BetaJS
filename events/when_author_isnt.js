const { Events, Guild, Client } = require('discord.js');
const AUTO_LEAVE = require('../beta_modules/authors_finder.js');

/**
 * 参加したサーバーにAUTHORがいない場合、自動的に退出する。
 */
module.exports = {
    name: Events.GuildCreate,
    /**
     * @param {Guild} guild サーバー
     * @param {Client} client クライアント
     */
    async execute(guild, client) {
        await AUTO_LEAVE.findOrLeave(guild, client);
    },
};