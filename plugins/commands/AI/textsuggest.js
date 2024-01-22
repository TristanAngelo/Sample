import axios from 'axios';

export const config = {
  name: 'wordsuggestion',
  aliases: ['ws', 'suggestion'],
  version: '1.0.0',
  credits: 'Grim',
  description: 'Check and suggest corrections for a given text.',
  usage: '[text to check]',
  cooldown: 5,
};

export async function onCall({ message, args }) {
  try {
    const textToCheck = args.join(' ');

    if (!textToCheck) {
      message.reply('Please provide a text to check. Usage: !textgears [text]');
      return;
    }

    const response = await axios.get(`https://api.textgears.com/suggest?key=mzWvKUs4PBCdvoj2&text=${encodeURIComponent(textToCheck)}`);

    const { corrected, suggestions } = response.data.response;

    let suggestionsList = '𝗦𝗨𝗚𝗚𝗘𝗦𝗧𝗜𝗢𝗡𝗦:\n';
    suggestions.forEach((suggestion, index) => {
      suggestionsList += ` ${index + 1}. ${suggestion.text}\n`;
    });

    message.reply(`📑 | 𝗬𝗢𝗨𝗥 𝗦𝗘𝗡𝗧𝗘𝗡𝗖𝗘: ${corrected}\n\n${suggestionsList}`);
  } catch (error) {
    console.error('Error:', error);
    message.reply('An error occurred while trying to check the text. Please try again later.');
  }
}
