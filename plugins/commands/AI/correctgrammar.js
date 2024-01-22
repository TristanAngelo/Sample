import axios from 'axios';

export const config = {
  name: 'correction',
  version: '1.0.0',
  credits: 'Grim',
  description: 'Check and correct the spelling and grammar of a given text.',
  usage: '[text to correct]',
  cooldown: 5,
};

export async function onCall({ message, args }) {
  try {
    const textToCorrect = args.join(' ');

    if (!textToCorrect) {
      message.reply('Please provide text to correct. Usage: !correction [text]');
      return;
    }

    const apiURL = 'https://ai-based-spelling-and-grammar-correction.p.rapidapi.com/data';
    const encodedParams = new URLSearchParams();
    encodedParams.set('text', textToCorrect);

    const options = {
      method: 'POST',
      url: apiURL,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '0719bbbe05msh40cf340d8f9be4dp1c5c51jsn5f1c1656de00',
        'X-RapidAPI-Host': 'ai-based-spelling-and-grammar-correction.p.rapidapi.com',
      },
      data: encodedParams,
    };

    const response = await axios.request(options);

    if (response.data) {
      const correctedText = response.data;

      message.reply(`🤓 | 𝗖𝗼𝗿𝗿𝗲𝗰𝘁𝗲𝗱 𝗧𝗲𝘅𝘁: ${correctedText}`);
    } else {
      message.reply('Error: Spelling and grammar correction failed. Please try again later.');
    }
  } catch (error) {
    console.error('Error:', error);
    message.reply('An error occurred while checking and correcting the text. Please try again later.');
  }
}
