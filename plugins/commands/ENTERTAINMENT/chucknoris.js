import axios from 'axios';

export const config = {
  name: "chucknorris",
  version: "1.0.0",
  credits: "Grim",
  description: "Get a random Chuck Norris joke.",
  usage: "",
  cooldown: 5
};

export async function onCall({ message }) {
  try {
    const response = await axios.get('https://api.chucknorris.io/jokes/random');
    const joke = response.data.value;
    message.reply(`🎭 | Chuck Norris Joke: ${joke}`);
  } catch (error) {
    console.error(error);
    message.reply(`Sorry, couldn't fetch a Chuck Norris joke at the moment.`);
  }
}
