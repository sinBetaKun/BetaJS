const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const CommandName = "ban_member";
const INFO = require("./info");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription("メンバーをBANします。\n")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('BANするメンバー')
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('message')
                .setDescription('BAN理由を書いてください。')
                .setRequired(true)
        )
    ,
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== CommandName) return;
        const member = interaction.options.getMember('member');
        const message = interaction.options.getString('message');
        const primary = interaction.options.getMember('primary');
        const entCh = await client.channels.cache.get(INFO.chIDs.entrance);
        const logCh = await client.channels.cache.get(INFO.chIDs.menber_log);
        const time = Math.floor(Date.now()/1000);
        const mention = `<@${member.id}>\n`;
        let logMes = mention;
        if(primary == null){
            logMes += `>>[primary] <t:${time}:d> <t:${time}:t>`;
            member.roles.add(INFO.role.primary);
        }else{
            logMes += `>>[sub] <t:${time}:d> <t:${time}:t>\n>> primary :<@${primary.id}>`;
            member.roles.add(INFO.role.sub);
        }
        logCh.send(logMes);
        entCh.send(mention + message.split('\\n').join('\n'));
        await interaction.reply({
            content: "The Command Exited.",
            ephemeral: true,
        })
    },
};