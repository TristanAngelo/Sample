import axios from 'axios';

const config = {
  name: "brainshop",
  aliases: ["aoyama"],
  version: "1.1.0",
  description: "Talk in English",
  usage: "[text]/on/off",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Isai Ivanov",
  dependencies: ["axios"]
};

async function getBrainshopResponse(message) {
  try {
    const res = await axios.get(`http://api.brainshop.ai/get?bid=153868&key=rcKonOgrUFmn5usX&uid=1&msg=${encodeURIComponent(message)}`);
    return res.data.cnt;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getReply({ message, args, eventData }) {
  if (message.body.startsWith(`${data?.thread?.data?.prefix || global.config.PREFIX}${config.name}`)) return;
  try {
    const response = await getBrainshopResponse(message.body);
    message.reply(response)
      .then(data => data.addReplyEvent({ callback: getReply, myData: 'myData' }))
      .catch(err => console.error(err));
  } catch (error) {
    console.error('Error:', error);
  }
}

async function onCall({ message, args }) {
  const botID = api.getCurrentUserID();
  const { type, messageReply } = message;
  const msg = args.join(" ");
  if (!msg) return message.reply("Please enter the content you want to chat with Zhuge Bot.");
  if (msg === "who created you?" || msg === "who made you?") return message.reply("I was created by Creighztan and Dymyrius.");
  if (msg === "who is your owner?") return message.reply("My owners are Creighztan and Dymyrius");
  if (msg === "what's your name?" || msg === "what is your name?") return message.reply("My full name is Zhuge Bot, you can call me Zhuge.");
  if (msg === "what's your gender?" || msg === "what is your gender?" || msg === "are you male or female?" || msg === "are you boy or girl?")
    return message.reply("Neutral");
  if (msg === "Do you know Bengali?" || msg === "Do you know Bangla?") return message.reply("No, sorry. I do not understand Bengali.");

  try {
    const response = await getBrainshopResponse(msg);
    message.reply(response)
      .then(data => data.addReplyEvent({ callback: getReply, myData: 'myData' }))
      .catch(err => console.error(err));
  } catch (error) {
    console.error(error);
    message.reply("Bot error, please try again!");
  }
}

export {
  config,
  onCall
};