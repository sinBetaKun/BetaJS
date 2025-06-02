const {
    Client,
    Integration,
    PermissionFlagsBits,
    SlashCommandBuilder,
} = require('discord.js');
const DebugManager = require('../../beta_modules/DebugManager');
const CommandName = "wake";
const INFO = require('../../guild_info/waver');

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
        dbg_mnger.wakeUp();
        if (dbg_mnger.isDebugging()) return;
        client.user.setPresence({
            activities: [],
            status: 'online'
        });
        const repCh = interaction.channel;
        const content = "スリープモードを解除しました。";
        repCh.send(content);
    },
};