const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytsearch = require('yt-search');
const mcEmbed = require('../utils/mcEmb');
const imPlayer = require('../utils/player');
global.AbortController = require('node-abort-controller').AbortController;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('play songs!')
    .addStringOption(str => str.setName('song').setDescription('URL or the name of the song.')
    .setRequired(true)),
  async execute(interaction, yuta) {
    if (!interaction.member.voice.channel) return interaction.reply('You need to be in a voice channel.');
    await interaction.deferReply();
    const guildQueue = yuta.queue.get(interaction.guild.id);
    const query = interaction.options.getString('song');
    let song = {};
    if (ytdl.validateURL(query)) {
      const songCache = await ytdl.getBasicInfo(query);
      song = { title: songCache.videoDetail.title, thumbnail: songCache.videoDetails.thumbnail, author: interaction.member, url: songCache.videoDetails.video_url, artist: songCache.ownerChannelName, length: songCache.lengthSeconds, timestamp: songCache.timestamp, date: songCache.uploadDate };
    } else {
      const songNameCache = await ytsearch(query);
      const songRes = (songNameCache.videos.length > 1) ? songNameCache.videos[0] : null;
      if (songRes) {
        song = { title: songRes.title, thumbnail: songRes.thumbnail, author: interaction.member, url: songRes.url, artist: songRes.author.name, length: songRes.duration.timestamp, timestamp: songRes.seconds, date: songRes.ago };
      } else {
        return interaction.reply('I cannot find anything related to your query.');
      }
    }
    interaction.editReply({ embeds: [mcEmbed(song.thumbnail, song.title, `Added **${song.title}** to the queue`, yuta.user.displayAvatarURL())] });
    if (!guildQueue) {
      const queueConstructor = {
        targetChannel: interaction.member.voice.channel,
        textChannel: interaction.channel,
        connection: null,
        songs: []
      }
      queueConstructor.songs.push(song);
      yuta.queue.set(interaction.guild.id, queueConstructor);
      try {
        const connection = await joinVoiceChannel({
          channelId: interaction.member.voice.channel.id,
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator
        });
        queueConstructor.connection = connection;
        streamPlayer(interaction.guild.id, queueConstructor.songs[0]);
      } catch (error) {
        yuta.queue.delete(interaction.guild.id);
        interaction.channel.send(`Error connecting to the channel, \`${error}\``);
        throw error;
      }
    } else {
      guildQueue.songs.push(song);
    }
    yuta.skip.set(interaction.guild.id, skip);
    var songQueue = yuta.queue.get(interaction.guild.id);
    async function streamPlayer(guildId, songStream) {
      if (!songStream) {
        songQueue.connection.destroy();
        yuta.queue.delete(guildId);
        songQueue.textChannel.send('No more songs to play');
        return;
      }

      const streamCache = await ytdl(songStream.url, { filter: 'audioonly' });
      const stream = await createAudioResource(streamCache);
      const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
      player.play(stream);
      songQueue.connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        if (!songQueue) {
          songQueue.connection.destroy();
          return songQueue.textChannel.send('No more songs play, leaving the vc.');
        } else {
          songQueue.songs.shift();
          streamPlayer(guildId, songQueue.songs[0]);
        }
      });
      songQueue.textChannel.send({ embeds: [mcEmbed(songStream.thumbnail, songStream.title, `Now playing **${songStream.title}**\nRequested by ${songStream.author}`, yuta.user.displayAvatarURL())] });
      yuta.player.set(interaction.guild.id, player);
      player.on('error', (err) => {
        songQueue.textChannel.send(`**${songQueue.songs[0].title}** has encoding errors.`);
        if (songQueue.songs.length < 1) {
          skip();
        } else {
          songQueue.connection.destroy();
          yuta.queue.delete(interaction.guild.id);
        }
      });
    }
    async function skip(ins) {
      if (!songQueue.songs.length) return songQueue.textChannel.send('No songs to skip to.')
      songQueue.songs.shift();
      streamPlayer(interaction.guild.id, songQueue.songs[0]);
      if (ins) {
        ins.reply({ embeds: [mcEmbed(songQueue.songs[0].thumbnail, songQueue.songs[0].title, `Skipped to **${songQueue.songs[0].title}**\nRequested by ${songQueue.songs[0].author}`, yuta.user.displayAvatarURL())] })
      } else songQueue.textChannel.send({ embeds: [mcEmbed(songQueue.songs[0].thumbnail, songQueue.songs[0].title, `Skipped to **${songQueue.songs[0].title}**\nRequested by ${songQueue.songs[0].author}`, yuta.user.displayAvatarURL())] })
    }
  },
};