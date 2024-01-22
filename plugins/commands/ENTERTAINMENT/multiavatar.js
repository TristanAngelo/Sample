import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export const config = {
  name: "multiavatar",
  version: "2.0.0",
  credits: "August Quinn (Convert ed by Grim)",
  description: "Search for an avatar randomly",
  usage: "[name]",
  cooldown: 5
};

export async function onCall({ message, args }) {
  const apiKey = 'qQ1f2UeVN0zCuB';
  const name = args.join(" ");

  if (!name) {
      return message.reply("Kindly provide a name to search a random avatar for you.");
  }

  const url = `https://api.multiavatar.com/${encodeURIComponent(name)}.png?apikey=${apiKey}`;
  const pathToAvatar = path.join(
    global.cachePath,
    `${Date.now()}_multiavatar_${message.messageID}.png`);

  try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(pathToAvatar, Buffer.from(response.data, "binary"));

      await message.reply({
          body: "Here's your avatar:",
          attachment: fs.createReadStream(pathToAvatar)
      });

      fs.unlinkSync(pathToAvatar);
  } catch (error) {
      console.error(error);
      message.reply("An error occurred while generating the pixel avatar.");
  }
}