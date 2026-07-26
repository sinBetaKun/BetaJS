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
cmd_mnger.read_from_dir("./commands", "./guild_info");

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
    if (interaction.isButton()){
        if (interaction.customId === "end") {
            await interaction.reply("それではメンバーの皆さん、さようなら。\nhttps://discord.gg/BA92NaCdy5");
            const waver = require("./guild_info/waver.js");
            const gld = await client.guilds.fetch(waver.gldID);
            const ms = await gld.members.fetch();
            const a0 = ms.filter(x => x.roles.cache.has(waver.role.primary) || x.roles.cache.has(waver.role.sub));
            const a1 = ms.filter(x => !a0.find(y => y.id === x.id));
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
        }
    }

    if (!interaction.isCommand()) return;

    await cmd_mnger.execute(client, interaction, dbg_mnger);
});

client.login(process.env.TOKEN);