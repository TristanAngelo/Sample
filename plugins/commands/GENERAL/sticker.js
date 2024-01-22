const config = {
  name: "sticker",
  aliases: ["nhandan", "ask"],
  description: "",
  usage: "",
  cooldown: 3,
  permissions: [0],
  credits: "ndt22w",
  extra: {}
};

const onCall = async ({ message, args }) => {
  if (args[0]) {
    return message.send({ sticker: args[0] })
  }
  var check_Stick = message.messageReply.attachments[0].type
  var checkID_Stick = message.messageReply.attachments[0].ID
  if (check_Stick != "sticker") return;
  if (message.type == 'message_reply') {
    message.reply(`${checkID_Stick}`)
    console.log(check_Stick)
  }
}

export default {
  config,
  onCall
};