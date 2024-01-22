import axios from 'axios';

const config = {
  name: "mealsearch",
  version: "1.0.0",
  credits: "August Quinn (Converted by Grim)",
  description: "Search for meal recipes by name!",
  usages: "[meal_name]",
  cooldown: 5
};

async function onCall({ message, args }) {
  try {
    if (!args[0]) {
      message.reply("Provide the name of the meal you want to search for.");
      return;
    }

    const mealName = encodeURIComponent(args.join(" "));

    const searchURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;

    const response = await axios.get(searchURL);

    if (response.data.meals && response.data.meals.length > 0) {
      const meal = response.data.meals[0];
      const mealDetails = formatMealDetails(meal);
      message.reply(`Found a meal for '${mealName}':\n\n${mealDetails}`);
    } else {
      message.reply(`No meal found for '${mealName}'. Try a different name!`);
    }
  } catch (error) {
    console.error("Error searching for meal:", error);
    message.reply("Error searching for meal. Try again with a different name!");
  }
};

function formatMealDetails(meal) {
  let details = `  ⦿ 𝗡𝗔𝗠𝗘: ${meal.strMeal}\n  ⦿ 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗬: ${meal.strCategory}\n  ⦿ 𝗔𝗥𝗘𝗔: ${meal.strArea}\n`;
  details += `  ⦿ 𝗜𝗡𝗦𝗧𝗥𝗨𝗖𝗧𝗜𝗢𝗡𝗦: ${meal.strInstructions}\n\n  ⦿ 𝗜𝗡𝗚𝗥𝗘𝗗𝗜𝗘𝗡𝗧𝗦:\n`;

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && measure) {
      details += `    • ${ingredient} - ${measure}\n`;
    } else {
      break;
    }
  }

  return details;
}

export default {
  config,
  onCall
}