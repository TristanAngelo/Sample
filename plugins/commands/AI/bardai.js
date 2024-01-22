import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const config = {
    name: "bardai",
    version: "1.0",
    credits: "rehat-- (Converted by Grim)",
    cooldown: 5,
    description: "Artificial Intelligence Google Bard",
    usage: "<query>",
};

export async function onCall({ message, args }) {
    const uid = message.senderID;
    const prompt = args.join(" ");

    if (!prompt) {
      message.reply("Please enter a query.");
      return;
    }

    if (prompt.toLowerCase() === "clear") {
      global.handleReply.clear();
      const clear = await axios.get(`https://project-bard.onrender.com/api/bard?query=clear&uid=${uid}`);
      message.reply(clear.data.message);
      return;
    }

    if (message.type === "message_reply" && message.messageReply.attachments && message.messageReply.attachments[0].type === "photo") {
      const photo = encodeURIComponent(message.messageReply.attachments[0].url);
      const query = args.join(" ");
      const url = `https://turtle-apis.onrender.com/api/gemini/img?prompt=${encodeURIComponent(query)}&url=${photo}`;
      const response = await axios.get(url);
      message.reply(response.data.answer);
      return;
    }

    const apiUrl = `https://project-bard.onrender.com/api/bard?query=${encodeURIComponent(prompt)}&uid=${uid}`;
    try {
      const response = await axios.get(apiUrl);
      const result = response.data;

      let content = result.message;
      let imageUrls = result.imageUrls;

      let replyOptions = {
        body: content,
      };

      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageStreams = [];

        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          const imagePath = path.join(global.cachePath, `${message.threadID}_image` + (i + 1) + ".png");

          try {
            const imageResponse = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });
            fs.writeFileSync(imagePath, imageResponse.data);
            imageStreams.push(fs.createReadStream(imagePath));
          } catch (error) {
            console.error("Error occurred while downloading and saving the image:", error);
            message.reply('An error occurred.');
          }
        }

        replyOptions.attachment = imageStreams;
      }

      message.reply(replyOptions)
      .then((d) => {
        d.addReplyEvent({
          callback: handleReply
        });
      });
    } catch (error) {
      message.reply('An error occurred.');
      console.error(error.message);
    }
};

async function handleReply({ message, eventData }) {
  const prompt = message.body;
    let { author } = eventData;

  if (prompt.length == 0) return;

    try {
      const apiUrl = `https://project-bard.onrender.com/api/bard?query=${encodeURIComponent(prompt)}&uid=${author}`;
      const response = await axios.get(apiUrl);

      let content = response.data.message;
      let replyOptions = {
        body: content,
      };

      const imageUrls = response.data.imageUrls;
      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageStreams = [];

        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          const imagePath = path.join(global.cachePath, `${message.threadID}_image` + (i + 1) + ".png");

          try {
            const imageResponse = await axios.get(imageUrl, {
              responseType: "arraybuffer",
            });
            fs.writeFileSync(imagePath, imageResponse.data);
            imageStreams.push(fs.createReadStream(imagePath));
          } catch (error) {
            console.error("Error occurred while downloading and saving the image:", error);
            message.reply('An error occurred.');
          }
        }
        replyOptions.attachment = imageStreams;
      }
      message.reply(replyOptions)
      .then((d) => {
        d.addReplyEvent({
          callback: handleReply
        });
      });
    } catch (error) {
      console.error(error.message);
      message.reply("An error occurred.");
    }
};