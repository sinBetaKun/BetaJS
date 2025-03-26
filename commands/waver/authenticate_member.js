const {
    ActionRowBuilder,
    ModalBuilder,
    Interaction,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');
const CommandName = "authenticate_member";
const INFO = require("./info");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription('<|WAVER|> のメンバーとして認証します。')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('認証するメンバー')
                .setRequired(true)
        )
        .addUserOption(option => 
            option
                .setName('primary')
                .setDescription('メイン垢を指定します。')
                .setRequired(false)
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
        const primary = interaction.options.getMember('primary');
        const entCh = await client.channels.cache.get(INFO.chIDs.entrance);
        const logCh = await client.channels.cache.get(INFO.chIDs.menber_log);
        const time = Math.floor(Date.now()/1000);
        const mention = `<@${member.id}>\n`;
        let logMes = mention;
        if (primary == null) {
            logMes += `>>[primary] <t:${time}:d> <t:${time}:t>`;
            member.roles.add(INFO.role.primary);
        } else {
            logMes += `>>[sub] <t:${time}:d> <t:${time}:t>\n>> primary :<@${primary.id}>`;
            member.roles.add(INFO.role.sub);
        }

        const userName = member.nickname ?? member.user.globalName;

        const modal = new ModalBuilder()
            .setCustomId('authenticateMember')
            .setTitle(`${userName}のメンバー認証`);

        const messageInput = new TextInputBuilder()
            .setCustomId('messageInput')
            .setLabel("送信するメッセージの内容")
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === 'authenticateMember';
		    interaction.awaitModalSubmit({ filter, time: 60000 })
            .then(async mInteraction => {
                const message = mInteraction.fields.getTextInputValue('messageInput');
                await mInteraction.reply({
                    content: "The Command Exited.",
                    ephemeral: true,
                });
                logCh.send(logMes);
                entCh.send(mention + message);
            })
            .catch(console.error);
    },
};