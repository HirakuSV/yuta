const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, yuta) {
		const initialMessage = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		const rtPing = initialMessage.createdTimestamp - interaction.createdTimestamp;
		const emb = new EmbedBuilder()
		.setTitle('Ping')
		.setColor('LuminousVividPink')
		.setThumbnail(yuta.user.displayAvatarURL())
		.setDescription(`• Roundtrip ping: \`${rtPing}\`ms\n • Websocket ping: \`${yuta.ws.ping}ms\``);
		initialMessage.edit({ content: null, embeds: [emb] });
	},
};