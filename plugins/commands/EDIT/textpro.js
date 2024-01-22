export const config = {
  name: 'textpro',
  aliases: ['text'],
  version: '1.0.0',
  credits: 'Grim',
  description: 'Edit your text using TextPro.',
  usage: '[Text] | [Number]',
  cooldown: 10
};

export async function onCall({ message, args, prefix }) {
  try {
    const info = args.join(' ');
    const [prompt, model] = info.split('|').map(item => item.trim());
    const text = args.join(" ");
    
    if (!text) {
      return message.reply(`❎ | Invalid usage!\nExample: ${prefix}text Sample | 2`);
    }
    const apiUrl = `https://sakibin.sinha-apiv2.repl.co/api/textpro?number=${model}&text=${encodeURIComponent(prompt)}&apikey=SAKIBIN-FREE-SY6B4X`;

    await message.react('⏳');
    await message.reply({
      body: "🖼️ | Here's Your Text!",
      attachment: await global.getStream(apiUrl)});
    await message.react('✅');
    
  } catch (error) {
    console.error(error);
    await message.reply("❎ | There's a problem with the API.");
  }
};
