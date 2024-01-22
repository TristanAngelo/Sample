import axios from 'axios';

export default {
  config: {
    name: "mpanel",
    version: "1.0",
    credits: "AceGun",
    cooldown: 5,
    description: "make your favourite anime character manga panel",
    category: "image",
    usage: "Character name or code | text",
  },

  onCall: async function({ message, args, }) {

    const info = args.join(" ");
    if (!info) {
      return message.reply(`Please enter in the format:\n/Character Name or code | text.`);

    } else {
      const msg = info.split("|");
      const id = msg[0];
      const name = msg[1];
      const juswa = msg[2];

      if (isNaN(id)) { // If input is not a number
        await message.reply("⏳ | Processing your cover...");

        let id1;
        try {
          id1 = (await axios.get(`https://www.nguyenmanh.name.vn/api/searchAvt?key=${id}`)).data.result.ID;
        } catch (error) {
          await message.reply("Character not found, please check the name and try again!");
          return;
        }

        const img = (`https://www.nguyenmanh.name.vn/api/avtWibu5?id=${id1}&tenchinh=${name}&tenphu=${juswa}&apikey=zrAM6vv6`)
        const form = {
          body: `🖼️ | Manga Panel:`
        };
        form.attachment = []
        form.attachment[0] = await global.getStream(img);
        message.reply(form);

      } else {
        await message.reply("⏳ | Processing your cover...");

        const img = (`https://www.nguyenmanh.name.vn/api/avtWibu5?id=${id}&tenchinh=${name}&tenphu=${juswa}&apikey=zrAM6vv6`)
        const form = {
          body: `🖼️ | Cover Photo:`
        };
        form.attachment = []
        form.attachment[0] = await global.getStream(img);
        message.reply(form);
      }
    }
  }
};