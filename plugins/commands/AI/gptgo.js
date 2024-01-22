import axios from 'axios';

export const config = {
  name: 'gptgo',
  version: '1.0.0',
  credits: 'August Quinn',
  description: 'Get response from Gptgo API.',
  usages: '[prompt]',
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const text = args.join(" ");
  try {
    const apiUrl = `https://api.kenliejugarap.com/gptgo/?text=${text}`
    
    //const apiUrl = 'https://gptgo.august-api.repl.co/response';
    const response = await axios.get(apiUrl);

    if (response.data.response) {
      message.reply(response.data.response);
    } else {
      message.reply('Failed to fetch response from Gptgo API.');
    }
  } catch (error) {
    console.error('Error in Gptgo command:', error);
    message.reply('An error occurred. Please try again later.');
  }
};
