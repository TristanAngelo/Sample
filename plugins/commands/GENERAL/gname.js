import axios from 'axios';

export default {
  config: {
    name: "gname",
    aliases: ["gname"],
    version: "1.0",
    credits: "Someone",
    cooldown: 5,
    description: "Predict your gender based on your name",
    usage: "[name]"
  },

  onCall: async function ({ message, args }) {
    const name = args.join(" ");
    if (!name) return message.reply(`Wrong Format. Use`);
    try {
      const res = await axios.get(`https://api.genderize.io?name=${name}`);
      const gender = res.data.gender;
      const namePredicted = res.data.name;
      const probability = res.data.probability;
      message.reply(`Gender: ${gender}\ 
Name: ${namePredicted}\ 
Probability: ${probability}`);
    } catch (error) {
      message.reply("An error occurred while making the API request.");
    }
  }
};