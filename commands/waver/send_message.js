const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const CommandName = "send_message";
const INFO = require("./info");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription("何を喋りましょうか。")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => 
            option
                .setName('message')
                .setDescription('コメントを付けてください。')
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('reply')
                .setDescription('リプライするメッセージのID')
                .setRequired(false)
        )
        .addBooleanOption(option => 
            option
                .setName('mention')
                .setDescription('メンションのON/OFF')
                .setRequired(false)
        )
    ,
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== CommandName) return;
        const message = interaction.options.getString('message');
        const replyID = interaction.options.getString('reply');
        const mention = interaction.options.getBoolean('mention');
        const sendCh = interaction.channel;
        const logCh = await client.channels.cache.get(INFO.chIDs.menber_log);
        const content = message.split('\\n').join('\n');
        if(replyID != null){
            const targetMessage = await sendCh.messages.fetch(replyID);
            await targetMessage.reply({
                content: content,
                allowedMentions: { repliedUser: mention }
            });
        }
        else
        {
            sendCh.send(content);
        }
        interaction.reply('メッセージ送信完了。');
    },
};