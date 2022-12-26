const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('stop playing music.'),
    async execute(interaction, yuta) {
       if (!interaction.member.voice.channel) return interaction.reply('You need to be in a voice channel.');
        yuta.queue.delete(interaction.guild.id);
        if (getVoiceConnection(interaction.guild.id)) getVoiceConnection(interaction.guild.id).destroy();
        interaction.reply('Deleted queue and left the voice channel.');
    },
};