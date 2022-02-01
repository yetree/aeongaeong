const { MessageEmbed } = require("discord.js");
const i18n = require("../util/i18n");

module.exports = {
  name: "gal",
  aliases: ["g"],
  description: i18n.__("gal.description"),
  async execute(message, args) {
    //'gal'만 입력시 안내 문구 출력
    if (!args.length) {
        return message
	    .reply(i18n.__mf("gal.howToUse"))
	    .catch(console.error);
    }
    
    var context = args.join(" "); //공백 허용
    var referContext = "";
    if (context.indexOf("(") != -1 && context.indexOf(")") != -1 && context.indexOf("(") < context.indexOf(")")) {
        referContext = context.substring(context.indexOf("(") + 1, context.indexOf(")"));
	context = context.substring(0, context.indexOf("("));
    }
    
    let galEmbed = new MessageEmbed()
      .setTitle(i18n.__mf("gal.embedTitle", {context: context}))  //공지 타이틀
      .setDescription(i18n.__mf("gal.embedDescription", {referContext: referContext}))  //공지 설명
      .setColor("#F8AA2A");

    galEmbed.setTimestamp(); //입력 시간 출력

    try {
        message.channel.send(i18n.__("gal.player")); //ko.json에 저장된 유저 멘션
        galMessage = await message.channel.send(galEmbed);
	//emoji 반응 추가
	await message.delete();
        await galMessage.react("<:ri:925626746500431923>");
        await galMessage.react("<:gyo:925677426955145246>");
        await galMessage.react("<:chang:925626874242170931>");
        await galMessage.react("<:moo:925626784815398983>");
        await galMessage.react("<:pu:925677200240422922>");
        await galMessage.react("<:al:925626851613872128>");
        await galMessage.react("<:tte:925626722873909308>");
        await galMessage.react("<:pi:925626916642390046>");
        await galMessage.react("<:seb:925626816247496775>");
        await galMessage.react("<:rin:925627280515022848>");
    } catch (error) {
        console.error(error);
    }
    return;
  }
};
