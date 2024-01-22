import axios from 'axios';

export const config = {
  name: "thoughts",
  aliases: ["thought"],
  version: "1.0",
  credits: "Grim",
  cooldown: 5,
  description: "Get a random thoughts."
};

export async function onCall({ message }) {
  try {
    const res = await axios.get(`https://api.popcat.xyz/showerthoughts`);
    var result = res.data.result;
    var author = res.data.author;
    var upvotes = res.data.upvotes;
    return message.reply(`Author: ${author}\n\nThoughts: ${result}\n\n Total UpVotes: ${upvotes}`);
  } catch (err) {
    console.log(err);
    return message.reply("Error! Try again later!");
  }
};
