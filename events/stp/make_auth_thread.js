const {
    Events,
    ChannelType, 
    EmbedBuilder, 
    GuildChannel, 
    Client
 } = require('discord.js');
const INFO = require('../../guild_info/stp');

module.exports = {
    name: Events.ChannelCreate,
    /**
    * @param {Client} client クライアント
    * @param {GuildChannel} channel
    */
    async execute(channel, client) {
        if (!this.check_type(channel)) return;
        if (channel.guild.id !== INFO.gldID) return;
        const forumChannel = client.channels.cache.get(INFO.chIDs.authority_forum);
        if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
            INFO.send_err(`フォーラムチャンネル<#${INFO.chIDs.authority_forum}>が見つかりませんでした。`, client);
            return;
        }
        try {
            const thread = await forumChannel.threads.create({
                name: `『${channel.name}』`,
                autoArchiveDuration: 60, // スレッドが非アクティブな場合、60分後にアーカイブ
                message: { embeds: [
                    this.make_description(`<#${channel.id}> が作成されました。\n`, channel)
                ], },
            });
            INFO.send_log(`<#${channel.id}>の権限調整スレッドを作成しました。: <#${thread.id}>`, client);
        } catch (error) {
            INFO.send_err('スレッド作成中にエラーが発生しました:\n```\n' + error + '\n```', client);
            console.error(error);
        }
    },
    /**
    * @param {string} title 
    * @param {GuildChannel} channel
    */
    make_description(title, channel) {
        const permissionOverwrites = channel.permissionOverwrites.cache;
        const permissionsInfo = this.make_pmInfo_field(permissionOverwrites);
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTimestamp()
            .setTitle(title)
            .addFields(
                { name: 'チャンネルのトピック', value: channel.topic || '（トピック無し）'},
                { name: '権限' , value: permissionsInfo}
            );
        if (channel.isTextBased()){
            const slowmode = channel.rateLimitPerUser;
            if (slowmode > 0) {
                embed.addFields({ name: '低速モード' , value: `${slowmode}秒`});
            }
        }
        return embed;
    },
    check_type(channel) {
        return (channel.type === 
            ChannelType.GuildText | 
            ChannelType.GuildForum | 
            ChannelType.GuildAnnouncement | 
            ChannelType.GuildStageVoice
        )
    },
    make_pmInfo_field(permissionOverwrites){
        let permissionsInfo = '';

        permissionOverwrites.forEach(overwrite => {
            permissionsInfo += `1. <${overwrite.type === 0 ? '@&' : '@'}${overwrite.id}>\n`;
            permissionsInfo += `  * 許可項目: ${overwrite.allow.toArray().join(', ')}\n`;
            permissionsInfo += `  * 拒否項目: ${overwrite.deny.toArray().join(', ')}\n`;
        });
        if (permissionOverwrites.size === 0) {
            permissionsInfo = '権限設定なし';
        } 
        return permissionsInfo;
    }
};