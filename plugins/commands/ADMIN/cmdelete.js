import fs from 'fs';
import path from 'path';

const config = {
  name: "cmdelete",
  version: "1.0",
  credits: "Blake Cyphrus󱢏 (Converted by Grim)",//don't care if baguhin moto mwuah☺️
  description: "Delete a command by filename.",
  usage: "[filename]",
  permissions: [2],
  cooldown: 5,
};

async function onCall({ message, args, prefix }) {

  // Check if the command is invoked with the correct number of arguments
  if (args.length !== 1) {
    return message.reply(`Please use the correct format: ${prefix}cmdelete <filename>`);
  }

  const filename = args[0];

  // Construct the file path within the modules/commands directory
  const filePath = findPlugin(filename);

  // Log the file path for debugging
  console.log(`Attempting to delete: ${filePath}`);

  try {
    // Check if the file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      message.reply(`Command ${filename} has been deleted.`);
      console.log(`Deleted: ${filePath}`);
    } else {
      message.reply(`File ${filename} not found. No commands were deleted.`);
      console.log(`File not found: ${filePath}`);
    }
  } catch (error) {
    message.reply("An error occurred while deleting the command.");
    console.error(error);
  }
};

function findPlugin(filename) {
    const commandPath = path.join(process.cwd(), "plugins", "commands");

    const categories = fs
        .readdirSync(commandPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    for (const cate of categories) {
        const files = fs
            .readdirSync(path.join(commandPath, cate), { withFileTypes: true })
            .filter((dirent) => dirent.isFile())
            .map((dirent) => dirent.name);

        for (const file of files) {
            if (file == filename || file == `${filename}.js`) {
                return path.join(commandPath, cate, file);
            }
        }
    }

    return null;
}

export default {
  config,
  onCall
}