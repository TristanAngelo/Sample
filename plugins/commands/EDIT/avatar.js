export const config = {
  name: 'genavatar',
  aliases: ['generateavatar'],
  version: '1.0.0',
  credits: 'Grim',
  description: 'Generate an avatar.',
  usage: '[Text] | [Text] | [Number]',
  cooldown: 10
};

export async function onCall({ message, args, prefix }) {
  try {
    const info = args.join(' ');
    const [text1, text2, model] = info.split('|').map(item => item.trim());
    const text = args.join(" ");

    if (!text) {
      return message.reply(`❎ | Invalid usage!\nExample: ${prefix}text Sample | Sample | 2`);
    }
    if (!model)
      return message.reply("Add a model to proceed.");
    if (model > 882) return message.reply("Maximum model is only 882.");
    const apiUrl = `https://sakibin.sinha-apiv2.repl.co/taoanhdep/avatarwibu?id=${model}&chu_nen=${encodeURIComponent(text1)}&chu_ky=${encodeURIComponent(text2)}`;

    await message.react('⏳');
    await message.reply({
      body: "🖼️ | Here's Your Avatar!",
      attachment: await global.getStream(apiUrl)});
    await message.react('✅');

  } catch (error) {
    console.error(error);
    await message.reply("❎ | There's a problem with the API.");
  }
};
