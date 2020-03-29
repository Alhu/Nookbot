const Discord = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
  const search = args.join(' ').toLowerCase();
  const link = `https://duckduckgo.com/?q=%5C${escape(search)}+site%3Ahttps%3A%2F%2Fanimalcrossing.fandom.com/fr/`;

  const waitingMsg = await message.channel.send('Please wait while Nookbot counts its bells...');

  // eslint-disable-next-line consistent-return
  request(link, (err, res, html) => {
    if (err || res.statusCode !== 200) {
      console.error(err || `DuckDuckGo Error: Status Code-${res.statusCode} Status Message-${res.statusMessage}`);
	  erreur = console.error(err || `DuckDuckGo Error: Status Code-${res.statusCode} Status Message-${res.statusMessage}`);

      waitingMsg.delete();
      return client.error(message.channel, 'Error!', 'There was an error when searching for your terms!', erreurs);
    }

    const nookLink = html.match(/(?<=uddg=)[^']+/);

    if (!/%2F%2Fanimalcrossing.fandom\.com%2F/.test(nookLink)) {
      waitingMsg.delete();
      return client.error(message.channel, 'Not On The Wiki!', 'What you searched for is not on the wiki!');
    }

    request(unescape(nookLink), (err2, res2, html2) => {
      if (err2 || res2.statusCode !== 200) {
        console.error(err2 || `Wiki Error: Status Code-${res2.statusCode} Status Message-${res2.statusMessage}`);
        waitingMsg.delete();
        return client.error(message.channel, 'Error!', 'There was an error when retriving the wiki page!');
      }

      const $ = cheerio.load(html2);
      const output = $('.portable-infobox');


      let hasAPI = false;
      let gender; let personality; let image; let bio; let color;
      const name = $('h1').first().text().trim();

      const paragraphs = $('.ct-active');

      paragraphs.eq(0).find('span').each((i, elem) => {
        switch ($(elem).attr('id')) {
          case 'api-villager_name':
            hasAPI = true;
            break;
          case 'api-villager_image':
            image = $(elem).find('a').attr('href');
            break;
          case 'api-villager_gender':
            gender = $(elem).text().trim();
            break;
          case 'api-villager_personality':
            personality = $(elem).text().trim();
            break;
          default:
            break;
        }
      });

      if (hasAPI) {
        bio = paragraphs.eq(1).text();
      } else {
        const infoBox = output.find('aside').filter((i, elem) => $(elem).attr('class') === 'portable-infobox');
        if (infoBox.attr('class') === 'portable-infobox') {
          image = `https://animalcrossing.fandom.com/${infoBox.find('img', 'a').attr('src')}`;
          // eslint-disable-next-line prefer-destructuring
          gender = (infoBox.text().match(/(Mâle|Female)/) || [''])[0];
        } else {
          const src = output.find('img').first().attr("src");
          image = src;
          // eslint-disable-next-line prefer-destructuring
          gender = (output.find('.pi-data-value pi-font').eq(1).text().match(/(Mâle|Femelle)/) || [''])[0];
        }
        bio = $('meta[name=description]').attr("content");

      }

      switch (personality || gender) {
        case 'Cranky':
          color = '#ff9292';
          break;
        case 'Jock':
          color = '#6eb5ff';
          break;
        case 'Lazy':
          color = '#f8e081';
          break;
        case 'Normal':
          color = '#bdecb6';
          break;
        case 'Peppy':
          color = '#ffccf9';
          break;
        case 'Smug':
          color = '#97a2ff';
          break;
        case 'Snooty':
          color = '#d5aaff';
          break;
        case 'Grande Soeur':
          color = '#ffbd61';
          break;
        case 'Male':
          color = '#61abff';
          break;
        case 'Female':
          color = '#efb5d5';
          break;
        default:
          color = 'RANDOM';
      }

      const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTimestamp()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setTitle(name.slice(0, 256))
        .setDescription(`${bio}[\[En savoir +\]](${unescape(nookLink).slice(0, 29)}${unescape(nookLink).slice(29).replace('(', '%28').replace(')', '%29')})`.slice(0, 2048))
        .setImage(image)
        .setFooter('Depuis animalcrossing.fandom.com', client.user.displayAvatarURL());

      waitingMsg.delete();
      return message.channel.send(embed);
    });
  });
};

module.exports.conf = {
  guildOnly: false,
  aliases: ['character', 'char', 'villager', 'vil', 'item'],
  permLevel: 'User',
  args: 1,
  blockedChannels: ['538938170822230026'],
};

module.exports.help = {
  name: 'wiki',
  category: 'game',
  description: 'Gets info from the wiki on specified search',
  usage: 'wiki <search>',
};
