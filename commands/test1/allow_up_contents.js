const {
    ActionRowBuilder,
    ChannelType,
    Client,
    ModalBuilder,
    Interaction,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require('discord.js');
const CommandName = 'allow_up_contents';
const ModalID = 'allowUpContents';
const TextInput = 'messageInput';
const INFO = require('../../guild_info/test1');
const all_message_fetcher = require("../../beta_modules/all_message_fetcher");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription('配布物のアップロード権限を与えます。')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('認証するメンバー')
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
        const member = interaction.options.getMember('member');

        if (member.roles.cache.has(INFO.role.up)) {
            await interaction.reply({
                content: "既にロールが付与されています。",
                ephemeral: true,
            });
            return;
        }

        const conCh = client.channels.cache.get(INFO.chIDs.cmn_apl);
        const logCh = client.channels.cache.get(INFO.chIDs.cmn_apl_log);
        const time = Math.floor(Date.now()/1000);
        const mention = `<@${member.id}>\n`;

        const userName = member.nickname ?? member.user.globalName;

        const modal = new ModalBuilder()
            .setCustomId(ModalID)
            .setTitle(`${userName}のUP権付与`);

        const messageInput = new TextInputBuilder()
            .setCustomId(TextInput)
            .setLabel('送信するメッセージの内容')
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(firstActionRow);

        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === ModalID;
		
        interaction
        .awaitModalSubmit({ filter, time: 60000 })
        .then(async mInteraction => {
            const logMes = mention + `>>[up] <t:${time}:d> <t:${time}:t>`;
            member.roles.add(INFO.role.up);
            const message = mInteraction.fields.getTextInputValue(TextInput);
            const listCh = client.channels.cache.get(INFO.chIDs.uplder_list);
            
            const messages = await all_message_fetcher.execute(listCh);

            logCh.send(logMes);
            conCh.send(mention + message);

            for (const message of messages) {
                if (message.content.startsWith(mention)) {
                    return;
                }
            }

            const guild = client.guilds.cache.get(INFO.gldID);
            const category = guild.channels.cache.find(
                (c) => c.id == INFO.chIDs.d_ctgry && c.type == ChannelType.GuildCategory
            );

            const uplderCh = await guild.channels.create({
                parent: category,
                name: `for ${mention}`,
                type: ChannelType.GuildText,
            });

            await uplderCh.permissionOverwrites.set([
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: member.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.UseApplicationCommands,
                    ],
                    deny: [
                        PermissionFlagsBits.CreatePrivateThreads,
                        PermissionFlagsBits.CreatePublicThreads,
                        PermissionFlagsBits.SendMessagesInThreads,
                    ],
                }
            ]);

            listCh.send(`${mention} : <#${uplderCh.id}>`);
            uplderCh.send(mention + 'You can upload and distribute items here.\n-# ここで項目をアップロード・配布できます。');
            
            await mInteraction.reply({
                content: "The Command Exited.",
                ephemeral: true,
            });
        })
        .catch(console.error);
    },
};