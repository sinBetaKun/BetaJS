const {
    TextChannel,
    Message,
} = require('discord.js');

module.exports = {
    // チャンネル内の全てのメッセージを取得する
    /**
    * @param {TextChannel} channel チャンネル
    * @returns {Promise<Message[]>}
    */
    async execute(channel) {
        let messages = [];
        let lastMessageId;
    
        while (true) {
            const fetchedMessages = await channel.messages.fetch({
                limit: 100,
                before: lastMessageId,
            });
    
            messages = messages.concat(Array.from(fetchedMessages.values()));
    
            if (fetchedMessages.size < 100) break;
    
            lastMessageId = fetchedMessages.last().id;
        }
    
        return messages;
    }
    
}