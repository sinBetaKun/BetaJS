const {
    ActionRowBuilder,
    Client,
    ModalBuilder,
    Interaction,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ModalSubmitInteraction
} = require('discord.js');
const CommandName = 'allow_dl_contents';
const ModalID = 'allowDLContents';
const TextInput = 'messageInput';
const INFO = require("./info");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription('配布物のダウンロード権限を与えます。')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('認証するメンバー')
                .setRequired(true)
        )
    ,
    // スラッシュコマンドを受け取ると以下が実行される
    /**
    * @param {Client} client クライアント
    * @param {Interaction} interaction インタラクション
    */
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== CommandName) return;
        const member = interaction.options.getMember('member');
        const conCh = client.channels.cache.get(INFO.chIDs.application);
        const logCh = client.channels.cache.get(INFO.chIDs.consent_log);
        const time = Math.floor(Date.now()/1000);
        const mention = `<@${member.id}>\n`;

        const userName = member.nickname ?? member.user.globalName;

        const modal = new ModalBuilder()
            .setCustomId(ModalID)
            .setTitle(`${userName}のメンバー認証`);

        const messageInput = new TextInputBuilder()
            .setCustomId(TextInput)
            .setLabel('送信するメッセージの内容')
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === ModalID;
		
        interaction
        .awaitModalSubmit({ filter, time: 60000 })
        .then(async mInteraction => {
            const logMes = mention + `>>[Lv.1] <t:${time}:d> <t:${time}:t>`;
            member.roles.add(INFO.role.d_lv1);
            const message = mInteraction.fields.getTextInputValue(TextInput);
            await mInteraction.reply({
                content: "The Command Exited.",
                ephemeral: true,
            });
            logCh.send(logMes);
            conCh.send(mention + message);
        })
        .catch(console.error);
    },
};