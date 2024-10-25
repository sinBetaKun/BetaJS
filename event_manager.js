const fs = require('fs');
const path = require('path');

module.exports = {
    set(client, dirName) {
        const filesOfProject = fs.readdirSync(dirName)
        const pubCommandFiles = filesOfProject.filter(file => file.endsWith('.js'));
        const eventFileList = [];
        for (const file of pubCommandFiles) {
            eventFileList.push(`${dirName}/${file}`);
        }
        const infoFileName = "info.js";
        const eventDirList = filesOfProject.filter(file => fs.statSync(path.join(dirName, file)).isDirectory())
        for (const dir of eventDirList) {
            const gldEventFiles = fs.readdirSync(`${dirName}/${dir}`).filter(file => file.endsWith('.js') && file !== infoFileName);
            if (fs.existsSync(`${dirName}/${dir}/${infoFileName}`)) {
                for (const file of gldEventFiles) {
                    eventFileList.push(`${dirName}/${dir}/${file}`);
                }
            }
            else {
                console.log(`warning: The guild command is not set because there is no “${infoFileName}” in the ${dir} directory.`)
                return undefined;
            }
        }
        for (const index in eventFileList) {
            const event = require(eventFileList[index]);
            if (event.once) {
                client.once(event.name, async (...args) => await event.execute(...args, client));
            } else {
                client.on(event.name, async (...args) => await event.execute(...args, client));
            }
        }
    }
}