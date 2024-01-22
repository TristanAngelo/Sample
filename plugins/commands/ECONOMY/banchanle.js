import axios from 'axios';

const config = {
  name: "even-odd",
  aliases: ["eo"],
  description: "Play even-odd with multiplayer.",
  usage: "Use it then you'll know.",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Sies",

}

const { api } = global;
async function onCall({ message, args, getLang, extra, data, userPermissions, prefix }) {
  // Do something
  try {
    const { senderID, threadID, messageID, body, send, reply, react } = message;
    const { Users } = global.controllers
    global.chanle || (global.chanle = new Map);
    var bcl = global.chanle.get(message.threadID);
    const anhbcl = (await axios.get("https://i.imgur.com/u7jZ2Js.jpg", {
      responseType: "stream"
    })).data;
    switch (args[0]) {
      case "create":
      case "new":
      case "-c": {
        if (!args[1] || isNaN(args[1])) return global.api.sendMessage("[SIES-WARN ⚠] » 𝚈𝚘𝚞 𝚗𝚎𝚎𝚍 𝚝𝚘 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚛𝚎𝚜𝚎𝚛𝚟𝚊𝚝𝚒𝚘𝚗 𝚊𝚖𝚘𝚞𝚗𝚝!", message.threadID, message.messageID);
        if (parseInt(args[1]) < 500) return global.api.sendMessage("[SIES-WARN ⚠] » 𝙰𝚖𝚘𝚞𝚗𝚝 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚐𝚛𝚎𝚊𝚝𝚎𝚛 𝚝𝚑𝚊𝚗 𝚘𝚛 𝚎𝚚𝚞𝚊𝚕 𝚝𝚘 ₱𝟻𝟶𝟶!", message.threadID, message.messageID);
        const userMoney = await Users.getMoney(message.senderID) || null;
        if (userMoney < parseInt(args[1])) return global.api.sendMessage(`[SIES-WARN ⚠] » 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 ${args[1]} 𝚝𝚘 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚗𝚎𝚠 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎!`, message.threadID, message.messageID);
        if (global.chanle.has(message.threadID)) return global.api.sendMessage("[SIES-WARN ⚠] » 𝚃𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙 𝚑𝚊𝚜 𝚘𝚙𝚎𝚗𝚎𝚍 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎!", message.threadID, message.messageID);
        const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
        return global.chanle.set(message.threadID, {
          box: message.threadID,
          start: !1,
          author: message.senderID,
          player: [{
            name: name,
            userID: message.senderID,
            choose: {
              status: !1,
              msg: null
            }
          }],
          money: parseInt(args[1])
        }), global.api.sendMessage("[SIES-NOTI] » 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚌𝚛𝚎𝚊𝚝𝚎𝚍 𝚙𝚊𝚛𝚝𝚢 𝚛𝚘𝚘𝚖 𝚠𝚒𝚝𝚑 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝: " + args[1], message.threadID)
      }
      case "join":
      case "-j": {
        if (!global.chanle.has(message.threadID)) return global.api.sendMessage("[SIES-WARN ⚠] » 𝚃𝚑𝚎𝚛𝚎 𝚊𝚛𝚎 𝚌𝚞𝚛𝚛𝚎𝚗𝚝𝚕𝚢 𝚗𝚘 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎𝚜 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙!\n=> 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚗𝚎𝚠 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎 𝚝𝚘 𝚓𝚘𝚒𝚗!", message.threadID, message.messageID);
        if (1 == bcl.start) return global.api.sendMessage("[SIES-WARN ⚠] » 𝚃𝚑𝚒𝚜 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎 𝚑𝚊𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚜𝚝𝚊𝚛𝚝𝚎𝚍!", message.threadID, message.messageID);
        const playerMoney = await Users.getMoney(message.senderID) || null;
        if (playerMoney < bcl.money) return global.api.sendMessage(`[SIES-WARN ⚠] » 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚓𝚘𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎! ₱${bcl.money}`, message.threadID, message.messageID);
        const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
        if (bcl.player.find((player) => player.userID == message.senderID)) return global.api.sendMessage("𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚗𝚘𝚠 𝚓𝚘𝚒𝚗𝚎𝚍 𝚝𝚑𝚒𝚜 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎!", message.threadID, message.messageID);
        return bcl.player.push({
          name: name,
          userID: message.senderID,
          choose: {
            stats: !1,
            msg: null
          }
        }), global.chanle.set(message.threadID, bcl), global.api.sendMessage(`[ SIES-NOTI ] » 𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚓𝚘𝚒𝚗𝚎𝚍 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎!\n=> 𝚃𝚑𝚎 𝚌𝚞𝚛𝚛𝚎𝚗𝚝 𝚗𝚞𝚖𝚋𝚎𝚛 𝚘𝚏 𝚖𝚎𝚖𝚋𝚎𝚛𝚜 𝚒𝚜: ${bcl.player.length}`, message.threadID, message.messageID)
      }
      case "start":
      case "-s":
        return bcl ? bcl.author != message.senderID ? global.api.sendMessage("[SIES-WARN ⚠] » 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚝𝚑𝚎 𝚌𝚛𝚎𝚊𝚝𝚘𝚛 𝚘𝚏 𝚝𝚑𝚒𝚜 𝚐𝚊𝚖𝚎 𝚋𝚘𝚊𝚛𝚍, 𝚜𝚘 𝚢𝚘𝚞 𝚌𝚊𝚗𝚗𝚘𝚝 𝚜𝚝𝚊𝚛𝚝 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.", message.threadID, message.messageID) : bcl.player.length <= 1 ? global.api.sendMessage("[SIES-WARN ⚠] » 𝚈𝚘𝚞𝚛 𝚐𝚊𝚖𝚎 𝚋𝚘𝚊𝚛𝚍 𝚍𝚘𝚎𝚜𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚎𝚖𝚋𝚎𝚛𝚜 𝚝𝚘 𝚐𝚎𝚝 𝚜𝚝𝚊𝚛𝚝𝚎𝚍!", message.threadID, message.messageID) : 1 == bcl.start ? global.api.sendMessage("[SIES-WARN ⚠] » 𝚃𝚑𝚒𝚜 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎 𝚑𝚊𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚜𝚝𝚊𝚛𝚝𝚎𝚍!", message.threadID, message.messageID) : (bcl.start = !0, global.chanle.set(message.threadID, bcl), global.api.sendMessage(`[SIES-NOTI ] » 𝙶𝚊𝚖𝚎 𝚜𝚝𝚊𝚛𝚝\n\n𝙽𝚞𝚖𝚋𝚎𝚛 𝚘𝚏 𝚖𝚎𝚖𝚋𝚎𝚛𝚜: ${bcl.player.length}\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚑𝚊𝚝 "Even" 𝚘𝚛 "Odd" `, message.threadID)) : global.api.sendMessage("[SIES-WARN ⚠] » 𝚃𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙 𝚍𝚘𝚎𝚜 𝚗𝚘𝚝 𝚑𝚊𝚟𝚎 𝚊𝚗𝚢 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎𝚜 𝚢𝚎𝚝!\n=> 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚗𝚎𝚠 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎 𝚝𝚘 𝚓𝚘𝚒𝚗!", message.threadID, message.messageID);
      case "end":
      case "-e":
        return bcl ? bcl.author != message.senderID ? global.api.sendMessage("[SIES-WARN ⚠] » 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚝𝚑𝚎 𝚌𝚛𝚎𝚊𝚝𝚘𝚛 𝚘𝚏 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎, 𝚜𝚘 𝚢𝚘𝚞 𝚌𝚊𝚗𝚗𝚘𝚝 𝚍𝚎𝚕𝚎𝚝𝚎 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎.", message.threadID, message.messageID) : (global.chanle.delete(message.threadID), global.api.sendMessage("[ SIES-NOTI ] » 𝙳𝚎𝚕𝚎𝚝𝚎𝚍 𝚐𝚊𝚖𝚎 𝚋𝚘𝚊𝚛𝚍!", message.threadID, message.messageID)) : global.api.sendMessage("[SIES-WARN ⚠] » 𝚃𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙 𝚍𝚘𝚎𝚜 𝚗𝚘𝚝 𝚑𝚊𝚟𝚎 𝚊𝚗𝚢 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎𝚜 𝚢𝚎𝚝!\n=> 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚗𝚎𝚠 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎 𝚝𝚘 𝚓𝚘𝚒𝚗!", message.threadID, message.messageID);
      case "leave":
      case "-l":
        if (!global.chanle.has(message.threadID)) return api.sendMessage('[SIES-WARN ⚠] » 𝙲𝚞𝚛𝚛𝚎𝚗𝚝𝚕𝚢 𝚝𝚑𝚎𝚛𝚎 𝚊𝚛𝚎 𝚗𝚘 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎𝚜 𝚏𝚘𝚛 𝚢𝚘𝚞 𝚝𝚘 𝚕𝚎𝚊𝚟𝚎!', message.threadID, message.messageID);
        if (!bcl.player.find((player) => player.userID == message.senderID)) return api.sendMessage('[SIES-WARN ⚠] » 𝚈𝚘𝚞 𝚍𝚘𝚗’𝚝 𝚑𝚊𝚟𝚎 𝚊𝚗𝚢 𝚐𝚊𝚖𝚎𝚜 𝚕𝚎𝚏𝚝!', threadID, messageID);
        if (bcl.start == true) return api.sendMessage('[SIES-WARN ⚠] » 𝚈𝚘𝚞 𝚍𝚒𝚍𝚗’𝚝 𝚜𝚎𝚎 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎 𝚍𝚒𝚜𝚊𝚙𝚙𝚎𝚊𝚛 𝚓𝚞𝚜𝚝 𝚊𝚏𝚝𝚎𝚛 𝚜𝚝𝚊𝚛𝚝𝚒𝚗𝚐!', threadID, messageID);
        if (bcl.author == message.senderID) {
          global.chanle.delete(message.threadID);
          const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
          return global.api.sendMessage('[SIES-NOTI ⚠] » ➣ <' + name + '> 𝚕𝚎𝚏𝚝 𝚝𝚑𝚎 𝚐𝚊𝚖𝚒𝚗𝚐 𝚝𝚊𝚋𝚕𝚎, 𝚝𝚑𝚎𝚒𝚛 𝚐𝚊𝚖𝚒𝚗𝚐 𝚝𝚊𝚋𝚕𝚎 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚍𝚒𝚜𝚌𝚘𝚞𝚗𝚝𝚎𝚍!', message.threadID, message.messageID);
        }
        else {
          bcl.player.splice(bcl.player.findIndex((player) => player.userID == message.senderID), 1);
          global.chanle.set(message.threadID, bcl);
          const name = (await global.controllers.Users.getInfo(message.senderID))?.name || message.senderID;
          global.api.sendMessage('[SIES-NOTI] » 𝙼𝚘𝚞𝚜𝚎 𝚏𝚊𝚕𝚕𝚜 𝚘𝚏𝚏 𝚝𝚑𝚎 𝚝𝚊𝚋𝚕𝚎!', message.threadID, message.messageID);
          return global.api.sendMessage('[ SIES-NOTI ] »➣ <' + name + '> left the gaming table!\n=> 𝚃𝚑𝚎𝚒𝚛 𝚐𝚊𝚖𝚒𝚗𝚐 𝚝𝚊𝚋𝚕𝚎 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚍𝚒𝚜𝚌𝚘𝚞𝚗𝚝𝚎𝚍.' + bcl.player.length + ' 𝙿𝚕𝚊𝚢𝚎𝚛 ', message.threadID);
        }

      default:
        return global.api.sendMessage({
          body: "==【Multiplayer Odd and Even Play】==\n1. !eo -c/create <price> => To create a room.\n2. !eo -j/join => Join to enter the room. \n3. !eo -s/start => To start the game.\n4. !eo -l/leave => To leave the game.\n5. !eo -e/end => To end the game.",
          attachment: anhbcl
        }, message.threadID, message.messageID)
    }
  } catch (e) {
    message.send("Error :", e);
    console.error(e);
  }

}


export default {
  config,
  onCall
}

// or
// export {
//     config,
//     langData,
//     onCall
// }