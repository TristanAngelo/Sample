import axios from "axios";

export const config = {
  name: "gpa",
  version: "1.0",
  credits: "August Quinn (Converted by Grim)",
  description: "Calculate GPA",
  usage: "highschool [grade] | college [GPA]",
  cooldown: 5,
};

export async function onCall({ message, args, prefix }) {
  const type = args[0];
  const value = args[1];
  const reply = message.reply;

  if (!type || !value) {
    return reply(`Invalid usage! An example would be: '${prefix}gpa high school 98' or '${prefix}gpa college 1.20'`);
  }

  try {
    let response;
    let result;

    if (type.toLowerCase() === "highschool") {
      response = await axios.get(`http://gpa.august-api.repl.co/calculateHighSchoolGPA?percentage=${value}`);
      result = response.data;

      let message = `🏫 𝗛𝗜𝗚𝗛 𝗦𝗖𝗛𝗢𝗢𝗟 𝗚𝗣𝗔 𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗧𝗜𝗢𝗡\n\n`;
      message += `Percentage: ${value}%\n`;
      message += `Equivalent GPA: ${result.equivalentGPA}\n`;
      message += `Equivalent Range: ${result.equivalentRange}\n`;
      message += `Letter Equivalent: ${result.letterEquivalent}\n`;
      message += `Description: ${result.description || "No description available."}\n`;

      reply(message);
    } else if (type.toLowerCase() === "college") {
      response = await axios.get(`http://gpa.august-api.repl.co/calculateCollegeGPA?grade=${parseFloat(value)}`);
      result = response.data;

      let message = `🎓 𝗖𝗢𝗟𝗟𝗘𝗚𝗘 𝗚𝗣𝗔 𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗧𝗜𝗢𝗡\n\n`;
      message += `Provided GPA: ${value}\n`;
      message += `Average GPA: ${result.averageGPA}\n`;
      message += `Equivalent Range: ${result.equivalentRange}\n`;
      message += `Letter Equivalent: ${result.letterEquivalent}\n`;
      message += `Description: ${result.description || "No description available."}\n`;

      reply(message);
    } else {
      message.reply("Invalid GPA type! Use 'highschool' or 'college'.");
    }
  } catch (error) {
    console.error("Error:", error);
    message.reply(`Error calculating ${type === "highschool" ? "High School" : "College"} GPA`);
  }
};
