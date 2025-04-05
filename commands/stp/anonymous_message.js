const {
    ActionRowBuilder,
    Client,
    EmbedBuilder,
    ModalBuilder,
    Interaction,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder,
    PermissionsBitField,
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
        const member = interaction.member;

        if (!sendCh.permissionsFor(member)?.has(PermissionsBitField.Flags.SendMessages))
        {
            await interaction.reply({
                content: "あなたはこのチャンネルでメッセージを送信する権限がありません。",
                ephemeral: true,
            });

            return;
        }
        
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
            const content = mInteraction.fields.getTextInputValue(TextInputID);
            const embed = new EmbedBuilder()
            .setTitle('<| 匿名メッセージコマンド |>')
            .setDescription('このサーバー限定の機能です。')
            if(replyID != null){
                const targetMessage = await sendCh.messages.fetch(replyID);
                await targetMessage.reply({
                    content: content,
                    allowedMentions: { repliedUser: mention },
                    embeds: [embed],
                });
            }
            else
            {
                sendCh.send({
                    content: content,
                    embeds: [embed],
                });
            }
            await mInteraction.reply({
                content: "The Command Exited.",
                ephemeral: true,
            });
        })
        .catch(console.error);
    },
};