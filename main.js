const { Client, Events, GatewayIntentBits} = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages, 
    ]
});

//--------------------コマンドを読み込む--------------------------
//スラッシュコマンド
const slashCommands = require("./slash_commands_deployer");
slashCommands.getCommands();


client.once(Events.ClientReady, async (c) => {
    await slashCommands.setCommands();
    console.log("setted Commands.");
    console.log(`Ready! (${c.user.tag})`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const command = AllCommands[interaction.commandName];
    try {
        await command.execute(client,interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        })
    }
});

// client.on(Events.MessageCreate, async message => {
//     if (message.author.bot) return;
// });

client.login(process.env.TOKEN);