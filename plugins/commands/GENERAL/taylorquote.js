import axios from 'axios';

export default {
  config: {
    name: "taylorquote",
    aliases: ["taylorquote"],
    version: "1.0",
    credits: "JUNMAR",
    cooldown: 5,
    description: "Taylor Swift quote.",
  },

  onCall: async function({ message }) {
    try {
      const res = await axios.get(`https://taylorswiftapi.onrender.com/get`);
      const respond = res.data.quote;
      const respond2 = res.data.song;
      const respond3 = res.data.album;
      const respond4 = `Quote: “${respond}”\nSong: ${respond2}\nAlbum: ${respond3}`;
      message.reply(respond4);
    } catch (error) {
      message.reply("Error occurred while fetching data from the Taylor API.");
    }
  }
};