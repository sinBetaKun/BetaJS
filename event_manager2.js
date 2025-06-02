const { Client } = require('discord.js');
const DebugManager = require('./beta_modules/DebugManager')
const fs = require('fs');
const path = require('path');

module.exports = {
    /**
    * @param {Client} client クライアント
    * @param {string} dirName イベントフォルダ
    * @param {DebugManager} dbg_mnger 
    */
    set(client, dirName, dbg_mnger) {
        const eventFileList = this.getAllFiles(dirName);
        const events = eventFileList.map(file => require(file));
        
        const categorized = events.reduce((acc, item) => {
            if (!acc[item.name]) {
                acc[item.name] = []; // 初めてなら空配列作成
            }
            acc[item.name].push(item); // 対応するカテゴリに追加
            return acc;
        }, {});

        Object.entries(categorized).forEach(([category, events]) => {
            console.log(`Category: ${category}`);
            const onceMetaEvs = events.filter(event => event.meta && event.once);
            if (onceMetaEvs.length > 0) {
                client.once(category, async (...args) => {
                    if (dbg_mnger.isDebugging()) {
                        await Promise.all(onceMetaEvs.map(event => event.execute(...args, client, dbg_mnger)));
                    }
                });
            }
            const metaEvs = events.filter(event => event.meta && !event.once);
            if (metaEvs.length > 0) {
                client.on(category, async (...args) => {
                    if (dbg_mnger.isFrozen()) {
                        await Promise.all(metaEvs.map(event => event.execute(...args, client, dbg_mnger)));
                    }
                });
            }
            const onceEvs = events.filter(event => !event.meta && event.once);
            if (onceEvs.length > 0) {
                client.once(category, async (...args) => {
                    if (!dbg_mnger.isDebugging()) {
                        await Promise.all(onceEvs.map(event => event.execute(...args, client)));
                    }
                });
            }
            const nmlEvs = events.filter(event => !event.meta && !event.once);
            if (nmlEvs.length > 0) {
                client.on(category, async (...args) => {
                    if (!dbg_mnger.isFrozen()) {
                        await Promise.all(nmlEvs.map(event => event.execute(...args, client)));
                    }
                });
            }
        });

        
    },
    /**
     * 
     * @param {string} dirPath 
     * @param {string[]} eventFileList 
     * @returns {string[]} 
     */
    getAllFiles(dirPath, eventFileList = []) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const fullPath = `${dirPath}/${file}`;
            if (fs.statSync(fullPath).isDirectory()) {
                this.getAllFiles(fullPath, eventFileList);
            } else if (fullPath.endsWith('.js')){
                eventFileList.push(fullPath);
            }
        });

        return eventFileList;
    }
}