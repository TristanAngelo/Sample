import axios from 'axios';
import fs from 'fs';
import request from 'request';
import path from 'path';

export const config = {
  name: "foodpic",
  version: "1.0.0",
  credits: "Prince Sanel (Converted by Grim",
  description: "Search a food.",
  usage: "food",
  cooldown: 5,
}; // credit for api: sensui

export async function onCall({ message, args }) {
  const req = args[0];
  if (!args[0]) return message.reply("Need a food to search!");
  axios.get(`https://sensui-useless-apis.codersensui.repl.co/api/tools/foodpic?query=${encodeURI(req)}`).then(res => {
    const imagePath = path.join(global.cachePath, `${message.threadID}_${Date.now()}_foods.jpg`);
    let callback = function () {
          message.reply({
            body: `❯ Query: ${req}\n❯ Result: ${res.data.title}`,
            attachment: fs.createReadStream(imagePath)
          }, () => fs.unlinkSync(imagePath));
        };
        request(res.data.image).pipe(fs.createWriteStream(imagePath)).on("close", callback);
      })
    }