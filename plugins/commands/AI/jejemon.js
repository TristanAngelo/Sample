import axios from 'axios';

const config = {
  name: 'jejezhuge',
  version: '1.1.1',
  credits: 'Grim',
  description: 'Talk to zHVg3 beyhBii',
  usages: '[prompt]',
  cooldown: 5,
};

async function onCall({ message, args }) {
  let txt = args.join(" ");
  try {
    if (!txt) {
      return message.reply("💅🏻 | YeHz gVrL?")
    }
    message.react("💁🏻‍♀️");
    const res = await axios.get(`https://cyni-gpt-api.onrender.com/ask?q=Pretend and act as a sassy girl and your typings should always be JEJEMON (a message that has a big, small letter and combined with numbers and always have an emoji but your reply should still be easy to read) always remember that, your language should be only tagalog. ${txt}`);
    let resu = res.data.response;
    message.react("💅🏻");
    message.reply(`💅🏻 | 𝘇𝗛𝘃𝗚3 𝗯𝗛𝗲𝘆𝗯𝗶𝗶:\n\n    ${resu}`)
      .then((d) => {
        d.addReplyEvent({
          callback: handleReply
        });
      });

  } catch (err) {
    message.react("🙅🏻‍♀️");
    return message.reply("zEhr4 y0n6 API b3+cH!");
  }
}

async function handleReply({ message }) {
  try {
    const txt = message.body.trim();

    if (!txt) {
      return message.reply("💅🏻 | YeHz gVrL?")
    }
    message.react("💁🏻‍♀️");
    const res = await axios.get(`https://chatgayfeyti.archashura.repl.co/?gpt=Pretend and act as a girl and your typings should always be JEJEMON text (a message that has a big, small letter and combined with numbers and always have an emoji but your reply should still be easy to read) always remember that, your language should be only tagalog. ${txt}`);
    let resu = res.data.content;
    message.react("💅🏻");
    message.reply(`💅🏻 | 𝘇𝗛𝘃𝗚3 𝗯𝗛𝗲𝘆𝗯𝗶𝗶:\n\n    ${resu}`)
      .then((d) => {
        d.addReplyEvent({
          callback: handleReply
        });
      });
  } catch (error) {
    console.error(`Failed to get an answer: ${error.message}`);
    message.react("🙅🏻‍♀️");
    return message.reply("zEhr4 y0n6 API b3+cH!");
  }
}

export default {
  config,
  onCall
}