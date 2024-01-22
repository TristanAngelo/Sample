import axios from 'axios';

export const config = {
  name: "advice",
  version: "1.0.0",
  credits: "August Quinn (Converted by Grim)",
  description: "Generate random advice based on a topic",
  usage: "[topic]",
  cooldown: 5
};

export async function onCall({ message, args }) {
  const topic = args.join(" ");
  const apiEndpoint = `https://api.adviceslip.com/advice/search/${encodeURIComponent(topic)}`;

  try {
    const response = await axios.get(apiEndpoint);
    const adviceData = response.data;

    if (adviceData.total_results === "0" || !adviceData.slips) {
      message.reply(`No advice found for the topic: ${topic}`);
      return;
    }

    const randomAdvice = adviceData.slips[Math.floor(Math.random() * adviceData.slips.length)];
    const advice = randomAdvice.advice;

    message.reply(`💌 | 𝗥𝗔𝗡𝗗𝗢𝗠 𝗔𝗗𝗩𝗜𝗖𝗘 𝗥𝗘𝗦𝗨𝗟𝗧\n\n𝗧𝗢𝗣𝗜𝗖: ${topic}\n𝗔𝗗𝗩𝗜𝗖𝗘: ${advice}`);
  } catch (error) {
    message.reply("𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗨𝗦𝗔𝗚𝗘\n\n𝗨𝗦𝗔𝗚𝗘: Advice [topic]");
    console.error("Advice API Error:", error.message);
  }
};
