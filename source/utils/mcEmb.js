const { EmbedBuilder } = require('discord.js');

function mcEmbed(thumbnail = 'https://images-ext-2.discordapp.net/external/uNzfqfzLU0G1mxAvyYos2Gnd6v9lNMYcCFZh0adtByA/https/i.ytimg.com/vi/Jbl_7LQudeI/hq720.jpg?width=832&height=468', title = 'Invaild_TITLE', des = 'Invaild metadata', yutaAv) {
    const emb = new EmbedBuilder()
        .setAuthor({ name: 'Yuta Music', iconURL: yutaAv })
        .setThumbnail(thumbnail || yutaAv)
        .setColor('LuminousVividPink')
        .setTitle(title)
        .setDescription(des);
    return emb;
}
module.exports = mcEmbed;