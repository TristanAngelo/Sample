const config = {
  name: "bio",
  aliases: ["setbio","changebio","tieusu"],
  description: "Bulu no chi la bard thoi deo hieu thi ko fai dung dau nhe ahhihihihiihihihi",
  usage: "",
  permissions: [2],
  cooldown: 3,
  credits: "ndt22w",
  extra: {}
};

const onCall = async ({ message, args }) => {
	 global.api.changeBio(`${args.join(" ")}`);
	  message.reply(`Changed the bot's profile to: ${args.join(" ")}`);
}
export default {
  config,
  onCall
}