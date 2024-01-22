const config = {
  name: "spin",
  aliases: ["s"],
  description: "Enrichment with dignity.",
  usage: "<none>",
  cooldown: 1800,
  permissions: [0, 1, 2],
  credits: 'WaifuCat',
  extra: {}
};

async function onCall({ message, args, data }) {
  const { Users } = global.controllers;

  try {
    const targetID = message.senderID;
    const randomAmount = Math.floor(Math.random() * 100000);
    const totalAmount = randomAmount;

    let replyMessage = `🎰 𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! 𝚈𝚘𝚞 𝚠𝚘𝚗: ₱${totalAmount.toLocaleString()} 𝚌𝚊𝚜𝚑. 💰`;

    message.reply(replyMessage);

    await Users.increaseMoney(targetID, totalAmount);
  } catch (error) {
    console.error(error);
    message.reply('𝚂𝚘𝚖𝚎𝚝𝚑𝚒𝚗𝚐 𝚠𝚎𝚗𝚝 𝚠𝚛𝚘𝚗𝚐!');
  }
}

export default {
  config,
  onCall,
};