const { Events , Client } = require('discord.js');
const INFO = require('./info');

const gmLog = 'デバッグモードです。\nhttps://tenor.com/view/good-morning-green-the-pog-sanae-touhou-gif-26081192';

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