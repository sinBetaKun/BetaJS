const {
    ActionRowBuilder,
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder,
  } = require("discord.js");
  
  module.exports = {
    // スラッシュコマンドの登録　https://scrapbox.io/discordjs-japan/SlashCommandBuilder%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%82%B9%E3%83%A9%E3%83%83%E3%82%B7%E3%83%A5%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89%E3%82%92%E7%99%BB%E9%8C%B2%E3%81%99%E3%82%8B
    data: new SlashCommandBuilder()
      .setName("modal")
      .setDescription("モーダルを表示するよ!"),
    // スラッシュコマンドを受け取ると以下が実行される
    async execute(interaction) {
      if (!interaction.isChatInputCommand()) return;
  
      if (interaction.commandName === "modal") {
        // モーダルウィンドウについて　https://qiita.com/narikakun/items/868efb6640a66334a146
        const modal = new ModalBuilder()
            .setCustomId('modalTest')
            .setTitle('モーダルウィンドウのテスト');

        const ageInput = new TextInputBuilder()
            .setCustomId('ageInput')
            .setLabel("あなたの年齢を入力")
            .setStyle(TextInputStyle.Short);

        const introductionInput = new TextInputBuilder()
            .setCustomId('introductionInput')
            .setLabel("あなた自身の自己紹介を入力")
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(ageInput);
        const secondActionRow = new ActionRowBuilder().addComponents(introductionInput);
        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === 'modalTest';
		interaction.awaitModalSubmit({ filter, time: 60000 })
			.then(async mInteraction => {
				const age = mInteraction.fields.getTextInputValue('ageInput');
				const introduction = mInteraction.fields.getTextInputValue('introductionInput');
				await mInteraction.reply(`あなたの入力した年齢: ${age}\nあなたの入力した自己紹介: ${introduction}`);
			})
			.catch(console.error);
      }
    },
  };