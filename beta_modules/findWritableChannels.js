const { Guild , PermissionFlagsBits } = require('discord.js');
/**
 * サーバー内でチャットが可能なチャンネルを取得する
 */
module.exports = {
    /**
     * サーバー内でチャットが可能なチャンネルの配列を取得する
     * @param {Guild} guild サーバー
     * @return 取得したチャンネル一覧
     */
    findAll(guild) {
        return guild.channels.cache.filter(channel => 
            channel.isTextBased() && 
            channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages)
        );
    },
    /**
     * サーバー内でチャットが可能なチャンネルを１つ取得し、チャンネルにメッセージを送信する。
     * @param {Guild} guild サーバー
     * @param {string} content 送信内容
     * @return 取得したチャンネル１つ
     */
    findOneAndSend(guild, content) {
        const writableChannel = this.findAll(guild).first(); // 最初のチャンネルを取得
        if (writableChannel) {
            writableChannel.send(content);
        }
    },
}