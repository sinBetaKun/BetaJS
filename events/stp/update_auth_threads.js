const { Events, ChannelType, Client } = require('discord.js');
const INFO = require('./info');
const Maker = require('./make_auth_thread');

module.exports = {
    name: Events.ChannelUpdate,
    /**
     * @param {GuildChannel} oldChannel
     * @param {GuildChannel} newChannel
     * @param {Client} client 
    */
    async execute(oldChannel, newChannel, client) {
        if (!Maker.check_type(newChannel)) return;
        if (newChannel.guild.id !== INFO.gldID) return;
        if (!this.check_update(oldChannel, newChannel)) return;
        const forumChannel = client.channels.cache.get(INFO.chIDs.authority_forum);
        if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
            INFO.send_err(`フォーラムチャンネル<#${INFO.chIDs.authority_forum}>が見つかりませんでした。`, client);
            return;
        }
        let targetThread = undefined;
        const activeThreads = await forumChannel.threads.fetchActive();
        const archivedThreads = await forumChannel.threads.fetchArchived();
        const allThreads = new Map([...activeThreads.threads, ...archivedThreads.threads]);
        for (const [threadID, thread] of allThreads){
            const messages = await thread.messages.fetch({ after: '0',  limit: 1 });
            const firstMessage = messages.first();
            if (!firstMessage) continue;
            if (firstMessage.embeds.length < 1) continue;
            if (!firstMessage.embeds[0].title.includes(`<#${newChannel.id}>`)) continue;
            targetThread = thread;
            break;
        }
        if (!targetThread) {
            await Maker.execute(newChannel, client);
            return;
        }
        try {
            await targetThread.setName(`『${newChannel.name}』`);
            targetThread.send({ embeds: [
                Maker.make_description(`<#${newChannel.id}> が更新されました。`, newChannel)
            ], });
            INFO.send_log(`<#${newChannel.id}>の情報を更新しました。\n詳細はスレッド<#${targetThread.id}>にてご確認ください。`, client);
        } catch (error) {
            INFO.send_err('スレッド編集中にエラーが発生しました:\n```\n' + error + '\n```', client);
            console.error(error);
        }
    },
    check_update(oldChannel, newChannel){
        if (newChannel.isTextBased())
            if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                return true;
            }
        if (oldChannel.topic !== newChannel.topic) {
            return true;
        }
        const oldPermissions = Maker.make_pmInfo_field(oldChannel.permissionOverwrites.cache);
        const newPermissions = Maker.make_pmInfo_field(newChannel.permissionOverwrites.cache);
        
        if (oldPermissions !== newPermissions) {
            return true;
        }

        return false;
    }
};