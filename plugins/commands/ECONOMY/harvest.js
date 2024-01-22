const config = {
  name: "harvest",
  aliases: ["h", "gather"],
  description: "Harvest vegetables and fruits to earn coins.",
  usage: "<text>",
  cooldown: 3600,
  permissions: [0, 1, 2],
  credits: 'Gauxy',
  extra: {}
};

const plantSpecies = [
  {
    name: 'Carrot', emoji: ' 🥕',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Tomato', emoji: '🍅',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Broccoli', emoji: '🥦',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Orange', emoji: '🍊',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Pepper', emoji: '🌶',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Cucumber', emoji: '🥒',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Avocado', emoji: '🥑',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Mango', emoji: '🍋',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Cheery', emoji: '🍒',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Potato', emoji: '🥔',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Eggplant', emoji: '🍆',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Corn', emoji: '🌽',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Grapes', emoji: '🍇',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Banana', emoji: '🍌',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Coconut', emoji: '🥥',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Mushroom', emoji: '🍄',
    coinValue: getRandomValue(1000, 5000)
  },
  {
    name: 'Pineapple', emoji: '🍍',
    coinValue: getRandomValue(1000, 5000)
  },
];

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function onCall({ message, args, data }) {
  const { Users } = global.controllers;

  try {
    const targetID = message.senderID;
    let totalAmount = 0;
    let harvestedProduce = [];

    for (let i = 0; i < 3; i++) {
      const randomProduce = plantSpecies[Math.floor(Math.random() * plantSpecies.length)];

      const name = randomProduce.name;
      const emoji = randomProduce.emoji;
      const coin = randomProduce.coinValue;

      totalAmount += coin;

      harvestedProduce.push({
        name: `${emoji} ${name}`,
        coin: ` ${coin.toLocaleString()} coins`
      });
    }

    let replyMessage = `〘𝗬𝗼𝘂 𝗵𝗮𝘃𝗲 𝗵𝗮𝗿𝘃𝗲𝘀𝘁𝗲𝗱 🗑〙\n`;
    for (let i = 0; i < harvestedProduce.length; i++) {
      replyMessage += `✓ ${harvestedProduce[i].name}: ${harvestedProduce[i].coin}\n`;
    }

    replyMessage += `Total earned: ${totalAmount.toLocaleString()} coins 💰`;

    message.reply(replyMessage);

    await Users.increaseMoney(targetID, totalAmount);

  } catch (error) {
    console.error(error);
    message.reply('An error occurred while harvesting!');
  }
}

export default {
  config,
  onCall,
};
