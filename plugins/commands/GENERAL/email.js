import axios from 'axios';

export const config = {
  name: "email",
  version: "1.0.0",
  credits: "EASY-API",
  description: "Send a message through email.",
  cooldown: 5,
};

export async function onCall({ args, message, prefix }) {
  if (args.length < 2) {
    message.reply(`Usage: ${prefix}email <receiver_email> <email_text>`);
    return;
  }

  const receiverEmail = args[0];
  const emailText = args.slice(1).join(" ");

  try {
    const response = await axios.post('https://api.easy0.repl.co/v1/email-send', {
      receiver: receiverEmail,
      text: emailText,
    });

    console.log('Email sent:', response.data);
    message.reply('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error.message);
    message.reply('Error sending email. Please try again later.');
  }
};