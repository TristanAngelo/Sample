import axios from 'axios';

export default {
  config: {
    name: 'impress',
    version: '2.0',
    author: 'kshitiz',
    cooldown: 5,
    description: 'Tells a random rizz to impress someone.',
    usage: '@mention'
  },

  onCall: async function({ message }) {
    try {
      const mention = Object.keys(message.mentions);

      if (mention.length !== 1) {
        message.reply('Please mention one girl to impress.');
        return;
      }

      const mentionName = message.mentions[mention[0]].replace('@', '');

      const response = await axios.get('https://vinuxd.vercel.app/api/pickup');

      if (response.status !== 200 || !response.data || !response.data.pickup) {
        throw new Error('Invalid or missing response from pickup line API');
      }

      const pickupline = response.data.pickup.replace('{name}', mentionName);
      const messages = `${mentionName}, ${pickupline} 💐`;

      const attachment = await message.reply({
        body: messages,
        mentions: [{
          tag: message.senderID,
          id: message.senderID,
          fromIndex: messages.indexOf(mentionName),
          toIndex: messages.indexOf(mentionName) + mentionName.length,
        }],
      });

      if (!attachment || !attachment.messageID) {
        throw new Error('Failed to send message ');
      }

      console.log(`Sent  line as a reply with message ID ${attachment.messageID}`);

    } catch (error) {
      console.error(`Failed to send rizz line: ${error.message}`);
      message.reply('Sorry, something went wrong while trying to tell a line. Please try again later.');
    }
  }
};