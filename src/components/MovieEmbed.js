const { MessageEmbed } = require("discord.js");

const movieEmbed = (args) => {
  const { title, color, info, image, footer, footerIcon, link } = args;
  return (
    new MessageEmbed()
      // Set the title of the field
      .setTitle(title)
      // Set the color of the embed
      .setColor(color)
      // Set the main content of the embed
      .setDescription(info)
      .setImage(image)
      .setFooter(footer, footerIcon)
      .setURL(link)
  );
};
module.exports = { movieEmbed };
