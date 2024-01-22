import { Hercai } from 'hercai';

const herc = new Hercai();

export const config = {
  name: 'hercai',
  version: '1.0.0',
  credits: 'Grim',
  description: 'Ask a question to Hercai AI',
  usages: '<your_question>',
  cooldown: 2
};

export async function onCall({ message, args }) {
  if (args.length < 1) {
    return message.reply('Please provide a question.');
  }

  const question = args.join(' ');
  const prompt = `Pretend that your name is Zhuge Bot a personal assistant. Your owner and developers are Dymyrius and Creighztan, my request is ${question}`
  message.react('⏳');
  
  // Replace 'v2' with your desired model if needed
  herc.question({ model: 'v3-beta', content: prompt })
    .then((response) => {
      const reply = response.reply;
      message.react('☑');
      message.reply(reply);
    })
    .catch((error) => {
      console.error('Error while making the Hercai API request:', error);
      message.reply('An error occurred while processing your question.');
    });
};