const {
    Interaction,
    Client,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const CommandName = "end";
const INFO = require("../../guild_info/waver");
const all_message_fetcher = require('../../beta_modules/all_message_fetcher');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription("サーバーを終了するボタンを生成します。")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,
    /**
    * @param {Client} client クライアント
    * @param {Interaction} interaction インタラクション
    */
    async execute(client, interaction) {
        // 条件不一致コマンドの無視
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== CommandName) return;
        const button = new ButtonBuilder()
            .setCustomId("enderButton")
            .setLabel("バルス")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(button);
        
        await interaction.reply({
            content: "下のボタンを押すとメンバー全員キックします。",
            components: [row],
        });
    },
};