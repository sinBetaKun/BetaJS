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
        .setDescription("サーバーを終了します")
    ,
    /**
    * @param {Client} client クライアント
    * @param {Interaction} interaction インタラクション
    */
    async execute(client, interaction) {
        await interaction.reply("それではメンバーの皆さん、さようなら。\nhttps://discord.gg/BA92NaCdy5");
        const waver = require("./guild_info/waver.js");
        const gld = await client.guilds.fetch(waver.gldID);
        const ms = await gld.members.fetch();
        const a0 = ms.filter(x => x.roles.cache.has(waver.role.primary) || x.roles.cache.has(waver.role.sub));
        const a1 = ms.filter(x => !a0.find(y => y.id === x.id) && !x.roles.cache.has('1120246441491824651'));
        const a2 = a0.filter(x => x.roles.cache.has('1206481994129866854'));
        const a3 = a0.filter(x => !a2.find(y => y.id === x.id));
        const channel = interaction.channel;
        for (const m of a1.values()){
            if (m.kickable){
                await channel.send(`<@${m.id}> をキックします。`)
                await m.kick("サーバーの終了に伴い、キックしました。");
            }
        }
        for (const m of a3.values()){
            if (m.kickable){
                await channel.send(`<@${m.id}> をキックします。`)
                await m.kick("サーバーの終了に伴い、キックしました。");
            }
        }
        for (const m of a2.values()){
            if (m.kickable){
                await channel.send(`<@${m.id}> をキックします。`)
                await m.kick("サーバーの終了に伴い、キックしました。");
            }
        }
    },
};