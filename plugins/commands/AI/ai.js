import axios from 'axios';

export const config = {
  name: "ai",
  version: "1.0",
  credits: "VɪLLAVER",
  cooldown: 5,
  description: "Talk to AI",
  usage: "[query]"
};

export async function onCall({ message }) {
  const prompt = message.body;
  const userID = message.senderID;
  const name = await global.controllers.Users.getData(userID).name;

  try {
    const waitingQue = await message.reply("🔍 | Just a moment, please wait.");
    const response = await axios.get(`https://api-t86a.onrender.com/api/ai?prompt=${prompt}&uid=${userID}name=${name}`);

    await global.api.unsendMessage(waitingQue.messageID);
    message.reply({ body: `${response.data.result}`})
    .then((d) => {
        d.addReplyEvent({
          callback: handleReply
        });
      });
  } catch (error) {
    console.error("Error:", error.message);
  }
};

async function handleReply({ message, eventData }) {
  let { author } = eventData;
  const userID = message.senderID;
  const name = await global.controllers.Users.getData(userID).name;
  const prompt = message.body;

  try {
    message.react("🤖");
    const response = await axios.get(`https://api-t86a.onrender.com/api/ai?prompt=${prompt}&uid=${userID}name=${name}`);
    message.reply({ body: `${response.data.result}`})
    .then((d) => {
        d.addReplyEvent({
          callback: handleReply
        });
      });
  } catch (error) {
    console.error("Error:", error.message);
  }
};