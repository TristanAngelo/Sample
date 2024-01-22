const config = {
  name: "ifb",
  description: "info account Facebook",
  usage: "<fbid>",
  credits: "Xavia Team - Tphat - Duy Tuan(ndt22w) refactor // tks for Nguyen Lam (fca-zeid) for the api!",
  cooldown: 5,
};
//địt nhau liên hệ tao
const langData = {
  vi_VN: {
    result:
      "Thông tin của ID: facebook.com/{uid}\nTên người dùng: {name}\nNgày tạo tài khoản: {created_time}\nSố lượt theo dõi: {follower}",
    missingInput: "Vui lòng nhập ID tài khoản Facebook của bạn",
    notFound: "Không tìm thấy dữ liệu.",
    error: "Đã xảy ra lỗi. Xin lỗi vì sự bất tiện này.",
  },
  ar_SY: {
    result:
      "معلومات الهوية: {uid}\nاسم المستخدم: {name}\nتاريخ إنشاء الحساب: {created_time}\nتاريخ الميلاد: {birthday}\nحالة العلاقة: {relationship_status}\nعدد المتابعين: {follower}\nعلامة التحقق الزرقاء: {tichxanh}\nالدولة: {locale}, {location}",
    missingInput: "يرجى إدخال معرف حساب Facebook الخاص بك",
    notFound: "لم يتم العثور على بيانات.",
    error: "حدث خطأ. نأسف على الإزعاج.",
  },
  en_US: {
    result:
      "ID: {uid}\nUsername: {name}\nAccount Created: {created_time}\nBirthday: {birthday}\nRelationship Status: {relationship_status}\nFollowers: {follower}\nVerified: {tichxanh}\nLocation: {locale}, {location}",
    missingInput: "Please enter your Facebook account ID",
    notFound: "Data not found.",
    error: "An error occurred. We apologize for the inconvenience.",
  },
};
// API from Nguyen Lam, facebook.com/100075493308135
async function onCall({ message, args, getLang }) {
  try {
    const input = args[0]; 
    if (!input) return message.reply(getLang("missingInput"));
    const encodedInput = encodeURIComponent(input);
    const url = `https://api.zeidbot.site/facebook/ngaytaoacc?uid=${encodedInput}`;
    const res = await global.GET(url);
    const data = res?.data || {};

    if (Object.keys(data).length === 0) {
      return message.reply(getLang("notFound"));
    }

    const response = getLang("result", {
      //uid
      uid: data.uid,
      //tên fb
      name: data.name,
      //link fb địt mẹ mày
      linkfb: data.link,
      //ngày tạo acc
      created_time: data.ngaytaoacc,
      //số ng theo dõi
      follower: data.follower,

    });

    return message.reply(response);
  } catch (e) {
    console.error(e);
    return message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall,
};