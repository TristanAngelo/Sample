import axios from 'axios';

export const config = {
  name: "riddles",
  version: "1.0.0",
  credits: "tdunguwu",
  description: "random text",
  usages: "",
};

let currentRiddle = null; // Variable to store the current riddle

export async function onCall({ message, args }) {
  try {
    const res = await axios.get(`https://riddles-api.vercel.app/random`);
    currentRiddle = res.data; // Save the fetched riddle object
    const riddle = currentRiddle.riddle;
    message.reply(`💭 | ${riddle}\n----------------\nReply to this and type "answer" to get the answer.`)
      .then((d) => {
        d.addReplyEvent({
          callback: handleReply
        });
      })
  } catch (err) {
    console.log(err);
    message.reply("Error!");
  }
}

async function handleReply({ eventData, message }) {
  const author = eventData;
  const query = message.body;

  if (query.toLowerCase() === "answer") {
    try {
      if (!currentRiddle) {
        return message.reply("No riddle fetched.");
      }
      const answer = currentRiddle.answer;
      return message.reply(`✨ | ${answer}`);
    } catch (err) {
      console.log(err);
      message.reply("Error!");
    }
  }
}
