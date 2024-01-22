export const config = {
  name: "creategroupchat",
  aliases: ["creategc", "creategroup"],
  version: "1.0.0",
  credits: "NTKhang",
  description: "Create a new chat group with the tag.",
  usage: '[tag] | [New group name] or "me [tag] | [New group name]',
  cooldown: 300
};

export async function onCall({ message, args }) {
  if (args[0] == "me")
    var id = [message.senderID]
  else id = [];
  var main = message.body;
  var groupTitle = main.slice(main.indexOf("|") + 2)
  for (var i = 0; i < Object.keys(message.mentions).length; i++)
    id.push(Object.keys(message.mentions)[i]);
  global.api.createNewGroup(id, groupTitle, () => { message.reply(`✅ | Successfully create a new group chat named ${groupTitle}!`) })
}