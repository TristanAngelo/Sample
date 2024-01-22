export const config = {
  name: 'moonwall',
  aliases: ['moonwallpaper'],
  version: '1.0.0',
  credits: 'Grim (API by Milan)',
  description: 'Generate moon wallpaper with your birthdate.',
  usage: '[Name] | [Day] | [Month] | [Year]',
  cooldown: 10
};

export async function onCall({ message, args, prefix }) {
  try {
    const info = args.join(' ');
    const [name, day, month, year] = info.split('|').map(item => item.trim());
    const text = args.join(" ");

    if (!text) {
      return message.reply(`❎ | Invalid usage!\nExample: ${prefix}moonwall Sample | 2 | 8 | 2002`);
    }
    const apiUrl = `https://milanbhandari.imageapi.repl.co/moonwall?name=${encodeURIComponent(name)}&day=${encodeURIComponent(day)}&month=${encodeURIComponent(month)}&year=${encodeURIComponent(year)}`;

    await message.react('⏳');
    await message.reply({
      body: `🌙 Image Generated\n🔰 Name: ${name}\n📆 Day: ${day}\n🗓️ Month: ${month}\n🎆 Year: ${year}`,
      attachment: await global.getStream(apiUrl)});
    await message.react('✅');

  } catch (error) {
    console.error(error);
    await message.reply("❎ | There's a problem with the API.");
  }
};
