const {SlashCommandBuilder,PermissionFlagsBits} = require('discord.js');
const CommandName = "authenticate_member";
const INFO = require("./info");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(CommandName)
    .setDescription("<|WAVER|> のメンバーとして認証します。\n")
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
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  ,
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== CommandName) return;
    const member = interaction.options.getMember('member');
    const message = interaction.options.getString('message');
    const primary = interaction.options.getMember('primary');
    const entCh = await client.channels.cache.get(INFO.ch.entrance);
    const logCh = await client.channels.cache.get(INFO.ch.menber_log);
    const time = Math.floor(Date.now()/1000);
    let logMes = `<@${member.id}>\n`;
    if(primary == null){
      logMes += `>>[primary] <t:${time}:d> <t:${time}:t>`;
      member.roles.add(INFO.role.primary);
    }else{
      logMes += `>>[sub] <t:${time}:d> <t:${time}:t>\n>> primary :<@${primary.id}>`;
      member.roles.add(INFO.role.sub);
    }
    logCh.send(logMes);
    entCh.send(message);
  },
};