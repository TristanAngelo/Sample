import axios from 'axios';

export const config = {
  name: 'readability',
  version: '1.0.0',
  credits: 'Grim',
  description: 'Check the readability of a given text.',
  usage: '[text to check readability]',
  cooldown: 5,
};

export async function onCall({ message, args }) {
  try {
    const textToCheck = args.join(' ');

    if (!textToCheck) {
      message.reply('Please provide text to check readability. Usage: !readability [text]');
      return;
    }

    const apiURL = `https://api.textgears.com/readability?key=mzWvKUs4PBCdvoj2&text=${encodeURIComponent(textToCheck)}`;
    const response = await axios.get(apiURL);

    if (response.data.status) {
      const readabilityInfo = response.data.response.stats;

      const readingEase = readabilityInfo.fleschKincaid.readingEase;
      const grade = readabilityInfo.fleschKincaid.grade;
      const interpretation = readabilityInfo.fleschKincaid.interpretation;
      const emotionNegative = readabilityInfo.emotion.negative;
      const emotionPositive = readabilityInfo.emotion.positive;
      const length = readabilityInfo.counters.length;
      const clearLength = readabilityInfo.counters.clearLength;
      const words = readabilityInfo.counters.words;
      const sentences = readabilityInfo.counters.sentences;

      const responseMessage = `📖 | 𝗥𝗲𝗮𝗱𝗮𝗯𝗶𝗹𝗶𝘁𝘆 𝗜𝗻𝗳𝗼:\n` +
        `- Reading Ease: ${readingEase}\n` +
        `- Grade: ${grade}\n` +
        `- Interpretation: ${interpretation}\n` +
        `🤓 | 𝗘𝗺𝗼𝘁𝗶𝗼𝗻 𝗔𝗻𝗮𝗹𝘆𝘀𝗶𝘀:\n` +
        `- Negative: ${emotionNegative}\n` +
        `- Positive: ${emotionPositive}\n` +
        `🧾 | 𝗧𝗲𝘅𝘁 𝗖𝗼𝘂𝗻𝘁𝗲𝗿𝘀:\n` +
        `- Length: ${length}\n` +
        `- Clear Length: ${clearLength}\n` +
        `- Words: ${words}\n` +
        `- Sentences: ${sentences}`;
      message.reply(responseMessage);
    } else {
      message.reply('Error: Readability check failed. Please try again later.');
    }
  } catch (error) {
    console.error('Error:', error);
    message.reply('An error occurred while checking readability. Please try again later.');
  }
}
