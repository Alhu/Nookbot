// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
  const search = args.join(' ').toLowerCase();

  function returnapi() {
  return new Promise(function(resolve){
    var api = "https://animalcrossing.fandom.com/fr/api/v1/Search/List?query="+search+"&limit=1&minArticleQuality=10&batch=1&namespaces=0%2C14"
        resolve(api);
      })
};
var urlP = returnapi();
const coordsP = urlP
  .then(function(url){ return fetch(url).then(r=>r.json()) })
  .then(function(retour){
      var nomEts = retour.batches; //On récupère le nom de l'ETS
      return nomEts 
  });
var id = coordsP.then();
var tomate = "Prune";
  return message.channel.send(`${id}{tomate}`);
};

module.exports.conf = {
  guildOnly: false,
  aliases: [],
  permLevel: 'User',
  args: 1,
};

module.exports.help = {
  name: 'wikia',
  category: 'game',
  description: 'Rolls a random number between 1 and the number given',
  usage: 'wikia <char>',
  details: '<number> => Any number you wish to be the max range',
};
