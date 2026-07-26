const {
    ActionRowBuilder,
    Client,
    ModalBuilder,
    Interaction,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');
const CommandName = "send_application";
const INFO = require("../../guild_info/waver2");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription('人間化申請')
    ,
    // スラッシュコマンドを受け取ると以下が実行される
    /**
    * @param {Client} client クライアント
    * @param {Interaction} interaction インタラクション
    */
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== CommandName) return;
        const member = await interaction.guild.members.fetch(interaction.user.id);
        if (member.roles.cache.has(INFO.role.human)){
            return interaction.reply({
                content: "お前もう人間だろ。",
                ephemeral: true,
            });
        }
        if (member.roles.cache.has(INFO.role.tobehuman)){
            return interaction.reply({
                content: "申請の送信は一度までだ。",
                ephemeral: true,
            });
        }
        if (member.roles.cache.has(INFO.role.failure)){
            return interaction.reply({
                content: "<#1530661320926691489>",
                ephemeral: true,
            });
        }

        const modal = new ModalBuilder()
            .setCustomId('sendApplication')
            .setTitle("名乗れよ");

        const messageInput = new TextInputBuilder()
            .setCustomId('messageInput')
            .setLabel("おい、参加したいですか？\n軽く自己紹介してください：")
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === 'sendApplication';
		
        interaction
        .awaitModalSubmit({ filter, time: 60000 })
        .then(async mInteraction => {
            const logCh = client.channels.cache.get(INFO.chIDs.application);
            const time = Math.floor(Date.now()/1000);
            const mention = `<@${member.id}>\n`;
            let message = "";
            if (mInteraction.channel?.isThread()) {
                message += `<#${mInteraction.channel.id}>;`
            }
            message += mInteraction.fields.getTextInputValue('messageInput');
            await mInteraction.reply({
                content: "申請を送信した。しばらく待て。",
                ephemeral: true,
            });
            logCh.send(mention + message);
            member.roles.add(await interaction.guild.roles.fetch(INFO.role.tobehuman));
        })
        .catch(console.error);
    },
};