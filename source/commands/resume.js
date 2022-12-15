const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('resume playing the music.'),
    async execute(interaction, yuta) {
        const player = yuta.player.get(interaction.guild.id);
        await player.unpause();
        interaction.reply('Resumed playing.');
    },
};