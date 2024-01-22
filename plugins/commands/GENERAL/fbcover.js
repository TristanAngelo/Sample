export default {
  config: {
    name: 'fbcover',
    version: '1.0',
    credits: 'Grim',
    cooldown: 5,
    description: 'Create Facebook banner',
    usage: '<name> | <subname> | <address> | <phone> | <email> | <color>',
  },

  onCall: async function({ message, args, prefix }) {
    const info = args.join(' ');
    if (!info) {
      return message.reply(`Please enter in the format:\n${prefix}fbcover name | subname | address | phone | email | color`);
    } else {
      try {
        const msg = info.split('|');
        const name = msg[0]?.trim();
        const subname = msg[1]?.trim();
        const address = msg[2]?.trim();
        const phone = msg[3]?.trim();
        const email = msg[4]?.trim();
        const color = msg[5]?.trim() || '';

        await message.reply('⏳ | Processing your fbcover..');

        // Encode only necessary parameters in the URL, excluding the email
        const img = `https://www.nguyenmanh.name.vn/api/fbcover1?name=${encodeURIComponent(name)}&uid=${message.senderID}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(phone)}&color=${encodeURIComponent(color)}&apikey=7A9v6W5l`;

        await message.reply({
          body: '「 Your cover senpai😻❤️ 」',
          attachment: await global.getStream(img)
        });

      } catch (error) {
        console.error('Error occurred:', error);
        message.reply(`❌ | Error creating the Facebook cover. Details: ${error.message}`);
      }
    }
  }
};
