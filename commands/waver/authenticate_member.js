const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const CommandName = "authenticate_member";
const INFO = require("./info");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription("<|WAVER|> のメンバーとして認証します。\n")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('認証するメンバー')
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('message')
                .setDescription('コメントを付けてください。')
                .setRequired(true)
        )
        .addUserOption(option => 
            option
                .setName('primary')
                .setDescription('メイン垢を指定します。')
                .setRequired(false)
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