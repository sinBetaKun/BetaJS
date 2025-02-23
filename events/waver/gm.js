const { Events , Client } = require('discord.js');
const INFO = require('./info');

const gmLog = 'https://tenor.com/view/touhou-fumo-gm-good-morning-gn-gif-3443276815897087102';

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
    * @param {Client} client クライアント
    */
    async execute(client) {
        const gmCh = client.channels.cache.get(INFO.chIDs.spam);
        if (gmCh)gmCh.send(gmLog);
    },
};