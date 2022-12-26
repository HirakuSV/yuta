const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('pause playing the music.'),
    async execute(interaction, yuta) {
        if (!interaction.member.voice.channel) return interaction.reply('You need to be in a voice channel.');
        const player = yuta.player.get(interaction.guild.id);
        await player.pause();
        interaction.reply('Paused playing.');
    },
};