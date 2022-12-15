const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('skip the current song.'),
    async execute(interaction, yuta) {
        const skipFn = yuta.skip.get(interaction.guild.id);
        skipFn(interaction);
    },
};