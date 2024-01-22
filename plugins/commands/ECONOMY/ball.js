import crypto from "crypto";

const config = {
  name: "shoot",
  aliases: ["ballshoot", "ballshot"],
  description: "Shoot a ball and try your luck to win or lose.",
  usage: "[bet]",
  credits: "Rue",
  cooldown: 15,
  extra: {
    minbet: 100, // The minimum bet amount
  },
};

const langData = {
  "en_US": {
    "ballshoot.not_enough_money": "𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚒𝚜 𝚋𝚎𝚝.",
    "ballshoot.min_bet": "𝚃𝚑𝚎 𝚖𝚒𝚗𝚒𝚖𝚞𝚖 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝 𝚒𝚜 ₱{minBet}. 🪙",
    "ballshoot.result_win": "𝚈𝚘𝚞 𝚜𝚑𝚘𝚝 𝚝𝚑𝚎 🏀 𝚒𝚗𝚝𝚘 𝚝𝚑𝚎 𝚑𝚘𝚘𝚙 𝚊𝚗𝚍 𝚠𝚘𝚗 ₱{bet}! 🪙",
    "ballshoot.result_lose": "𝚈𝚘𝚞 𝚖𝚒𝚜𝚜𝚎𝚍 𝚝𝚑𝚎 𝚜𝚑𝚘𝚝 𝚊𝚗𝚍 𝚕𝚘𝚜𝚝 ₱{bet}. 💸",
    "any.error": "𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗."
    // add more messages here as needed
  },
  // add translations for other languages here
};

async function onCall({ message, args, extra, getLang }) {
  const { Users } = global.controllers;

  const bet = BigInt(args[0] || extra.minbet);

  try {
    const userMoney = await Users.getMoney(message.senderID) || null;
    if (userMoney === null) {
      return message.reply(getLang("any.error"));
    }
    if (BigInt(userMoney) < bet) {
      return message.reply(getLang("ballshoot.not_enough_money"));
    }
    if (bet < BigInt(extra.minbet)) {
      return message.reply(getLang("ballshoot.min_bet", { minBet: extra.minbet }));
    }

    await Users.decreaseMoney(message.senderID, bet);

    // Generate a cryptographically secure random number in the range [0, 99]
    const luck = crypto.randomInt(100);

    if (luck < 50) { // 50% chance of winning
      const winnings = bet * BigInt(2);
      await Users.increaseMoney(message.senderID, winnings);
      return message.reply(getLang("ballshoot.result_win", { bet: winnings }));
    } else {
      return message.reply(getLang("ballshoot.result_lose", { bet }));
    }
  } catch (error) {
    console.error(error);
    return message.reply(getLang("any.error"));
  }
}

export default {
  config,
  langData,
  onCall,
};
