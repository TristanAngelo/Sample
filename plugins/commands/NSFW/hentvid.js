import axios from 'axios';

export default {
  config: {
    name: "hentvid",
    aliases: ["hen3"],
    version: "1.0",
    credits: "Samir",
    cooldown: 5,
    description: "Get Anime Hentai.",
    nsfw: true
  },

  onCall: async function({ message }) {
    const BASE_URL = `https://api.zahwazein.xyz/downloader/hentaivid?apikey=zenzkey_92d341a7630e`;
    message.reply("processing your request.");
    try {
      let res = await axios.get(BASE_URL)
      let porn = res.data.result.video_1;
      const form = {
        body: ``
      };
      if (porn)
        form.attachment = await global.getStream(porn);
      message.reply(form);
    } catch (e) {
      message.reply(`An Error Occured While Processing Your Request.`)
      console.log(e);
    }
  }
};