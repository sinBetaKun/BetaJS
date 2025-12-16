const { Events , Message, Client, ChannelType } = require('discord.js');
const INFO = require('../../guild_info/test1');

const scope = 2;
const limit = 2;
const time = 60_000;

module.exports = {
    name: Events.MessageCreate,
    /**
     * 同サーバー内の複数のチャンネルに
     * 同じユーザーから同じテキストメッセージが連続で送信されていた場合
     * そのユーザーにミュートロールを付与する。
     * @param {Message} message 
     * @param {Client} client 
     * @returns 
     */
    async execute(message, client) {
        if (message.guild.id !== INFO.gldID) return;

        const channels = await message.guild.channels.fetch();
        let list = [];
        
        for (const [, channel] of channels) {
            // テキストチャンネルのみ対象
            if (channel?.type !== ChannelType.GuildText) continue;

            // メッセージ履歴を読めるか確認
            if (!channel.viewable) continue;

            try {
                const messages = await channel.messages.fetch({ limit: scope });
                for (const [, m] of messages) {
                    if (m.content == message.content && Date.now() - message.createdTimestamp <= time) {
                        list.push(m);
                    }
                }
            } catch (err) {
                // 権限不足・スレッド化などで失敗する場合がある
                console.warn(`Failed to fetch messages from ${message.channel.name}`, err);
            }
        }

        if (list.length > limit) {
            try {
                message.member.roles.add(INFO.role.muted);

                for (const m of list) {
                    m.delete();
                }

                INFO.send_log(`<@${message.author.id}> を荒らしの疑いでミュートしました。`, client);
            } catch (err) {
                // 権限不足・スレッド化などで失敗する場合がある
                console.warn(`Failed to fetch messages from ${message.channel.name}`, err);
            }
        }
    },
};