import axios from 'axios';

export const config = {
  name: 'triviaph',
  version: '1.0.0',
  credits: 'August Quinn (Converted by Grim)',
  description: 'Generate random trivia about the Philippines.',
  usage: '',
  cooldown: 5,
};

export async function onCall({ message }) {
  const reply = message.reply;
  try {
    const response = await axios.get('https://raw.githubusercontent.com/Augustquinn/JSONify/main/randomPHtrivia.json');
    const triviaList = response.data.trivias;

    if (triviaList.length === 0) {
      return reply('No trivia available, please try again later.');
    }

    const randomIndex = Math.floor(Math.random() * triviaList.length);
    const randomTrivia = triviaList[randomIndex];

    const message = `🇵🇭 𝗧𝗥𝗜𝗩𝗜𝗔 𝗔𝗕𝗢𝗨𝗧 𝗧𝗛𝗘 𝗣𝗛𝗜𝗟𝗜𝗣𝗣𝗜𝗡𝗘𝗦\n\n ▣ 𝗤𝗨𝗘𝗦𝗧𝗜𝗢𝗡: ${randomTrivia.question}\n\n ▣ 𝗔𝗡𝗦𝗪𝗘𝗥: ${randomTrivia.answer}`;

    reply(message);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while fetching trivia. Please try again later.');
  }
};
