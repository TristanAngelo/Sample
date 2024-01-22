import axios from 'axios';

export const config = {
  name: "doctor",
  version: "1.0.2",
  credits: "Jonell Magallanes",
  description: "Doctor AI that provides medical advice",
  usage: "[symptom]",
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const symptoms = args.join(" ");
  if (!symptoms) return message.reply("👨🏻‍⚕️ | Please specify a symptom or issue.");

  const content = `I am a Doctor AI, here to help you with your symptoms. Tell me more about: ${encodeURIComponent(symptoms)}`;
  try {
    message.react("🩺");
    const wait = await message.reply("🩺 | Diagnosing your query! Please wait...");

    const res = await axios.get(`https://api.kenliejugarap.com/blackbox/?text=${content}`);
    let respond = res.data.response;

    if (res.data.error) {
      message.reply(`Error: ${res.data.error}`);
    } else {
      const doctorAdvice = [
        "Remember to drink plenty of fluids to stay hydrated.",
        "Maintain good hygiene and practice proper handwashing.",
        "Get adequate rest to help your body recover.",
        "Avoid self-medication; always consult a doctor for proper diagnosis and treatment.",
        "Keep a record of your symptoms and any changes to share with your healthcare provider."
      ];

      const randomAdvice = doctorAdvice[Math.floor(Math.random() * doctorAdvice.length)];
      respond += `\n━━━━━━━━━━━━\n👨‍⚕️ | As a Doctor AI, my initial advice is: ${randomAdvice}`;

      message.react("💊");
      global.api.unsendMessage(wait.messageID);
      message.reply(`👨‍⚕️ | ${respond}`);
    }
  } catch (error) {
    console.error(error);
    global.api.unsendMessage(wait.messageID);
    message.reply("An error occurred while fetching the data.");
  }
}
