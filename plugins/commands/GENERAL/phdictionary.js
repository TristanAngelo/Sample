import axios from 'axios';

export const config = {
  name: 'phdictionary',
  cooldown: 3,
  description: 'Philippine dictionary.',
  usage: '[word]',
  credits: 'Grim'
};

export async function onCall({ message, args }) {
  const query = args.join(' ');
  if (!query) {
    message.reply('Please provide a word.');
    return;
  }

  const search = `https://tagalog.pinoydictionary.com/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(search);
    const regex = /<a href="(.*?)">.*?<\/a>.*?<div class="definition".*?>(.*?)<\/div>/s;
    const match = response.data.match(regex);
    if (!match) {
      message.reply(`No definition found for "${query}".`);
      return;
    }
    const definition = match[2].trim().replace(/<\/?p>/g, '');
    message.reply(`Salita: ${query}\n\nKahulugan: ${definition}`);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred.');
  }
};