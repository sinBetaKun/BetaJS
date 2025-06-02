const {
    Interaction,
    Client,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');
const CommandName = "ban_member";
const INFO = require("../../guild_info/waver");
const all_message_fetcher = require('../../beta_modules/all_message_fetcher');

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
                .setName('reason')
                .setDescription('BAN理由を書いてください。')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option
                .setName('days')
                .setDescription('削除するメッセージの期間')
                .setRequired(true)
        )
    ,
    /**
    * @param {Client} client クライアント
    * @param {Interaction} interaction インタラクション
    */
    async execute(client, interaction) {
        // 条件不一致コマンドの無視
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== CommandName) return;
        
        /** BAN対象のメンバー */
        const member = interaction.options.getMember('member');
        
        /** BAN理由 */
        const reasons = interaction.options.getString('reason');

        /** 削除するメッセージの期間 */
        const days = interaction.options.getInteger('days');

        interaction.deferReply();

        /** ログチャンネル */
        const logCh = client.channels.cache.get(INFO.chIDs.menber_log);

        /** 入場ログ */
        const messages = await all_message_fetcher.execute(logCh);
        const mention = `<@${member.id}>`;
        const messages2 = messages.filter((element) => {
            return element.content.startsWith(mention);
        });

        if (messages2.length < 1) {
            await interaction.editReply(`<@${member.id}> の BAN に失敗しました。`);
            return;
        }

        /** 入場ログ */
        const logMes = messages2[0];

        /** 時刻の取得 */
        const time = Math.floor(Date.now()/1000);

        /** 編集後の内容 */
        const content = `~~${logMes.content.split('\n').join("~~\n~~")}~~\n`
                        + "```diff\n- BANED -\nReason:\n- " + reasons.split('\\n').join('\n- ') + "\n```\n"
                        + `<t:${time}:d> <t:${time}:t>`;
        interaction.guild.members.ban(member.id, {reason: reasons.split('\\n').join('\n'),days: days});
        logMes.edit(content);
        await interaction.editReply(mention + "\n```diff\n- メンバーを BAN しました。\n- 詳細は以下のチャンネルをご覧ください。\n```\n" + `<#${INFO.chIDs.menber_log}>`);
    },
};