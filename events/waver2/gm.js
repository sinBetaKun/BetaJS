const { Events , Client } = require('discord.js');
const INFO = require('../../guild_info/waver2');

const gmLog = '再起動しました。';

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
    * @param {Client} client クライアント
    */
    async execute(client) {
        const gmCh = client.channels.cache.get(INFO.chIDs.boot);
        if (gmCh)gmCh.send(gmLog);
    },
};