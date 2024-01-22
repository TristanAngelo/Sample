import axios from 'axios';

export const config = {
  name: 'minstral',
  version: '1.0.0',
  credits: 'Grim',
  description: 'Get response from Minstral API.',
  usages: '[prompt]',
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const text = args.join(" ");
  try {
    const apiUrl = `https://cyni-api-collection.onrender.com/api/minstral?question=${text}`

    const response = await axios.get(apiUrl);

    if (response.data.content) {
      message.reply(response.data.content);
    } else {
      message.reply('Failed to fetch response from Minstral API.');
    }
  } catch (error) {
    console.error('Error in Minstral command:', error);
    message.reply('An error occurred. Please try again later.');
  }
};
