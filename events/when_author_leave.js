const { Events, Client, GuildMember } = require('discord.js');
const AUTO_LEAVE = require('../beta_modules/authors_finder.js');

module.exports = {
    name: Events.GuildMemberRemove,
    once: true,
    /**
    * @param {Client} client クライアント
    * @param {GuildMember} member 退出したメンバー
    */
    async execute(member, client) {
        await AUTO_LEAVE.findOrLeave(member.guild, client);
    },
};