const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('pause playing the music.'),
    async execute(interaction, yuta) {
        const player = yuta.player.get(interaction.guild.id);
        await player.pause();
        interaction.reply('Paused playing.');
    },
};