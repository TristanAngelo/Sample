import axios from 'axios';
import fs from 'fs';

export default {
  config: {
    name: "share",
    description: "Share a command.",
    usage: "share",
    cooldown: 3,
    permissions: [2],
    credits: "Le Minh Tien",
  },
  onCall: async function ({ message, args }) {
    try {
      if (args[0].endsWith(".js")) {
        fs.readFile(
          process.cwd() + '/plugins/commands' + args[0],
          "utf-8",
          async (err, data) => {
            if (err) return message.reply(`Command ${args[0]} does not exist.`);
            axios.post("https://api.mocky.io/api/mock", {
              "status": 200,
              "content": data,
              "content_type": "application/json",
              "charset": "UTF-8",
              "secret": "LeMinhTien",
              "expiration": "never"
            }).then(function (response) {
              return message.reply(response.data.link);
            });
          });
        return;
      } else {
        axios.post("https://api.mocky.io/api/mock", {
          "status": 200,
          "content": args[0],
          "content_type": "application/json",
          "charset": "UTF-8",
          "secret": "LeMinhTien",
          "expiration": "never"
        }).then(function (response) {
          return message.reply(response.data.link);
        });
      }
    } catch (e) {
      console.log(e);
      message.reply('Error when uploading to Mocky');
    }
  }
}
