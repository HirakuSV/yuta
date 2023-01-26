const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { getAverageColor } = require('fast-average-color-node');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('get info on the current playing song'),
    async execute(interaction, yuta) {
        if (!yuta.queue.get(interaction.guild.id)) return interaction.reply('Not playing anything right now. Play some music using </play:1049229882988695552>!');
        const songQueue = yuta.queue.get(interaction.guild.id);
        let color;
        await getAverageColor(songQueue.songs[0].thumbnail).then(r => {
            color = r.hex;
        });
        const emb = new EmbedBuilder()
        .setAuthor({ name: 'Yuta Music', iconURL: yuta.user.displayAvatarURL() })
        .setColor(color)
        .setImage(songQueue.songs[0].thumbnail)
        .setTitle(songQueue.songs[0].title)
        .setDescription(`• Song by: ${songQueue.songs[0].artist}\n• Published: ${songQueue.songs[0].date}\n• Total length: ${songQueue.songs[0].length}\n• Requested by: ${songQueue.songs[0].author}\n• URL: [YouTube Link](${songQueue.songs[0].url})`)
        interaction.reply({ embeds: [emb] });
    },
};