const { Events , Client, Message } = require('discord.js');
const INFO = require('../../guild_info/taioni');

const scope = 20
const limit = 3

module.exports = {
    name: Events.MessageCreate,
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     * @returns 
     */
    async execute(message, client) {
        return;
        if (message.guild.id !== INFO.gldID) return;
        if (this.count_gif(message) > 0) {
            const messages = await message.channel.messages.fetch({ limit: scope });
            const sortedMessages = messages.sort((a, b) => Number(b.id) - Number(a.id));
            let countOfLines = 0;
            let countOfGifs = 0;
            for (const [id, message] of sortedMessages) {
                countOfGifs += this.count_gif(message);
                if (countOfGifs >= limit) break;

                countOfLines += message.content.split('\n').length;
                if (countOfLines > scope - 1) {
                    return;
                }
            }
            await message.delete();
        }
    },

    /**
     * 
     * @param {Message} message 
     * @returns {number}
     */
    count_gif(message){
        let count = 0;
        if (message.attachments.size > 0) {
            for (const attachment of message.attachments.values()) {
                // contentTypeがあれば MIME タイプで判定
                if (attachment.contentType?.startsWith('image/') && attachment.contentType.includes('gif')) {
                    // console.log('アニメーションGIFが添付されています');
                    count++;
                }

                // またはファイル名で判定（保険）
                else if (attachment.name?.endsWith('.gif')) {
                    // console.log('アニメーションGIFが添付されています（拡張子による判定）');
                    count++;
                }
            }
        }
        const gifRegex = /(https?:\/\/)?(www\.)?(tenor\.com|giphy\.com)\/[^\s]+/gi;
        const matches = message.content.match(gifRegex);
        count += matches ? matches.length : 0;
        //console.log(`GIFリンクが ${count} 個見つかりました`);
        return count;
    },
};