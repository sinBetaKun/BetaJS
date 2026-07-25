const { Events, Client, GuildMember } = require('discord.js');
const INFO = require('../../guild_info/waver2');

module.exports = {
    name: Events.GuildMemberRemove,
    /**
    * @param {Client} client クライアント
    * @param {GuildMember} member 退出したメンバー
    */
    async execute(member, client) {
        if (member.roles.cache.has(INFO.role.human)){
            const channel = await client.channels.fetch(INFO.chIDs.exit);
            if (!channel) return;
            await channel.send(`\`${member.user.username}\` <@${member.id}>`);
        }
    },
};