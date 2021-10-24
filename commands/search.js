const { MessageEmbed } = require("discord.js");
const YouTubeAPI = require("simple-youtube-api");
const { YOUTUBE_API_KEY } = require("../util/Util");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const i18n = require("../util/i18n");

module.exports = {
  name: "search",
  description: i18n.__("search.description"),
  async execute(message, args) {
    if (!args.length)
      return message
        .reply(i18n.__mf("search.usageReply", { prefix: message.client.prefix, name: module.exports.name }))
        .catch(console.error);
    if (message.channel.activeCollector) return message.reply(i18n.__("search.errorAlreadyCollector"));
    if (!message.member.voice.channel)
      return message.reply(i18n.__("search.errorNotChannel")).catch(console.error);

    const search = args.join(" ");

    let resultsEmbed = new MessageEmbed()
      .setTitle((i18n.__("search.resultEmbedTtile")).replace(/[^a-zA-Z0-9]/g,'_'))
      .setDescription(i18n.__mf("search.resultEmbedDesc", { search: search }))
      .setColor("#F8AA2A");

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField( `${index + 1}. ${video.title}`,video.shortURL));

      let resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        if(msg.content === 'cancel' || msg.content === 'c')
          return msg;
        const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;
        return pattern.test(msg.content);
      }

      message.channel.activeCollector = true;
      const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
      console.log(response);
      const reply = response.first().content;
      if(reply.includes("cancel")){
        message.reply('검색을 취소합니다.');
      }
      else if (reply.includes(",")) {
        let songs = reply.split(",").map((str) => str.trim());
        for (let song of songs) {
          await message.client.commands
            .get("play")
            .execute(message, [resultsEmbed.fields[parseInt(song) - 1].value, resultsEmbed.fields[parseInt]]);
        }
      } else {
        console.log(JSON.stringify(resultsEmbed));
        const choice = resultsEmbed.fields[parseInt(response.first()) - 1].value;
        message.client.commands.get("play").execute(message, [choice]);
      }

      message.channel.activeCollector = false;
      resultsMessage.delete().catch(console.error);
      response.first().delete().catch(console.error);
    } catch (error) {
      console.error(error);
      message.channel.activeCollector = false;
      message.reply(error.message).catch(console.error);
    }
  }
};
