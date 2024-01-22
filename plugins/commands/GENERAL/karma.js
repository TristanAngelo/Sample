import axios from 'axios';

export const config = {
  name: 'karma',
  version: '1.0.0',
  credits: 'August Quinn (Converted by Grim)',
  description: 'Get a karma quote.',
  usage: '',
  cooldown: 5,
};

export async function onCall({ message }) {
  const reply = message.reply;
  try {
    const response = await axios.get('https://karmaquotes.august-api.repl.co/quotes');
    const karmaQuotes = response.data;

    if (karmaQuotes.length === 0) {
      return reply('No karma quotes available, please try again later.');
    }

    const randomIndex = Math.floor(Math.random() * karmaQuotes.length);
    const randomKarmaQuote = karmaQuotes[randomIndex];

    const message = `💬 | 𝗞𝗔𝗥𝗠𝗔 𝗤𝗨𝗢𝗧𝗘:\n\n ➩ ${randomKarmaQuote.quote}`;

    reply(message);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while fetching karma quotes. Please try again later.');
  }
};
