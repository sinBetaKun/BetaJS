const { Events , Client } = require('discord.js');
const INFO = require('../../guild_info/waver');

const gmLog = '<| デバッグモードで起動しました。|>';

module.exports = {
    name: Events.ClientReady,
    once: true,
    meta: true,
    /**
    * @param {Client} client クライアント
    */
    async execute(client) {
        const gmCh = client.channels.cache.get(INFO.chIDs.spam);
        if (gmCh)gmCh.send(gmLog);
    },
};
