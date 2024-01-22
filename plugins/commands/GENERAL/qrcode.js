const config = {
	name: "qrcode",
	aliases: ["qr", "qrcode"],
	description: "Generated Qr Code",
	usage: "qrcode [text]",
	version: "1.0.0",
	cooldown: 10,
	credits: "Tphat - Xva"
}

const langData = {
    "vi_VN": {
        "Input": "Bạn chưa nhập dữ liệu",
        "err": "Có lỗi xảy ra, vui lòng thử lại sau"
    },
    "en_US": {
        "Input": "You haven't entered any text",
        "err": "An error occurred, please try again later"
    },
    "ar_SY": {
        "Input": "لم تدخل أي نص",
        "err": "لقد حدث خطأ، رجاء أعد المحاولة لاحقا"
    }
}

async function onCall({ message, args, getLang }) {
    const input = args.join(" ");
    if (input.length == 0) return message.reply(getLang("Input"));

    global
        .getStream(`https://suy.tanphatt.repl.co/qr?text=${input}`)
        .then(stream => {
            message.reply({ attachment: stream });
        })
        .catch(err => {
            console.error(err);
            message.reply(getLang("err"));
        })
}

export default {
    config,
    langData,
    onCall
}
 