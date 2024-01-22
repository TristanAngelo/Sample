const config = {
  name: "admins",
  aliases: ["ads"],
  version: "1.0.1",
  description: "List, Add or remove group Admins",
  permissions: [0, 1, 2],
  cooldown: 5,
  credits: "Isai Ivanov"
};

async function onCall({ message, args, data, userPermissions }) {
  const { type, messageReply, mentions, senderID, threadID, reply } = message;
  const { Users, Threads } = global.controllers;
  const threadInfo = await Threads.getInfoAPI(threadID);
  const { adminIDs } = threadInfo;

  try {
    const isGroupAdmin = userPermissions.some(p => p == 1);
    let query = args[0]?.toLowerCase();

    switch (query) {
      case "add":
        await handleAddAdmins(message, isGroupAdmin, adminIDs, reply, mentions);
        break;

      case "remove":
      case "rm":
      case "delete":
      case "del":
        await handleRemoveAdmins(message, isGroupAdmin, adminIDs, reply, mentions);
        break;

      default:
        listAdmins(threadID, adminIDs, reply, Users);
        break;
    }
  } catch (error) {
    reply(`${error}`);
    console.log(error);
  }
}

async function handleAddAdmins(message, isGroupAdmin, adminIDs, reply, mentions) {
  if (!adminIDs.some(e => e.id == global.botID)) return reply("Bot needed to be an admin!");

  let success = [];
  if (message.type == "message_reply") {
    let userID = message.messageReply.senderID;
    if (adminIDs.some(e => e.id == userID)) return reply('This user is already an admin');
    global.api.changeAdminStatus(message.threadID, userID, true);
    success.push({
      id: userID,
      name: (await global.controllers.Users.getInfo(userID))?.name || userID
    });
  } else if (Object.keys(mentions).length > 0) {
    for (const userID in mentions) {
      global.api.changeAdminStatus(message.threadID, userID, true);
      if (adminIDs.some(e => e.id == userID)) reply(`${(await global.controllers.Users.getInfo(userID))?.name} is already an admin`);
      success.push({
        id: userID,
        name: (await global.controllers.Users.getInfo(userID))?.name || userID
      });
    }
  } else return reply("Please mention or reply to someone");

  reply({
    body: `Added ${success.map(user => user.name).join(", ")} as Admin`,
    mentions: success.map(user => ({ tag: user.name, id: user.id }))
  });
}

async function handleRemoveAdmins(message, isGroupAdmin, adminIDs, reply, mentions) {
  if (!adminIDs.some(e => e.id == global.botID)) return reply("Bot needed to be an admin!");

  let success = [];
  if (message.type == "message_reply") {
    let userID = message.messageReply.senderID;
    if (!adminIDs.some(e => e.id == userID)) return reply("This user is not an admin");
    global.api.changeAdminStatus(message.threadID, userID, false);
    success.push({
      id: userID,
      name: (await global.controllers.Users.getInfo(userID))?.name || userID
    });
  } else if (Object.keys(mentions).length > 0) {
    for (const userID in mentions) {
      global.api.changeAdminStatus(message.threadID, userID, false);
      if (adminIDs.some(e => e.id !== userID)) reply(`${(await global.controllers.Users.getInfo(userID))?.name} is not an admin`);
      success.push({
        id: userID,
        name: (await global.controllers.Users.getInfo(userID))?.name || userID
      });
    }
  } else return reply("Please mention or reply to someone");

  reply({
    body: `Removed ${success.map(user => user.name).join(", ")} from Admin`,
    mentions: success.map(user => ({ tag: user.name, id: user.id }))
  });
}

async function listAdmins(threadID, adminIDs, reply, Users) {
  const adminList = adminIDs.map(e => e.id);
  let msg = "Group Admins:\n";
  let mentions = [];

  for (let i = 0; i < adminList.length; i++) {
    const userID = adminList[i];
    const user = await Users.getInfo(userID);
    const name = user?.name || "Facebook user";

    msg += `• ${name} - ${userID}\n`;
    mentions.push({ tag: name, id: userID });
  }

  reply({
    body: msg,
    mentions
  });
}

export default {
  config,
  onCall
};
