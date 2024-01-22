const textToBinary = (text) => {
  return text.split('').map(char => char.charCodeAt(0).toString(2)).join(' ');
};

const binaryToText = (binaryText) => {
  return binaryText.split(' ').map(binaryChar => String.fromCharCode(parseInt(binaryChar, 2))).join('');
};

export default {
  config: {
    name: "binary",
    aliases: [],
    version: "1.0.0",
    credits: "Lance Ajiro",
    cooldown: 5,
    description: "Convert text to binary and decode binary to text.",
    usage: "[test] or -decode [BinaryText]"
  },

  onCall: async function({ message, args }) {
    try {
      const input = args.join(" ");

      if (input.startsWith("-decode")) {
        const binaryText = input.substring(8);
        const decodedText = binaryToText(binaryText);

        message.reply(`${decodedText}`);
      } else {
        if (input) {
          const binaryText = textToBinary(input);
          message.reply(`${binaryText}`);
        } else {
          message.reply("Please type a text to convert to binary.");
        }
      }
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while processing the command.");
    }
  }
};