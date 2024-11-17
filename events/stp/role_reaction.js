const { Events } = require('discord.js');
const INFO = require('./info');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        const message = await reaction.message.fetch();
        const member = message.guild.members.resolve(user);
        if (message.channel.id === INFO.chIDs.role_description) {
            if (message.embeds.length > 0) {
                const embed = message.embeds[0];
                const roleIdMatch = embed.description.match(/<@&(\d+)>/);
                if (roleIdMatch) {
                    const roleId = roleIdMatch[1];
                    const choices = INFO.roles.choices;
                    for (const group in choices) {
                        const choices2 = choices[group];
                        for (const tag in choices2) {
                            if (choices2[tag] === roleId) {
                                for (const aother in choices2) {
                                    if(member.roles.cache.has(choices2[aother]) && roleId !== choices2[aother]) {
                                        await member.roles.remove(choices2[aother]);
                                    }
                                }
                                if(!member.roles.cache.has(roleId)) member.roles.add(roleId);
                                else await member.roles.remove(roleId);
                                await reaction.remove();
                                return;
                            }
                        }
                    }
                    await reaction.remove();
                    return ;
                }
            }
        }
        
    },
};