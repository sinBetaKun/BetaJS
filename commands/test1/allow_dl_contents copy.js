const {
    ActionRowBuilder,
    Client,
    ModalBuilder,
    Interaction,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder,
    PermissionFlagsBits,
    ModalSubmitInteraction
} = require('discord.js');
const CommandName = 'allow_dl_contents';
const ModalID = 'subscribeItems';
const TextInput = 'messageInput';
const INFO = require('../../guild_info/test1');
const all_message_fetcher = require("../../beta_modules/all_message_fetcher");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription('Subscribe items of a message to distributed list.(指定したメッセージの添付ファイルを配布リストに登録する)')
        .addNumberOption(option => 
            option
                .setName('messageID')
                .setDescription('ID of a message attached files (ファイルの添付されたメッセージのID)')
                .setRequired(true)
        )
    ,
    // スラッシュコマンドを受け取ると以下が実行される
    /**
    * @param {Client} client クライアント
    * @param {Interaction} interaction インタラクション
    */
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== CommandName) return;
        const messageID = interaction.options.getNumber('messageID').toString();
        
        if (!interaction.member.roles.cache.has(INFO.role.up)) {
            await interaction.reply({
                content: "You don't have `up` role.\n-# あなたは`up`ロールをもっていません。",
                ephemeral: true,
            });
            return;
        }

        const mention = `<@${interaction.user.id}>\n`;
        const listCh = client.channels.cache.get(INFO.chIDs.uplder_list);
        const messages = await all_message_fetcher.execute(listCh);
        for (const message of messages) {
            if (message.content.startsWith(mention)) {
                const uplderChID = message.content.replace(mention).replace('<#').replace('>');
                const targetMessage = await client.channels.fetch(uplderChID).then(async c => {
                    if (!c.isTextBased()) {
                        return null;
                    }
                    return await c.messages.fetch(messageID);
                });

                if (!targetMessage) {
                    await interaction.reply({
                        content: "can't find a message.\n-# メッセージを見つけられません。",
                        ephemeral: true,
                    });
                    return;
                }

                const attNum = targetMessage.attachments.size;

                if (attNum == 0) {
                    await interaction.reply({
                        content: "the message has no attachments.\n-# メッセージに添付ファイルがありません。",
                        ephemeral: true,
                    });
                    return;
                }

                const itemName = targetMessage.attachments.first().name + (attNum > 1) ? ` and other ${attNum - 1} files` : "";

                const modal = new ModalBuilder()
                    .setCustomId(ModalID)
                    .setTitle(`Subscribe "${itemName}"`);

                const messageInput = new TextInputBuilder()
                    .setCustomId(TextInput)
                    .setLabel('rule')
                    .setStyle(TextInputStyle.Paragraph);

                const firstActionRow = new ActionRowBuilder().addComponents(messageInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);
                const filter = (mInteraction) => mInteraction.customId === ModalID;
                
                interaction
                .awaitModalSubmit({ filter, time: 60000 })
                .then(async mInteraction => {
                    const logMes = mention + `>>[dl] <t:${time}:d> <t:${time}:t>`;
                    const message = mInteraction.fields.getTextInputValue(TextInput);
                    await mInteraction.reply({
                        content: "The Command Exited.",
                        ephemeral: true,
                    });
                    logCh.send(logMes);
                    conCh.send(mention + message);
                })
                .catch(console.error);
            }
        }
        
    },
};