const { Client, Partials, Events, GatewayIntentBits} = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        Partials.Message,
        Partials.Channel, 
        Partials.Reaction,
    ],
});

//-------------------<|commands|>-----------------------//
const cmd_mnger = require("./command_manager");
const slashTree = cmd_mnger.read_from_dir("./commands");

//--------------------<|events|>------------------------//
require("./event_manager").set(client, "./events");


client.once(Events.ClientReady, async (c) => {
    await cmd_mnger.set(client, slashTree);
    console.log("setted Commands.");
    console.log(`Ready! (${c.user.tag})`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    if(!(interaction.commandName in slashTree.all)){
        await interaction.reply({
            content: "The Command doesn't exit.",
            ephemeral: true,
        })
    }
    const command = slashTree.all[interaction.commandName];
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

client.login(process.env.TOKEN);