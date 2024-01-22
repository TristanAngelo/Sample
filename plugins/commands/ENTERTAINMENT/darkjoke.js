import axios from 'axios';

export const config = {
  name: 'darkjoke',
  usage: '',
  description: 'Random dark jokes.',
  credits: 'Grim',
  cooldown: 3,
  usage: '',
};

export async function onCall({message}) {
  try {
    const response = await axios.get('https://v2.jokeapi.dev/joke/dark');
    const setup = response.data.setup.toLowerCase();
    const delivery = response.data.delivery.toLowerCase();
    message.reply(`${setup}\n${delivery}`);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred.');
  }
};