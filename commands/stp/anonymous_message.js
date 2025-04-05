const {
    ActionRowBuilder,
    Client,
    ModalBuilder,
    Interaction,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder,
} = require('discord.js');
const CommandName = "anonymous_message";
const ModalID = 'anonymousMessage';
const TextInputID = 'messageInput';

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription("匿名でメッセージを送信します。メッセージ内容はコマンド実行後に表示されるモーダルウィンドウで入力してください。")
        .addStringOption(option => 
            option
                .setName('reply')
                .setDescription('【任意】リプライするメッセージのID')
                .setRequired(false)
        )
        .addBooleanOption(option => 
            option
                .setName('mention')
                .setDescription('【任意】リプライ時でのメンションのON/OFF')
                .setRequired(false)
        )
    ,
    /**
    * @param {Client} client クライアント
    * @param {Interaction} interaction インタラクション
    */
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== CommandName) return;
        const replyID = interaction.options.getString('reply');
        const mention = interaction.options.getBoolean('mention') ?? true;
        const sendCh = interaction.channel;
        
        const modal = new ModalBuilder()
            .setCustomId(ModalID)
            .setTitle('匿名でメッセージを送信する');

        const messageInput = new TextInputBuilder()
            .setCustomId(TextInputID)
            .setLabel("送信するメッセージの内容")
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === ModalID;
        
        interaction.awaitModalSubmit({ filter, time: 60000 })
        .then(async mInteraction => {
            const sendCh = interaction.channel;
            const content = mInteraction.fields.getTextInputValue(TextInputID);
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
            await mInteraction.reply({
                content: "The Command Exited.",
                ephemeral: true,
            });
        })
        .catch(console.error);
    },
};