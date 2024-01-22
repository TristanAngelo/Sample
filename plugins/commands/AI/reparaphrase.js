import axios from 'axios';

export const config = {
  name: 'reparaphrase',
  version: '1.0.0',
  credits: 'Grim',
  description: 'Paraphrase text using the sapling.ai API.',
  usage: '[text to paraphrase]',
  cooldown: 5,
};

export async function onCall({ message, args, prefix }) {
  const textToParaphrase = args.join(' ');

  if (!textToParaphrase) {
    message.reply(`Please provide the text you want to paraphrase. Usage: ${prefix}${config.name} [text]`);
    return;
  }

  try {
    const response = await axios.post('https://api.sapling.ai/api/v1/paraphrase', {
      key: 'TLROOOL9GFDTW954E7GDQE74RGJ9F8O1', // Replace with your actual API key
      text: textToParaphrase,
    });

    const { results } = response.data;

    if (results.length === 0) {
      message.reply('No paraphrased versions were suggested for the provided text.');
    } else {
      let resultMessage = '𝗥𝗘𝗣𝗔𝗥𝗔𝗣𝗛𝗥𝗔𝗦𝗘 𝗧𝗘𝗫𝗧𝗦\n\n';
      for (const result of results) {
        resultMessage += `• 𝗢𝗿𝗶𝗴𝗶𝗻𝗮𝗹: ${result.original}\n`;
        resultMessage += `• 𝗥𝗲𝗽𝗵𝗿𝗮𝘀𝗲 𝗧𝘆𝗽𝗲: ${result.rephrase_type}\n`;
        resultMessage += `• 𝗥𝗲𝗽𝗹𝗮𝗰𝗲𝗺𝗲𝗻𝘁:\n`;

        if (Array.isArray(result.replacement)) {
          resultMessage += result.replacement.map((rep, index) => `  — ${rep}`).join('\n') + '\n\n';
        } else {
          resultMessage += `— ${result.replacement}\n\n`;
        }
      }
      message.reply(resultMessage);
    }
  } catch (error) {
    console.error('Error:', error);
    message.reply('An error occurred while paraphrasing the text. Please try again later.');
  }
}
