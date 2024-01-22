import axios from 'axios';

const config = {
  name: 'ngl',
  version: '1.0.0',
  credits: 'Grim',
  description: 'Send a spam ngl message.',
  usage: '[username] [message] [amount]',
};

async function onCall({ message, args, prefix }) {
  const nglusername = args[0];
  const messages = args.slice(1, -1).join(' ');
  const amount = args[args.length - 1];

  const maxAmount = 10; // Adjust the max amount of spam.

  if (!nglusername || !messages || !amount || amount > maxAmount) {
    return message.reply(
      `Invalid command format. Format: ${prefix}${config.name} [username] [message] [1-${maxAmount}]`
    );
  }

  try {
    const headers = {
      referer: `https://ngl.link/${nglusername}`,
      'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    const data = {
      username: nglusername,
      question: messages,
      deviceId: 'ea356443-ab18-4a49-b590-bd8f96b994ee',
      gameSlug: '',
      referrer: '',
    };

    let value = 0;
    for (let i = 0; i < amount; i++) {
      await axios.post('https://ngl.link/api/submit', data, {
        headers,
      });
      value += 1;
      console.log(`[+] Send => ${value}`);
    }

    message.reply(
      `Successfully sent ${amount} message(s) to ${nglusername} through ngl.link.`
    );
  } catch (error) {
    console.error(error);
    message.reply(
      'An error occurred while sending the message through ngl.link.'
    );
  }
};

export default {
  config,
  onCall,
};