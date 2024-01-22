export const config = {
  name: "changetheme",
  version: "2.0.8",
  permissions: [1, 2],
  credits: "KC/Raito",
  description: "Change theme of the group chat.",
  usage: '[theme]',
  cooldown: 5
}

export async function onCall({ message, args }) {
  const color_obj = {
    "default": "196241301102133",
    "hotpink": "169463077092846",
    "aquablue": "2442142322678320",
    "brightpurple": "234137870477637",
    "coralpink": "980963458735625",
    "orange": "175615189761153",
    "green": "2136751179887052",
    "lavenderpurple": "2058653964378557",
    "red": "2129984390566328",
    "yellow": "174636906462322",
    "tealblue": "1928399724138152",
    "aqua": "417639218648241",
    "mango": "930060997172551",
    "berry": "164535220883264",
    "citrus": "370940413392601"
  }

  const response = args.join(" ")
  const { threadID } = message

  if (response === "list") {
    const themeList = Object.keys(color_obj).join('\n- ');
    message.reply(`Available themes:\n- ${themeList}`);
    return;
  }

  for (let color in color_obj) {
    if (color === response) {
      var colorname = color_obj[color];
    }
  }

  if (colorname != undefined) {
    global.api.changeThreadColor(colorname, threadID, (err) => {
      if (err) return console.error(err);
    });
  }
}
