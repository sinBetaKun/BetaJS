const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    Integration,
    Client,
} = require('discord.js');
const DebugManager = require('../../beta_modules/DebugManager');
const CommandName = "sleep";
const INFO = require('../../guild_info/waver');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription("Renderで動かしているボットが応答しないようにします。")
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
        dbg_mnger.sleep();
        if (dbg_mnger.isDebugging()) return;
        client.user.setPresence({
            activities: [{ name: '<| Debug Mode |>', type: 0 }],
            status: 'dnd'
        });
        const repCh = interaction.channel;
        const content = "スリープモードになりました。\nデバッグが終了したら必ず `/wake` を実行してください。";
        repCh.send(content);
    },
};