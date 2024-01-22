import axios from 'axios';
import path from 'path';

export default {
  config: {
    name: 'rizz',
    version: '2.0.1',
    credits: 'Grim',
    cooldown: 8,
    description: 'Tells a random rizz line fetched from a rizz line API with two attachments.'
  },
  onCall: async function({ message }) {
    try {
      const response = await axios.get('https://vinuxd.vercel.app/api/pickup');

      if (response.status !== 200 || !response.data || !response.data.pickup) {
        throw new Error('Invalid or missing response from pickup line API');
      }

      const pickupline = response.data.pickup;
      const rizz = path.join(global.assetsPath, "rizz.mp3");
      const rizzgif = path.join(global.assetsPath, "rizz.gif");

      await message.reply({
        body: `😎: ${pickupline}`,
        attachment: global.reader(rizzgif)
      });
      message.send({
        body: "🎵 | Rizz Track:",
        attachment: global.reader(rizz)
      })
    } catch (error) {
      console.error(`Failed to send pickup line: ${error.message}`);
      message.reply('Sorry, something went wrong while trying to tell a rizz line. Please try again later.');
    }
  }
};
