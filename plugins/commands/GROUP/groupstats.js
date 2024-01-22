import path from 'path';

export const config = {
  name: "groupstats",
  version: "1.1.0",
  credits: "August Quinn (Modified by Grim)",
  description: "Get information about the current group chat.",
  usage: "",
  cooldown: 5
};

export async function onCall({ message, data }) {
  const { threadID } = message;
  const { imageSrc } = data.thread?.info || {};
  if (!imageSrc) return; // doesn't exists in the database
  const imagePath = path.join(global.cachePath, `${message.threadID}_${Date.now()}_timg.jpg`);
  try {
    if (isURL(imageSrc)) {
       await downloadFile(imagePath, imageSrc);
    } else {
       await saveFromBase64(imagePath, imageSrc);
    }
    const threadInfo = await global.api.getThreadInfo(threadID);
    const threadName = threadInfo.threadName || "Unnamed Thread";
    const threadType = threadInfo.isGroup ? "Group" : "Personal Chat";
    const participantCount = threadInfo.participantIDs.length;

    const groupID = threadInfo.isGroup ? `\n  ⦿ 𝗚𝗿𝗼𝘂𝗽 𝗜𝗗: ${threadID}` : "";
    const groupStatus = threadInfo.isGroup ? `\n  ⦿ 𝗚𝗿𝗼𝘂𝗽 𝗦𝘁𝗮𝘁𝘂𝘀: ${threadInfo.approvalMode ? "Approval Mode On" : "Approval Mode Off"}${threadInfo.restrictions ? `\n  ⦿ 𝗚𝗿𝗼𝘂𝗽 𝗜𝘀𝘀𝘂𝗲𝘀: ${threadInfo.restrictions}` : ""}` : "";

    const adminIDs = threadInfo.adminIDs || [];
    const nicknames = await Promise.all(threadInfo.participantIDs.map(async (userID) => {
      const userInfo = await global.api.getUserInfo(userID);
      return `  • ${userInfo[userID].name}\n  — ${userID}\n❍────────────❍`;
    }));

    const infoMessage = `👾 Hello ${threadName}\n\nℹ️ ${threadName}'s Information\n\n  ⦿ 𝗡𝗔𝗠𝗘: ${threadName}\n  ⦿ 𝗧𝗬𝗣𝗘: ${threadType}${groupID}${groupStatus}\n  ⦿ 𝗣𝗔𝗥𝗧𝗜𝗖𝗜𝗣𝗔𝗡𝗧𝗦: ${participantCount}\n  ⦿ 𝗣𝗔𝗥𝗧𝗜𝗖𝗜𝗣𝗔𝗡𝗧𝗦 𝗟𝗜𝗦𝗧:\n❍────────────❍\n ${nicknames.join("\n")}`;

    await message.reply({
      body: infoMessage,
      attachment: reader(imagePath)});
  } catch (error) {
    console.error("Error fetching thread information:", error);
    message.reply("❎ Error fetching thread information. Please try again later.");
  } finally {
     if (isExists(imagePath, "file")) {
         deleteFile(imagePath);
     }
  }
};