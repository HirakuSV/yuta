const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop playing music.'),
    async execute(interaction, yuta) {
        yuta.queue.delete(interaction.guild.id);
        getVoiceConnection(interaction.guild.id).destroy();
        interaction.reply('Deleted queue and left the voice channel.');
    },
};