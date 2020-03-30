// eslint-disable-next-line consistent-return
module.exports.run = async (client, message, args, level, Discord) => {
  switch (args[0] && args[0].toLowerCase()) {
    case 'ile':
    case 'île':
    case 'ville':{
      if (args.length === 1) {
        return client.error(message.channel, 'Vous n\'avez pas entré de nom !', 'Merci d\'inscrire le nom de votre île.');
      }

      const name = args.slice(1).join(' ');
      if (name.length > 10) {
        return client.error(message.channel, 'Le nom n\'est pas valide.', 'Les noms d\'île ne peuvent faire plus de 10 caractères.');
      }

      client.userDB.set(message.author.id, name, 'island.islandName');

      return client.success(message.channel, 'Le nom de votre île a bien été enregistré !', `Votre île : **${name}**`);
    }
    case 'fruit':
    case 'fr':
    case 'f': {
      if (args.length === 1) {
        return client.error(message.channel, 'Vous n\'avez pas entré de fruit.', 'Merci d\'écrire un fruit.');
      }

      let fruit;
      if (/pomme(s)?/i.test(args[1])) {
        fruit = 'Pommes 🍎';
      } else if (/cerise(s)?/i.test(args[1])) {
        fruit = 'Cerises 🍒';
      } else if (/orange(s)?/i.test(args[1])) {
        fruit = 'Oranges 🍊';
      } else if (/p[eêè]che(s)?/i.test(args[1])) {
        fruit = 'Pêches 🍑';
      } else if (/poire(s)?/i.test(args[1])) {
        fruit = 'Poires 🍐';
      }

      if (!fruit) {
        return client.error(message.channel, 'Mauvais fruit !', "Le fruit natif de votre île doit être : 'Pomme', 'Peche', 'Poire', 'Cerise' ou 'Orange'.");
      }

      client.userDB.set(message.author.id, fruit, 'island.fruit');

      return client.success(message.channel, "Votre fruit a bien été enregistré !", `Fruit : **${fruit}**`);
    }
    case 'prenom':
    case 'personnage':
    case 'prénom':
    case 'pn':
    case 'nom': {
      if (args.length === 1) {
        return client.error(message.channel, 'Vous n\'avez pas entré de nom.', 'Merci d\écrire votre nom !');
      }

      // Assuming villager names ar capped to 10 characters
      const name = args.slice(1).join(' ');
      if (name.length > 10) {
        return client.error(message.channel, 'Le nom de votre personnage n\'est pas valide.', 'Les noms de personnages ne peuvent pas faire plus de 10 caractères.');
      }

      client.userDB.set(message.author.id, name, 'island.characterName');

      return client.success(message.channel, "Votre nom a bien été enregistré !", `Nom : **${name}**`);
    }
    case 'hemisphere':
    case 'hem':
    case 'hemisphère':
    case 'hemi': {
      if (args.length === 1) {
        return client.error(message.channel, 'Vous n\'avez pas entré d\'hémisphère', 'Merci d\'inscrire l\'hémisphère de votre île ("Nord" ou "Sud")');
      }

      let hemisphere;
      if (/nord?/i.test(args[1])) {
        hemisphere = 'Nord';
      } else if (/sud?/i.test(args[1])) {
        hemisphere = 'Sud';
      }

      if (!hemisphere) {
        return client.error(message.channel, 'L\'hémisphère saisi est invalide.', 'L\'hémisphère doit être "Nord" ou "Sud".');
      }

      client.userDB.set(message.author.id, hemisphere, 'island.hemisphere');

      return client.success(message.channel, 'Hémisphère enregistré !', `Hemisphère : **${hemisphere}**`);
    }
    case 'profil':
    case 'switch':
    case 'sn': {
      if (args.length === 1) {
        return client.error(message.channel, 'Vous n\'avez pas entré de nom pour votre profil', 'Merci d\inscrire un nom pour votre profil Switch.');
      }

      const name = args.slice(1).join(' ');
      if (name.length > 10) {
        return client.error(message.channel, 'Le nom saisi est invalide.', 'Les noms des profils Switch ne peuvent avoir que 10 caractères maximum.');
      }

      client.userDB.set(message.author.id, name, 'island.profileName');

      return client.success(message.channel, 'Nom de profil enregistré !', `Profil Switch : **${name}**`);
    }
    case 'code ami':
    case 'sw':
    case 'code': {
      if (args.length === 1) {
        return client.error(message.channel, 'Vous n\'avez pas entré de code ami', 'Merci d\'inscrire votre code ami.');
      }

      let code = args.slice(1).join().replace(/[\D]/g, '');

      if (code.length !== 12) {
        return client.error(message.channel, 'Le code est invalide !', 'Le code ami est composé de 12 chiffres.');
      }

      code = `SW-${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
      client.userDB.set(message.author.id, code, 'friendcode');

      return client.success(message.channel, 'Code ami enregistré !', `Code Ami: **${code}**`);
    }
    case 'remove':
    case 'delete':
    case 'rm':
    case 'del':
    case 'clear':
    case 'clr':
    case 'mod': {
      let memberID;
      if (args[0].toLowerCase() === 'mod' && level >= 2) {
        // If the mod subcommand is used, grab the next arguement as a member
        let member = message.mentions.members.first();
        if (!member) {
          if (parseInt(args[1], 10)) {
            try {
              member = await client.users.fetch(args[1]);
            } catch (err) {
              // Don't need to send a message here
            }
          }
        }

        if (!member) {
          const searchedMember = client.searchMember(args[1]);
          if (searchedMember) {
            const decision = await client.reactPrompt(message, `Would you like to moderate \`${searchedMember.user.tag}\`'s island settings?`);
            if (decision) {
              member = searchedMember;
            } else {
              message.delete().catch((err) => console.error(err));
              return client.error(message.channel, 'Island Settings Not Moderated!', 'The prompt timed out, or you selected no.');
            }
          }
        }

        if (!member) {
          return client.error(message.channel, 'Invalid Member!', 'Please mention a valid member of this server to moderate their island settings!');
        }

        memberID = member.id;
      }

      if (!memberID) {
        memberID = message.author.id;
      }
      
      if (args.length === 1) {
        return client.error(message.channel, 'No Value To Remove!', 'Please supply the value you would like to remove! (islandname/fruit/charactername/hemisphere/profilename/friendcode)');
      }
      switch (args[1].toLowerCase()) {
        case 'islandname':
        case 'island':
        case 'in':
        case 'townname':
        case 'tn':
          client.userDB.set(message.author.id, '', 'island.islandName');
          return client.success(message.channel, 'Successfully cleared the name of your island!', 'To set your island name again, use `.island islandname <name>`!');
        case 'fruit':
        case 'fr':
        case 'f':
          client.userDB.set(message.author.id, '', 'island.fruit');
          return client.success(message.channel, "Successfully cleared your island's native fruit!", "To set your island's native fruit again, use `.island fruit <fruit>`!");
        case 'charactername':
        case 'character':
        case 'charname':
        case 'cn':
        case 'villagername':
        case 'vn':
        case 'islandername':
          client.userDB.set(message.author.id, '', 'island.characterName');
          return client.success(message.channel, "Successfully cleared your character's name!", "To set your character's name again, use `.island charactername <name>`!");
        case 'hemisphere':
        case 'hem':
        case 'hm':
        case 'hemi':
          client.userDB.set(message.author.id, '', 'island.hemisphere');
          return client.success(message.channel, 'Successfully cleared the hemisphere for your island!', 'To set the hemisphere for your island again, use `.island hemisphere <hemisphere>`!');
        case 'profilename':
        case 'profile':
        case 'pn':
        case 'switchname':
        case 'sn':
          client.userDB.set(message.author.id, '', 'island.profileName');
          return client.success(message.channel, 'Successfully cleared your Switch profile name!', 'To set your Switch profile name again, use `.island profilename <name>`!');
        case 'friendcode':
        case 'fc':
        case 'code':
          if (client.userDB.has(message.author.id, 'friendcode')) {
            client.userDB.delete(message.author.id, 'friendcode');
            return client.success(message.channel, 'Successfully cleared your Switch friend code!', 'To set your Switch friend code again, use `.island friendcode <code>`!');
          }
          return client.error(message.channel, 'No Friend Code To Remove!', 'You did not have a friend code in the database. You can set it by typing \`.fc set <code>\`!');
        case 'all':
        case 'every':
          client.userDB.set(message.author.id, {
            islandName: '',
            fruit: '',
            characterName: '',
            hemisphere: '',
            profileName: '',
          }, 'island');
          return client.success(message.channel, 'Successfully cleared your Switch profile name!', 'To set your Switch profile name again, use `.island profilename <name>`!');
        default:
          return client.error(message.channel, 'Invalid Value To Remove!', 'Please supply the value you would like to remove! (islandname/fruit/charactername/hemisphere/profilename/friendcode)');
      }
    }
    default: {
      let member;
      if (args.length === 0) {
        member = message.member;
      } else {
        member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || client.searchMember(args.join(' '));
        if (!member) {
          return client.error(message.channel, 'Unknown Member!', 'Could not find a member by that name!');
        }
      }

      // Return user's island information if they have any stored
      const { friendcode, island } = client.userDB.ensure(member.id, client.config.userDBDefaults);

      const msg = [];
      if (friendcode) {
        msg.push(`Code Ami : **${friendcode}**`);
      }
      if (island.profileName) {
        msg.push(`Nom du profil Switch : **${island.profileName}**`);
      }
      if (island.characterName) {
        msg.push(`Prénom : **${island.characterName}**`);
      }
      if (island.islandName) {
        msg.push(`Île : **${island.islandName}**`);
      }
      if (island.fruit) {
        msg.push(`Fruit : **${island.fruit}**`);
      }
      if (island.hemisphere) {
        msg.push(`Hemisphère : **${island.hemisphere}**`);
      }

      if (msg.length === 0) {
        if (member.id === message.author.id) {
          return client.error(message.channel, 'No Island Information Found!', 'You have not supplied any information about your island! You can do so by running \`.island <islandname|fruit|charactername|hemisphere|profilename|friendcode> <name|fruit|hemisphere|code>\` with any of the options. Ex. \`.island fruit pears\`.');
        }
        return client.error(message.channel, 'No Island Information Found!', `${member.displayName} has not supplied any information about their island!`);
      }

      const embed = new Discord.MessageEmbed()
        .setAuthor(`${member.displayName}'s Island`, member.user.displayAvatarURL())
        .setColor('#0ba47d')
        .setDescription(`${msg.join('\n')}`);

      return message.channel.send(embed);
    }
  }
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['is'],
  permLevel: 'User',
  blockedChannels: ['538938170822230026'],
};

module.exports.help = {
  name: 'island',
  category: 'game',
  description: 'Island information display',
  usage: 'island <islandname|fruit|charactername|hemisphere|profilename|friendcode> <name|fruit|hemisphere|code>',
  details: '<islandname> => Set the name of your island.\n<fruit> => Set the fruit that is native on your island.\n<charactername> => Set the name of your character on the island.\n<hemisphere> => Set the hemisphere your island is in.\n<profilename> => Set the name of your Switch profile.\n<friendcode> => Set your Switch friendcode.',
};
