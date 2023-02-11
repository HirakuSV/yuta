const { createAudioPlayer, createAudioResource, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const mcEmbed = require('./mcEmb');

async function streamPlayer(guildId, songStream, yuta) {
  var songQueue = yuta.queue.get(guildId);
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
  yuta.player.set(guildId, player);
  player.on('error', (err) => {
    songQueue.textChannel.send(`**${songQueue.songs[0].title}** has encoding errors.`);
    if (songQueue.songs.length < 1) {
      skip();
    } else {
      songQueue.connection.destroy();
      yuta.queue.delete(guildId);
    }
  });
}

module.exports = streamPlayer;