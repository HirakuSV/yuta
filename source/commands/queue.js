const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('list all the songs in the current queue'),
    async execute(interaction, yuta) {
        if (!yuta.queue.get(interaction.guild.id)) return interaction.reply('No queue is assinged yet. Play some music using </play:1049229882988695552>!');
        const songList = yuta.queue.get(interaction.guild.id).songs;
        let list = [];
        let count = 1;
        let totalLength = 0;
        
        for (let index in songList) {
            let object = songList[index];
            list.push(`\`${count}.\` **${object.title}** requested by ${object.author}`);
            count++;
            totalLength += object.timestamp;
        }

        function time(duration) {
            var hrs = ~~(duration / 3600);
            var mins = ~~((duration % 3600) / 60);
            var secs = ~~duration % 60;
            var ret = "";
            if (hrs > 0) ret += `${hrs}:${(mins < 10 ? "0" : "")} hours`;
            ret += `${mins}:${(secs < 10 ? "0" : "")}`;
            ret += secs;
            return ret;
        }
        
        const emb = new EmbedBuilder()
            .setAuthor({ name: 'Yuta Music', iconURL: yuta.user.displayAvatarURL() })
            .setThumbnail(songList[0].thumbnail)
            .setColor('LuminousVividPink')
            .setTitle('Server Queue')
            .setDescription(`${songList.length} • ${time(totalLength)} mins\n\n${list.join('\n')}`)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
        interaction.reply({ embeds: [emb] });
    },
};