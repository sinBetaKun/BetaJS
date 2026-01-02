const {
    Client,
    Interaction,
} = require('discord.js');
const DebugManager = require('./beta_modules/DebugManager');
const fs = require('fs');
const path = require('path');

module.exports = class CommandManager {
    #global_cmd_dic;
    #guild_cmd_dic;

    constructor () {
        this.#global_cmd_dic = {};
        this.#guild_cmd_dic = {};
    }

    /**
     * コマンドのモジュールが書かれたファイルを指定のフォルダから取得
     * @param {string} commandDirName コマンド格納フォルダ
     * @param {string} guildInfoDirName サーバー情報格納フォルダ
     */
    read_from_dir(commandDirName, guildInfoDirName) {
        const filesOfProject = fs.readdirSync(commandDirName)
        const pubCommandFiles = filesOfProject.filter(file => file.endsWith('.js'));
        for (const file of pubCommandFiles) {
            const command = require(`${commandDirName}/${file}`);
            this.#global_cmd_dic[command.data.name] = command;
        }

        const infoFileName = "info.js";
        const commandDirList = filesOfProject.filter(file => fs.statSync(path.join(commandDirName, file)).isDirectory())
        for (const dir of commandDirList) {
            const gldCommandFiles = fs.readdirSync(`${commandDirName}/${dir}`).filter(file => file.endsWith('.js') && file !== infoFileName);
            if (fs.existsSync(`${guildInfoDirName}/${dir}.js`)) {
                const info = require(`${guildInfoDirName}/${dir}.js`);
                const gldCommands = {};
                for (const file of gldCommandFiles) {
                    const command = require(`${commandDirName}/${dir}/${file}`);
                    gldCommands[command.data.name] = command;
                }
                this.#guild_cmd_dic[info.gldID] = gldCommands;
            }
            else {
                console.log(`warning: The guild command is not set because there is no “${infoFileName}.js” in the ${guildInfoDirName} directory.`)
                return false;
            }
        }
        return true;
    }

    /**
    * @param {Client} client クライアント
    */
    async set(client) {
        const glbCmdData = Object.values(this.#global_cmd_dic).map((command) => command.data);
        await client.application.commands.set(glbCmdData);
        //client.guilds.cache.forEach(async g => await client.application.commands.set(pubData, g.id));

        for (const gldID in this.#guild_cmd_dic) {
            const gldCommands = this.#guild_cmd_dic[gldID];
            const gldCmdData = Object.values(gldCommands).map((command) => command.data);
            await client.application.commands.set(gldCmdData, gldID);
        }
        console.log(client.application.commands);
    }

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     * @param {DebugManager} dbg_mnger 
     * @returns 
     */
    async execute(client, interaction, dbg_mnger) {
        const commandName = interaction.commandName;
        let command = null;
        if (commandName in this.#global_cmd_dic) {
            command = this.#global_cmd_dic[commandName];
        }
        else {
            for (const [gldID, gldCmd] of Object.entries(this.#guild_cmd_dic)) {
                if (commandName in gldCmd) {
                    command = this.#guild_cmd_dic[gldID][commandName];
                    break;
                }
            }
            if (command == null) {
                if (!dbg_mnger.isFrozen()){
                    await interaction.reply({
                        content: "The Command doesn't exit.",
                        ephemeral: true,
                    });
                }
                return false;
            }
        }
        
        try {
            if (command.meta) {
                if (!dbg_mnger.isDebugging()) {
                    await interaction.reply({
                        content: "Trying The Meta Command.",
                        ephemeral: true,
                    });
                }
                await command.execute(client, interaction, dbg_mnger);
            } else {
                if (dbg_mnger.isFrozen()) return;
                await command.execute(client, interaction);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
            });
            return false;
        }
        return true;
    }
}