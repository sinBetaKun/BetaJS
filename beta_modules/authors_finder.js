const { Guild , Client } = require('discord.js');
const AUTHOR = require('../author.js');
const INFO = require('../guild_info/waver.js');
const WritableChannels = require('./findWritableChannels.js')

/**
 * サーバーにAUTHORがいない場合、自動的に退出する。
 */
module.exports = {
    /**
     * サーバーにAUTHORがいない場合、自動的に退出する。
     * @param {Guild} guild サーバー
     * @param {Client} client クライアント
     * @returns 
     */
    async findOrLeave(guild, client) {
        for (const autorID of AUTHOR) {
            const member = await guild.members.fetch(autorID).catch(() => null);
            if (member) return;
        }
        const authors = AUTHOR.map((autorID) => {return `<@${autorID}>`}).join(' ');
        WritableChannels.findOneAndSend(guild,`${authors} がいないため、このサーバーから退出します。`)
        const gmCh = client.channels.cache.get(INFO.chIDs.spam);
        const gmLog = `『${guild.name}』から退出しました。`
        if (gmCh)gmCh.send(gmLog);
        await guild.leave(); // サーバーから退出
    },
};