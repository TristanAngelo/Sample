import axios from 'axios';

export const config = {
  name: "dyk",
  version: "1.0.0",
  credits: "Siegfried Sama (Converted by Grim)",
  description: "random facts",
  cooldown: 5,
  usage: ""
};

export async function onCall({ message }) {
  const res = await axios.get(`https://api.popcat.xyz/fact`);
  var fact = res.data.fact;
  return message.reply(`𝗗𝗶𝗱 𝘆𝗼𝘂 𝗸𝗻𝗼𝘄? ${fact}`)
}