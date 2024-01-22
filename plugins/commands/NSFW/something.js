import axios from 'axios';

export default {
  config: {
    name: "xvid",
    aliases: ["xvideos"],
    version: "1.0",
    author: "Milan (Converted by Grim)",
    description: "Get random xvideos.",
    permissions: [1, 2],
    usage: "",
    nsfw: true,
    cooldown: 300
  },

  onCall: async function({ message }) {
    const BASE_URL = `https://apis.samirbadaila24.repl.co/kanda/apikey=samir`;
    message.reply("Processing your requests it may take 1 to 5 minutes...");
    try {
      let res = await axios.get(BASE_URL)
      let kanda = res.data.url;
      const form = {
        body: `Look At This 🥵`
      };
      if (kanda)
        form.attachment = await global.getStream(kanda);
      message.reply(form);
    } catch (e) {
      message.reply(`Not Found!`)
      console.log(e);
    }
  }
};