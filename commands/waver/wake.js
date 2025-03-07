const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    Integration,
    Client,
} = require('discord.js');
const DebugManager = require('../../beta_modules/DebugManager');
const CommandName = "wake";
const INFO = require("../../events/waver/info");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription("Renderで動かしているボットが応答するようにします。")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,

    meta: true,
    
    /**
     * 
     * @param {Client} client 
     * @param {Integration} interaction 
     * @param {DebugManager} dbg_mnger 
     * @returns 
     */
    async execute(client, interaction, dbg_mnger) {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== CommandName) return;
        const repCh = interaction.channel;
        const content = "スリープモードを解除しました。";
        dbg_mnger.sleep();
        repCh.send(content);
        await interaction.reply({
            content: "The Command Exited.",
            ephemeral: true,
        })
    },
};