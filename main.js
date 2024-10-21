const fs = require('fs');
const { Client, Events, GatewayIntentBits, PermissionsBitField,AttachmentBuilder,EmbedBuilder, StringSelectMenuBuilder,} = require('discord.js');
const path = require('path');
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

//-----------commands------------

//require("./deploy-commands.js");

//--------------------コマンドを読み込む--------------------------
//スラッシュコマンド

const commandDir = './commands';
const AllCommands = {};
const pubCommands = {};
const filesOfProject = fs.readdirSync(commandDir)
const pubCommandFiles = filesOfProject.filter(file => file.endsWith('.js'));
for (const file of pubCommandFiles) {
    const command = require(`${commandDir}/${file}`);
    pubCommands[command.data.name] = command;
    AllCommands[command.data.name] = command;
}

const infoFileName = "info.js";
const prvCommands = {};
const commandDirList = filesOfProject.filter(file => fs.statSync(path.join(commandDir, file)).isDirectory())
for (const dir of commandDirList) {
    const gldCommandFiles = fs.readdirSync(`${commandDir}/${dir}`).filter(file => file.endsWith('.js') && file !== infoFileName);
    if (fs.existsSync(`${commandDir}/${dir}/${infoFileName}`)) {
        const info = require(`${commandDir}/${dir}/${infoFileName}`);
        const gldCommands = {};
        for (const file of gldCommandFiles) {
            const command = require(`${commandDir}/${dir}/${file}`);
            gldCommands[command.data.name] = command;
            AllCommands[command.data.name] = command;
        }
        prvCommands[dir] = {
            gldID : info.gldID,
            commands : gldCommands,
        }
    }
    else {
        console.log(`warning: The guild command is not set because there is no “${infoFileName}” in the ${dir} directory.`)
    }
}


async function setCommands(){
    const pubData = [];
    for (const commandName in pubCommands) {
        pubData.push(pubCommands[commandName].data);
    }
    await client.application.commands.set(pubData);
    //client.guilds.cache.forEach(async g => await client.application.commands.set(pubData, g.id));

    for (const gldName in prvCommands) {
        const gldCommands = prvCommands[gldName].commands;
        const gldID = prvCommands[gldName].gldID;
        const gldData = [];
        for (const commandName in gldCommands) {
            gldData.push(gldCommands[commandName].data);
        }
        await client.application.commands.set(gldData, gldID);
    }
    console.log(client.application.commands);
}

client.once(Events.ClientReady, async (c) => {
    await setCommands();
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