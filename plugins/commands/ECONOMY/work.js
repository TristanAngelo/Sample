import { join } from 'path';

const _6HOURS = 6 * 60 * 60 * 1000;
const _2HOURS = 2 * 60 * 60 * 1000;
const _3HOURS = 3 * 60 * 60 * 1000;
const _1HOURS = 1 * 60 * 60 * 1000;
const _30MINUTES = 30 * 60 * 1000;

const config = {
  name: "work",
  aliases: ["wk"],
  description: "Work to earn money",
  credits: "XaviaTeam",
  extra: {
    min: 30000,
    max: 50000,
    delay: [_30MINUTES, _1HOURS, _3HOURS, _2HOURS, _6HOURS]
  }
}

const langData = {
  "en_US": {
    "work.selfNoData": "𝚈𝚘𝚞𝚛 𝚍𝚊𝚝𝚊 𝚒𝚜 𝚗𝚘𝚝 𝚛𝚎𝚊𝚍𝚢.",
    "work.alreadyWorked": "𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚠𝚘𝚛𝚔𝚎𝚍, 𝚢𝚘𝚞 𝚌𝚊𝚗 𝚠𝚘𝚛𝚔 𝚊𝚐𝚊𝚒𝚗 𝚒𝚗 {time}.",
    "work.successfullyWorked": "𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚠𝚘𝚛𝚔𝚎𝚍 𝚊𝚗𝚍 𝚎𝚊𝚛𝚗𝚎𝚍 ₱{amount}. 🪙",
    "work.failed": "𝙵𝚊𝚒𝚕𝚎𝚍!"
  }
}

async function onCall({ message, extra, getLang }) {
  const work = reader(join(global.assetsPath, 'work.png'));
  const { Users } = global.controllers;
  const { min, max, delay } = extra;
  try {
    const userData = await Users.getData(message.senderID);
    if (!userData) return message.reply(getLang("work.selfNoData"));

    if (!userData.hasOwnProperty("work") || typeof userData.work !== 'object') userData.work = { lastWorked: 0, delay: 0 };
    if (!userData.work.hasOwnProperty("lastWorked")) userData.work.lastWorked = 0;
    if (!userData.work.hasOwnProperty("delay")) userData.work.delay = 0;

    if (Date.now() - userData.work.lastWorked < userData.work.delay) return message.reply(getLang("work.alreadyWorked", { time: global.msToHMS(userData.work.delay - (Date.now() - userData.work.lastWorked)) }));

    const amount = global.random(min, max);
    await Users.increaseMoney(message.senderID, amount);

    userData.work.lastWorked = Date.now();
    userData.work.delay = delay[global.random(0, delay.length - 1)];
    await Users.updateData(message.senderID, { work: userData.work });

    message.reply({
      body: getLang("work.successfullyWorked", { amount: global.addCommas(amount) }),
      attachment: work
    });
  } catch (error) {
    console.error(error);
    message.reply(getLang("work.failed"));
  }
}


export default {
  config,
  langData,
  onCall
}
