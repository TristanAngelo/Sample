const config = {
  name: "palindrome",
  version: "1.0.0",
  description: "Check if a word or phrase is a palindrome.",
  usage: "[text paragraph]",
  cooldown: 5
};

async function onCall({ message, args }) {

  const getUserInfo = async (api, userID) => {
    try {
      const userInfo = await global.api.getUserInfo(userID);
      return userInfo[userID].name;
    } catch (error) {
      console.error(`Error fetching user info: ${error}`);
      return "";
    }
  };

  const userName = await getUserInfo(api, message.senderID);

  if (!args[0]) {
    message.reply(`Hey ${userName}! Please provide a text paragraph to check for palindromes.`);
    return;
  }

  const text = args.join(" ").toLowerCase();
  const words = text.split(/\W+/).filter(word => word.length > 1);

  const isPalindrome = word => {
    return word === word.split('').reverse().join('');
  };

  const palindromes = words.filter(isPalindrome);

  let response = `Hey ${userName}! Here's the result:\n\n`;
  response += `𝗡𝗨𝗠𝗕𝗘𝗥 𝗢𝗙 𝗣𝗔𝗟𝗜𝗡𝗗𝗥𝗢𝗠𝗘𝗦: ${palindromes.length}\n\n`;

  if (palindromes.length > 0) {
    response += "𝗟𝗜𝗦𝗧 𝗢𝗙 𝗣𝗔𝗟𝗜𝗡𝗗𝗥𝗢𝗠𝗘𝗦\n";
    for (const palindrome of palindromes) {
      const formattedPalindrome = palindrome.charAt(0).toUpperCase() + palindrome.slice(1);
      response += `   ⌲ ${formattedPalindrome}\n`;
    }
  } else {
    response += "No palindromes found in the provided text.";
  }

  message.reply(response);
};

export default {
  config,
  onCall
}