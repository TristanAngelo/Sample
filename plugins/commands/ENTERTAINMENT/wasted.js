const config = {
  name: "wasted",
  description: "wasted image creator",
  usage: "[@mention/reply] [text]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "XaviaTeam"
}

const langData = {
  "vi_VN": {
    "error": "Có lỗi xảy ra, vui lòng thử lại sau"
  },
  "en_US": {
    "error": "An error occurred, please try again later"
  },
  "ar_SY": {
    "error": "لقد حدث خطأ، رجاء أعد المحاولة لاحقا"
  }
}

async function onCall({ message, getLang }) {
  try {
    const { mentions, messageReply, senderID } = message;
    const targetID = Object.keys(mentions)[0] || messageReply?.senderID || senderID;

    const avatarURL = global.getAvatarURL(targetID);

    const wanted = await global.getStream(`https://sakibin.sinha-apiv2.repl.co/api/maker/wasted?url=${encodeURIComponent(avatarURL)}&apikey=SAKIBIN-FREE-SY6B4X`);

    return message.reply({
      attachment: wanted
    });

  } catch (e) {
    console.error(e);
    return message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall
}
