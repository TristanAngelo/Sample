import axios from 'axios';

const config = {
  name: 'gpt',
  version: '1.1.1',
  credits: 'Deku (Converted by Grim)',
  description: 'An AI powered by ChatGPT',
  usages: '[prompt]',
  cooldown: 5,
};

async function onCall({ message, args }) {
  let txt = args.join(" ");
  try {
    if (!txt) {
      return message.reply("Please provide a question first!")
    }
    message.reply(`🔍 | "${txt}"`);
    const res = await axios.get(`https://cyni-gpt-api.onrender.com/ask?q=${txt}`);
    let resu = res.data.response;
    message.reply(resu)
  } catch (err) {
    return message.reply("API Error")
  }
}

export default {
  config,
  onCall
}