import axios from 'axios';

export const config = {
  name: 'claire',
    version: '2.5',
    credits: 'JV Barcenas && LiANE For AI',
    description: 'Baliw na babaeng ai',
    usage: '[prompt]',
  cooldown: 8,
};

export async function onCall({ message, args }) {
  const prompt = message.body.split(/\s+/);
    args.shift();

  try {
  const apiUrl = new URL('https://lianeapi.onrender.com/ask/claire');
      apiUrl.searchParams.append('query', prompt);

      const response = await axios.get(apiUrl.toString());

      if (response.data && response.data.message) {
          const messageText = response.data.message;
          await message.reply(messageText);
          
          console.log('Sent answer as a reply to the user');
      } else {
          throw new Error('Invalid or missing response from API');
      }
  } catch (error) {
      console.error(`Failed to get an answer: ${error.stack || error.message}`);
    message.reply(
          `Failed to get an answer. Please try again. Details: ${error.message}`
      );
  }
};
