const { Events } = require('discord.js');
const INFO = require('./info');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        
        const array = message.content.match(/```zn\s+[0-9a-f=|-]+(\s+[0-9a-f=|-]+)*\s*```/g);
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
                    znSigns += INFO.emoji['__'];
                } else if (str.charAt(j) === '=') {
                    znSigns += INFO.emoji['___'];
                } else {
                    znSigns += INFO.emoji[str.charAt(j) + '_'];
                }
            }
            content += znSigns += '\n----------------\n'
        }

        message.channel.send(content);
    },
};