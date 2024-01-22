import axios from 'axios';
import fs from 'fs';
import path from 'path';
import gtts from 'gtts';

export const config = {
  name: 'voiceassistant',
  aliases: ['va', 'voice'],
  version: '1.0.0',
  credits: 'Grim',
  description: 'Get response through voice message from Gptgo API.',
  usage: '[prompt]',
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const text = args.join(" ");
  try {
    const apiUrl = `https://cyni-gpt-api.onrender.com/ask?q=${text}`;

    const response = await axios.get(apiUrl);
    const voice = response.data.response;

    const gttsPath = path.join(
      global.cachePath,
      `${Date.now()}_voiceassistant_${message.messageID}.mp3`
    );
    const gttsInstance = new gtts(voice, 'en');
    gttsInstance.save(gttsPath, function(error, result) {
      if (error) {
        console.error("Error saving gTTS:", error);
        message.reply('An error occurred while processing the voice. Please try again later.');
      } else {
        message.reply(
          {
            body: "🗣️ | Here's the answer to your query:",
            attachment: fs.createReadStream(gttsPath)
          },
          () => {
            fs.unlinkSync(gttsPath, (err) => {
              if (err) {
                console.error("Error deleting file:", err);
              } else {
                console.log("File deleted successfully");
              }
            });
          }
        );
      }
    });
  } catch (error) {
    console.error('Error in Gptgo command:', error);
    message.reply('An error occurred. Please try again later.');
  }
};
