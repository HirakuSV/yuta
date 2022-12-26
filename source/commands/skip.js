const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip the current song.'),
    async execute(interaction, yuta) {
        if (!interaction.member.voice.channel) return interaction.reply('You need to be in a voice channel.');
        const skipFn = yuta.skip.get(interaction.guild.id);
        skipFn(interaction);
    },
};