import moment from 'moment-timezone';

export const config = {
  name: "sendmsg",
  version: "0.0.2",
  hasPermssion: 2,
  credits: "SaikiDesu",
  description: "Send message to the threads/users using ID.",
  commandCategory: "Admin",
  usages: "[user/thread] [id] [msg]",
  cooldown: 5,
  permissions: [2]
};

export async function onCall({ message, args }) {
  var gio = moment.tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");
  var msg = args.splice(2).join(" ");
  let userID = message.senderID;
  global.api.getUserInfo(parseInt(userID), (err, data) => {
    if (err) { return console.log(err) }
    var obj = Object.keys(data);
    //var firstname = data[obj].name.replace("@", "");
    var mess = {
      body: `━━━[Message from the Admin]━━━\n\n ✉️ | ${msg}\n\n━━━━━━━━━━━━\nTime: ${gio}`
    }
    // try{
    if (args[0] == 'user') {
      return global.api.sendMessage(mess, args[1]).then(
        global.api.sendMessage('✅ | Successfully sent a message to ' + args[1], message.threadID, message.messageID));
    } else {
      if (args[0] == 'thread') {
        return global.api.sendMessage(mess, args[1]).then(
          global.api.sendMessage('✅ | Successfully sent a message to' + args[1], message.threadID, message.messageID))
      }
      else return message.reply("⚠️ | Error! Please check your command!", message.threadID, message.messageID);
    }
  })
}