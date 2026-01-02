const { Events , Message, Client } = require('discord.js');
const INFO = require('../guild_info/zn.js');

module.exports = {
    name: Events.MessageCreate,
    /**
     * znゼニセンス記号に変換する
     * @param {Message} message 
     * @param {Client} client 
     * @returns 
     */
    async execute(message, client) {
        const array = message.content.match(/`{3}azn\s+[0-9a-f|-]+(\s+[0-9a-f|-]+)*\s*`{3}/g);
        if (array === null) return;
        if (array.length > 16) {
            message.channel.send(`<@${message.member.id}>\nコードの数が多すぎます！`);
            return;
        }

        const array2 = array.map((str) => str.slice(5, -3).trim());
        let content = `(from <@${message.member.id}>)\n----------------\n`;
        for (let i = 0; i < array.length; i++) {
            let str = array2[i];
            let znSigns = '';
            for (let j = 0; j < str.length; j++) {
                if (str.charAt(j).match(/\s/)) {
                    znSigns += str.charAt(j);
                } else if (str.charAt(j) === '-') {
                    znSigns += INFO.emoji['zh'];
                } else {
                    znSigns += INFO.emoji['z' + str.charAt(j)];
                }
            }
            content += znSigns += '\n----------------\n'
        }

        message.channel.send(content);
    },
};