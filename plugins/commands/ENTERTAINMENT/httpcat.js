import path from 'path';

const config = {
  name: "httpcat",
  version: "1.0.0",
  credits: "August Quinn",
  description: "Get HTTP status cat images",
  usage: "[http status code]",
  cooldown: 5
};

async function onCall({ message, args }) {
  const catPath = path.join(
    global.cachePath,
    `cat_${Date.now()}_${message.senderID}.png`
  );

  try {
    if (!args[0]) {
      message.reply("Provide an HTTP status code to get a cat image!");
      return;
    }

    const statusCode = args[0];
    const catImageURL = `https://http.cat/${statusCode}.jpg`;

    await global.downloadFile(catPath, catImageURL);

    await message.reply(
      {
        attachment: global.reader(catPath),
        body: `🐱 HTTP Status Cat for ${statusCode}`
      }
    );
  } catch (error) {
    console.error("Error fetching HTTP status cat image:", error);
    message.reply("Error fetching HTTP status cat image. Check the status code and try again.");
  } finally {
    if (global.isExists(catPath)) {
      global.deleteFile(catPath);
    }
  }
}

export default {
  config,
  onCall
};
