const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(yuta) {
    console.log(`Ready! logged has ${yuta.user.username}!`);
    yuta.user.setPresence({
      activities: [{
        name: 'Music!',
        type: ActivityType.Listening
      }],
      status: 'online'
    });
  },
};
