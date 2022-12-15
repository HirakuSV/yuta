const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { devId } = require('../data/settings.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('learn more about me'),
  async execute(interaction, yuta) {
    const infoEmb = new EmbedBuilder()
      .setAuthor({ name: 'About', iconURL: yuta.user.displayAvatarURL() })
      .setThumbnail(yuta.user.displayAvatarURL())
      .setColor('LuminousVividPink')
      .setDescription(`Hello there, I'm ${yuta.user.username}! I'm a cute lil music bot!`)
      .addFields({ name: 'More about me', value: `>>> **• Developer**: ${yuta.users.cache.get(devId)}\n**• Birth**: <t:${Math.round(yuta.user.createdTimestamp/1000)}:F>\n**• Written in**: Node.js, Discord.js\n`});
    interaction.reply({ embeds: [infoEmb] });
  },
};
