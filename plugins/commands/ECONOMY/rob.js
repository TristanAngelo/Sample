import path from 'path';

const config = {
  name: "rob",
  aliases: ["steal"],
  credits: "Grim",
  description: "Attempt to rob another user with a 50% success rate.",
  usage: "[on/off] | <mention>",
  cooldown: 50, // Adjust the cooldown as needed
};

const langData = {
  "en_US": {
    "missingMention": "⚠ | You need to mention a user to rob.",
    "notEnoughMoney": "❎ | You don't have enough money to pay the penalty if you fail!",
    "robSuccess": "💰 | You successfully robbed {name} and received {amount} coins.",
    "robFailure": "👮 | You were caught by the police, and ₱{penalty} will be deducted from your money as a penalty.",
    "noMoney": "💵 | The target user doesn't have any money to rob.",
    "afkUser": "🚫 | You can't rob users who are AFK.",
    "dataNotReady": "⚠ | Thread data is not ready.",
    "robCommandAlreadyEnabled": "✅ | The rob command is already enabled.",
    "robCommandEnabled": "✅ | Successfully enabled the rob command.",
    "robCommandAlreadyDisabled": "⚠️ | The rob command is already disabled.",
    "robCommandDisabled": "✅ | Successfully disabled the rob command.",
    "insufficientPermissionsEnable": "🚫 | You don't have enough permissions to enable the rob command.",
    "insufficientPermissionsDisable": "🚫 | You don't have enough permissions to disable the rob command.",
    "robCommandDisabledThread": "❌ | The rob command is currently disabled in this thread.",
  },
};

const arrest = path.join(global.assetsPath, "simpsonarrest.gif");

let isReady = false;

async function onLoad() {
  global.downloadFile(arrest, "https://i.imgur.com/AyCcFDR.gif")
    .then(_ => {
      isReady = true;
    })
}

async function onCall({ message, args, extra, getLang, data, userPermissions }) {
  if (!isReady) return message.reply(getLang("dataNotReady"));

  const { mentions, senderID, reply } = message;
  const { Users } = global.controllers;

  const thread = data?.thread;
  if (!thread) return message.reply(getLang("dataNotReady"));

  const threadData = thread.data || {};
  const isAllowed = threadData?.rob === true;
  const input = args[0]?.toLowerCase();
  const isInputQuery = input == "on" || input == "off";

  const isGroupAdmin = userPermissions.some(e => e == 0 || e == 1);

  if (isGroupAdmin && isInputQuery) {
    if (input == "on") {
      if (isAllowed) return message.reply(getLang("robCommandAlreadyEnabled"));

      await global.controllers.Threads.updateData(message.threadID, { rob: true });
      return message.reply(getLang("robCommandEnabled"));
    } else {
      if (!isAllowed) return message.reply(getLang("robCommandAlreadyDisabled"));

      await global.controllers.Threads.updateData(message.threadID, { rob: false });
      return message.reply(getLang("robCommandDisabled"));
    }
  } else if (!isGroupAdmin && isInputQuery) {
    if (input == "on") return message.reply(getLang("insufficientPermissionsEnable"));
    else return message.reply(getLang("insufficientPermissionsDisable"));
  }

  if (!isAllowed) {
    return message.reply(getLang("robCommandDisabledThread"));
  }

  if (Object.keys(mentions).length === 0) {
    return reply(getLang("missingMention"));
  }

  const targetID = Object.keys(mentions)[0];

  const senderMoney = await Users.getMoney(senderID);
  const targetMoney = await Users.getMoney(targetID);

  if (senderMoney === null || senderMoney < 1) {
    return reply(getLang("notEnoughMoney"));
  }

  if (targetMoney === null || targetMoney < 1) {
    return reply(getLang("noMoney"));
  }

  const targetUserData = await Users.getData(targetID);

  if (targetUserData && targetUserData.afk && targetUserData.afk.status) {
    return reply(getLang("afkUser"));
  }

  const success = Math.random() < 0.6;

  if (success) {
    const amountRobbed = Math.floor(targetMoney * 0.5);
    await Users.decreaseMoney(targetID, amountRobbed);
    await Users.increaseMoney(senderID, amountRobbed);
    return reply(getLang("robSuccess", { name: mentions[targetID].replace(/@/g, ""), amount: amountRobbed }));
  } else {
    const penaltyPercentage = 0.5;
    const penalty = Math.floor(senderMoney * penaltyPercentage);
    await Users.decreaseMoney(senderID, penalty);
    return reply({
      body: getLang("robFailure", { penalty }),
      attachment: global.reader(arrest)
    });
  }
}

export default {
  config,
  langData,
  onCall,
  onLoad
};
