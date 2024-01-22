import axios from 'axios';

export const config = {
  name: 'textgrammar',
  version: '1.0.0',
  credits: 'Grim',
  description: 'Check the text grammar using the sapling.ai API.',
  usage: '[text to analyze]',
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const textToAnalyze = args.join(' ');

  if (!textToAnalyze) {
    message.reply('Please provide the text you want to analyze. Usage: !textanalysis [text]');
    return;
  }

  try {
    const response = await axios.post('https://api.sapling.ai/api/v1/edits', {
      key: 'TLROOOL9GFDTW954E7GDQE74RGJ9F8O1', // Replace with your actual API key
      session_id: 'test session',
      text: textToAnalyze,
    });

    const { edits } = response.data;

    if (edits.length === 0) {
      message.reply('No edits or corrections were suggested for the provided text.');
    } else {
      let resultMessage = '𝗧𝗘𝗫𝗧 𝗔𝗡𝗔𝗟𝗬𝗦𝗜𝗦 𝗥𝗘𝗦𝗨𝗟𝗧𝗦\n';
      for (const edit of edits) {
        resultMessage += `𝗦𝗲𝗻𝘁𝗲𝗻𝗰𝗲: ${edit.sentence}\n`;
        resultMessage += `𝗦𝘁𝗮𝗿𝘁: ${edit.start}, 𝗘𝗻𝗱: ${edit.end}\n`;
        resultMessage += `𝗘𝗿𝗿𝗼𝗿 𝗧𝘆𝗽𝗲: ${edit.general_error_type}\n`;
        resultMessage += `𝗥𝗲𝗽𝗹𝗮𝗰𝗲𝗺𝗲𝗻𝘁: ${edit.replacement}\n\n`;
      }
      message.reply(resultMessage);
    }
  } catch (error) {
    console.error('Error:', error);
    message.reply('An error occurred while analyzing the text. Please try again later.');
  }
}
