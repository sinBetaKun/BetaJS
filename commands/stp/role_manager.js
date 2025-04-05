const {
    Client,
    EmbedBuilder,
    Interaction,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');
const fetch = require('node-fetch');
const CommandName = 'role_manager';
const SubCommandName = {
    creat_desc : 'creat_description',
    del_desc : 'delete_description',
};
const INFO = require("./info");
const all_message_fetcher = require("../../beta_modules/all_message_fetcher");
const ERR_MESSAGE = {
    undef_sub_cmd : {
        discord : 'サブコマンドが定義されていません。',
        console : "the sub-command isn't defind. ",
    },
    dup_exist_dsc : {
        discord : '既存のロールの説明で重複が発生しています。',
        console : "duplicate existing role description.",
    },
    att_isnt_json : {
        discord : '添付ファイルはJsonである必要があります。',
        console : "attachments must be in Json.",
    },
    json_isnt_role_dsc : {
        discord : 'このJsonはロール説明オブジェクトではありません。',
        console : "this json is not a role description object.",
    },
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(CommandName)
        .setDescription('ロールマネージャー')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName(SubCommandName.creat_desc)
                .setDescription('ロール説明の追加・編集')
                .addRoleOption(option => 
                    option
                        .setName('role')
                        .setDescription('説明の対象となるロール')
                        .setRequired(true)
                )
                .addAttachmentOption(option => 
                    option
                        .setName('json_file')
                        .setDescription('埋め込み内容のjsonファイル')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(SubCommandName.del_desc)
                .setDescription('ロール説明の削除')
                .addRoleOption(option => 
                    option
                        .setName('role')
                        .setDescription('説明を削除するロール')
                        .setRequired(true)
                )
        )
    ,
    /**
    * @param {Client} client クライアント
    * @param {Interaction} interaction インタラクション
    */
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.commandName !== CommandName) return;
        const sub_command = interaction.options.getSubcommand();
        switch (sub_command) {
            case SubCommandName.creat_desc:
                const attachment = interaction.options.getAttachment('json_file');
                if (!attachment || !attachment.name.endsWith('.json')) {
                    await interaction.reply({ content: ERR_MESSAGE.att_isnt_json.discord, ephemeral: true });
                    console.error(ERR_MESSAGE.att_isnt_json.console);
                    return;
                }
                try {
                    const response = await fetch(attachment.url);
                    const jsonText = await response.text();
                    const jsonData = JSON.parse(jsonText);

                    if (typeof jsonData !== 'object' || jsonData === null || Array.isArray(jsonData)) {
                        await interaction.reply({ content: ERR_MESSAGE.json_isnt_role_dsc.discord, ephemeral: true });
                        console.error(ERR_MESSAGE.json_isnt_role_dsc.console);
                        return;
                    }
                    
                    if (!('definition' in jsonData
                        && 'acquisition' in jsonData
                        && 'mention' in jsonData
                        && 'authority' in jsonData)) {
                        await interaction.reply({ content: ERR_MESSAGE.json_isnt_role_dsc.discord, ephemeral: true });
                        console.error(ERR_MESSAGE.json_isnt_role_dsc.console);
                        return;
                    }

                    const embedFields = {
                        definition : '',
                        acquisition : '',
                        mention : '',
                        authority : '',
                    }

                    for (const key in embedFields) {
                        const content = [];
                        for(let i = 0; i < jsonData[key].length; i++){
                            content.push('* ' + jsonData[key][i]);
                        }
                        embedFields[key] = content.join('\n');
                    }

                    const role = interaction.options.getRole('role');
                    const embed = new EmbedBuilder()
                        .setTitle('<| ' + role.name + ' |>')
                        .setDescription('<@&' + role.id + '>')
                        .setColor(role.hexColor)
                        .addFields(
                            { name: '定義', value: embedFields.definition},
                            { name: 'ロール取得方法', value: embedFields.acquisition},
                            { name: 'メンション', value: embedFields.mention},
                            { name: '権限', value: embedFields.authority},
                        );

                    const channel = client.channels.cache.get(INFO.chIDs.role_description)
                    const messages = await all_message_fetcher.execute(channel);
                    const messages2 = messages.filter((element) => {
                        if (element.embeds.length === 0) return false;
                        return element.embeds[0].description === `<@&${role.id}>`;
                    });
                    if (messages2.length > 1) {
                        await interaction.reply({ content: ERR_MESSAGE.dup_exist_dsc.discord, ephemeral: true });
                        console.error(ERR_MESSAGE.dup_exist_dsc.console);
                        return;
                    }
                    if (messages2.length > 0) {
                        const message = messages2[0];
                        await message.edit({ embeds : [embed] });
                    } else {
                        channel.send({ embeds : [embed] });
                    }
                    await interaction.reply({ content: 'JSONファイルが正常に処理されました。', ephemeral: true });
                    return;
                } catch (error) {
                    console.error('JSONファイルの処理中にエラーが発生しました:', error);
                    return interaction.reply({ content: 'JSONファイルの読み込みに失敗しました。', ephemeral: true });
                }
            case SubCommandName.del_desc:
                const role = interaction.options.getRole('role');
                const channel = client.channels.cache.get(INFO.chIDs.role_description)
                const messages = await all_message_fetcher.execute(channel);
                const messages2 = messages.filter((element) => {
                    if (element.embeds.length === 0) return false;
                    return element.embeds[0].description === `<@&${role.id}>`;
                });
                channel.delete(messages2);
                await interaction.reply({ content: 'ロール説明埋め込みを削除しました。', ephemeral: true });
                return;
            default:
                await interaction.reply({ content: ERR_MESSAGE.undef_sub_cmd.discord, ephemeral: true });
                console.error(ERR_MESSAGE.undef_sub_cmd.console, `(${sub_command})`);
                return;
        }
        
    },
};