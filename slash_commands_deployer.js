const fs = require('fs');
const path = require('path');

module.exports = {
    getCommands() {
        // グローバルコマンドの取得
        const commandDir = './commands';
        const AllCommands = {};
        const pubCommands = {};
        const filesOfProject = fs.readdirSync(commandDir)
        const pubCommandFiles = filesOfProject.filter(file => file.endsWith('.js'));
        for (const file of pubCommandFiles) {
            const command = require(path.join(commandDir, file));
            pubCommands[command.data.name] = command;
            AllCommands[command.data.name] = command;
        }

        // ギルド限定コマンドの取得
        const infoFileName = "info.js";
        const prvCommands = {};
        const commandDirList = filesOfProject.filter(dir => fs.statSync(path.join(commandDir, dir)).isDirectory())
        for (const dir of commandDirList) {
            const gldCommandFiles = fs.readdirSync(path.join(commandDir, dir)).filter(file => file.endsWith('.js') && file !== infoFileName);
            if (fs.existsSync(path.join(commandDir,dir,infoFileName))) {
                const info = require(path.join(commandDir,dir,infoFileName));
                const gldCommands = {};
                for (const file of gldCommandFiles) {
                    const command = require(path.join(commandDir,dir,file));
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
    },
    async setCommands(){
        const pubData = [];
        for (const commandName in pubCommands) {
            pubData.push(pubCommands[commandName].data);
        }
        await client.application.commands.set(pubData);

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
};