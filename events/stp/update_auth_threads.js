const { Events, ChannelType, EmbedBuilder } = require('discord.js');
const INFO = require('./info');

module.exports = {
    name: Events.ChannelUpdate,
    async execute(oldChannel, newChannel, client) {
        if (newChannel.type !== ChannelType.GuildText) return;
        if (newChannel.guild.id !== INFO.gldID) return;
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
            await require('./make_auth_thread').execute(newChannel, client);
            return;
        }
        try {
            await targetThread.setName(`『${newChannel.name}』`);
            targetThread.send({ embeds: [
                require('./make_auth_thread')
                    .make_description(`<#${newChannel.id}> が更新されました。`, newChannel)
            ], });
            INFO.send_log(`<#${newChannel.id}>の情報を更新しました。\n詳細はスレッド<#${targetThread.id}>にてご確認ください。`, client);
        } catch (error) {
            INFO.send_err('スレッド編集中にエラーが発生しました:\n```\n' + error + '\n```', client);
            console.error(error);
        }
    },
};