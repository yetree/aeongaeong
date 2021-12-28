const { MessageEmbed } = require("discord.js");
const i18n = require("../util/i18n");

module.exports = {
  name: "gal",
  aliases: ["g"],
  description: i18n.__("help.description"),
  async execute(message,args) {
    let commands = message.client.commands.array();

    let galEmbed = new MessageEmbed()
      .setTitle(i18n.__("gal.embedTitle"))
      .setDescription(i18n.__("gal.embedDescription"))
      .setColor("#F8AA2A");
    const context = args.join(" ");
    galEmbed.addField(       
      "\u200b",
      `**${context}**`,
      true
    );
    

    galEmbed.setTimestamp();

    return message.channel.send(galEmbed).catch(console.error);
  }
};
