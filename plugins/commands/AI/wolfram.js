import axios from 'axios';

export const config = {
  name: 'wolfram',
  aliases: ["wolf", "ram"],
  version: '1.0.0',
  credits: 'August Quinn (Converted by Grim)',
  description: 'Start a conversation with Wolfram Alpha.',
  usage: '[query]',
  cooldown: 5,
};

export async function onCall({ message, args }) {
  const appId = 'WXYVVV-L72XPEQGPY';

  if (args.length === 0) {
    message.reply('Please provide a query.');
    return;
  }

  const query = args.join(' ');

  try {
    const baseUrl = 'http://api.wolframalpha.com/v1/conversation.jsp';
    const response = await axios.get(baseUrl, {
      params: {
        appid: appId,
        i: query,
      },
    });

    if (response.data && response.data.result) {
      const result = response.data.result;
      message.reply(`𝗪𝗼𝗹𝗳𝗿𝗮𝗺 𝗔𝗹𝗽𝗵𝗮 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲: ${result}`);
    } else {
      message.reply('No valid response received from Wolfram Alpha.');
    }
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while communicating with Wolfram Alpha. Please try again later.');
  }
};