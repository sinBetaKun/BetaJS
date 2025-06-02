const {
    Client,
    Partials,
    Events,
    GatewayIntentBits,
} = require('discord.js');
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

const DebugManager = require('./beta_modules/DebugManager')
const dbg_mnger = new DebugManager(false); // プッシュ時は必ずfalseにする。

//-------------------<|commands|>-----------------------//
const CommandManager = require("./command_manager");
const cmd_mnger = new CommandManager();
cmd_mnger.read_from_dir("./commands");

//--------------------<|events|>------------------------//
require("./event_manager2").set(client, "./events", dbg_mnger);

client.once(Events.ClientReady, async (c) => {
    await cmd_mnger.set(client);
    console.log("setted Commands.");
    console.log(`Ready! (${c.user.tag})`);
    client.user.setPresence({
        activities: [],
        status: 'online'
    });
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    await cmd_mnger.execute(client, interaction, dbg_mnger);
});

client.login(process.env.TOKEN);