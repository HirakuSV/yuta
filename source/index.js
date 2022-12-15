const { Client, Collection } = require('discord.js');
const fs = require('fs');
const path = require('node:path');

const yuta = new Client({ intents: ['Guilds', 'GuildMembers', 'GuildVoiceStates'] });
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

yuta.commands = new Collection();
yuta.queue = new Collection();
yuta.skip = new Collection();
yuta.player = new Collection();

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    yuta.once(event.name, (...args) => event.execute(...args, yuta));
  } else {
    yuta.on(event.name, (...args) => event.execute(...args, yuta));
  }
}

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		yuta.commands.set(command.data.name, command);
	} else {
		console.error(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection: ', error);
});

yuta.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = yuta.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, yuta);
  } catch (error) {
    console.log(error)
    return interaction.reply({ content: `There was an error while executing this command! \`${error}\``, ephemeral: true });
  }
});

require('dotenv').config();
yuta.login(process.env.token);