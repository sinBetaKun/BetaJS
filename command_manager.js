const fs = require('fs');
const path = require('path');

module.exports = {
    read_from_dir(dirName) {
        const Tree = {
            all : {},
            pub : {},
            prv : {}
        };
        const filesOfProject = fs.readdirSync(dirName)
        const pubCommandFiles = filesOfProject.filter(file => file.endsWith('.js'));
        for (const file of pubCommandFiles) {
            const command = require(`${dirName}/${file}`);
            Tree.all[command.data.name] = command;
            Tree.pub[command.data.name] = command;
        }

        const infoFileName = "info.js";
        const commandDirList = filesOfProject.filter(file => fs.statSync(path.join(dirName, file)).isDirectory())
        for (const dir of commandDirList) {
            const gldCommandFiles = fs.readdirSync(`${dirName}/${dir}`).filter(file => file.endsWith('.js') && file !== infoFileName);
            if (fs.existsSync(`${dirName}/${dir}/${infoFileName}`)) {
                const info = require(`${dirName}/${dir}/${infoFileName}`);
                const gldCommands = {};
                for (const file of gldCommandFiles) {
                    const command = require(`${dirName}/${dir}/${file}`);
                    Tree.all[command.data.name] = command;
                    gldCommands[command.data.name] = command;
                }
                Tree.prv[dir] = {
                    gldID : info.gldID,
                    commands : gldCommands,
                }
            }
            else {
                console.log(`warning: The guild command is not set because there is no “${infoFileName}” in the ${dir} directory.`)
                return undefined;
            }
        }
        return Tree;
    },
    async set_slash(client, Tree) {
        if(!("all" in Tree && "pub" in Tree && "prv" in Tree)){
            console.log("Invalid Command Tree.")
            return;
        }
        const pubData = [];
        for (const commandName in Tree.pub) {
            pubData.push(Tree.pub[commandName].data);
        }
        await client.application.commands.set(pubData);
        //client.guilds.cache.forEach(async g => await client.application.commands.set(pubData, g.id));

        for (const gldName in Tree.prv) {
            const gldCommands = Tree.prv[gldName].commands;
            const gldID = Tree.prv[gldName].gldID;
            const gldData = [];
            for (const commandName in gldCommands) {
                gldData.push(gldCommands[commandName].data);
            }
            await client.application.commands.set(gldData, gldID);
        }
        console.log(client.application.commands);
    }
}