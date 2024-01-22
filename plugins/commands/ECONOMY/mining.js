import fetch from 'node-fetch';

const minerals = [
  { name: '𝘊𝘰𝘢𝘭', coinValue: getRandomValue(500, 1000) },
  { name: '𝘐𝘳𝘰𝘯', coinValue: getRandomValue(1000, 5000) },
  { name: '𝘉𝘳𝘰𝘯𝘻𝘦', coinValue: getRandomValue(5000, 10000) },
  { name: '𝘚𝘪𝘭𝘷𝘦𝘳', coinValue: getRandomValue(10000, 15000) },
  { name: '𝙂𝙤𝙡𝙙', coinValue: getRandomValue(15000, 20000) },
  { name: '💎', coinValue: getRandomValue(20000, 50000) },
  // Add more minerals here
];

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const config = {
  name: "mines",
  aliases: ["m", "mine"],
  description: "Dig for minerals and earn coins.",
  usage: "<text>",
  cooldown: 3600,
  permissions: [0, 1, 2],
  credits: 'Dymyrius',
  extra: {}
};

export async function onCall({ message, args, data }) {
  const { Users } = global.controllers;

  try {
    const targetID = message.senderID;
    let totalAmount = 0;
    let minedData = [];

    for (let i = 0; i < 3; i++) {
      const randomMineral = minerals[Math.floor(Math.random() * minerals.length)];

      const name = randomMineral.name;
      const coin = randomMineral.coinValue;

      totalAmount += coin;

      minedData.push({
        name: `𝙼𝚒𝚗𝚎𝚛𝚊𝚕: ${name}`,
        coin: ` ${coin.toLocaleString()} 𝚌𝚘𝚒𝚗𝚜`
      });
    }

    let replyMessage = `⛏️  𝗬𝗼𝘂 𝗵𝗮𝘃𝗲 𝗺𝗶𝗻𝗲𝗱  ⛏️\n`;
    for (let i = 0; i < minedData.length; i++) {
      replyMessage += `✓ ${minedData[i].name}: ${minedData[i].coin}\n`;
    }

    replyMessage += `💰 Total 𝚌𝚘𝚒𝚗𝚜 earned: ₱${totalAmount.toLocaleString()} 𝚌𝚘𝚒𝚗𝚜 💰`;

    message.reply(replyMessage);

    await Users.increaseMoney(targetID, totalAmount);

  } catch (error) {
    console.error(error);
    message.reply('𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚖𝚒𝚗𝚒𝚗𝚐!');
  }
}

export default {
  config,
  onCall,
};
