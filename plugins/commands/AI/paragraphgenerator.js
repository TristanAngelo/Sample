import axios from 'axios';

export const config = {
  name: 'generateparagraph',
  aliaes: ['genpar', 'genparagraph'],
  version: '1.0.0',
  credits: 'Grim',
  description: 'Generate a paragraph on a specified topic and section heading.',
  usage: '[topic] | [section heading]',
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const userInput = args.join(' ');

  const separatorIndex = userInput.indexOf('|');

  if (separatorIndex === -1) {
    message.reply('Please provide both the topic and the section heading separated by "|". Usage: !generateparagraph [topic] | [section heading]');
    return;
  }

  const topic = userInput.slice(0, separatorIndex).trim();
  const sectionHeading = userInput.slice(separatorIndex + 1).trim();

  const options = {
    method: 'GET',
    url: 'https://paragraph-generator.p.rapidapi.com/paragraph-generator',
    params: {
      topic,
      section_heading: sectionHeading,
    },
    headers: {
      'X-RapidAPI-Key': '0719bbbe05msh40cf340d8f9be4dp1c5c51jsn5f1c1656de00',
      'X-RapidAPI-Host': 'paragraph-generator.p.rapidapi.com',
    },
  };

  try {
    message.react("📝");
    const response = await axios.request(options);
    const generatedParagraph = response.data;
    message.react("✅");
    message.reply(`📑 | 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱 𝗣𝗮𝗿𝗮𝗴𝗿𝗮𝗽𝗵:\n${generatedParagraph}`);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while generating the paragraph. Please try again later.');
  }
}
