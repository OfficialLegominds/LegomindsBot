/* Discord Js Bot by Legominds
*	Installation: npm install --save discord.js | More docs at: https://discord.js.org
*	
*	Revision 3.0.1 | Node 6 | Discord.js v11.2
*/

//Global Variables
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const music = require('discord.js-music-v11');
var google = require('google')
var YouTube = require('youtube-node');
const GoogleImages = require('google-images');
const gimage = new GoogleImages(config.api3, config.api4);
const embed = new Discord.RichEmbed()
var prefix = config.prefix;
var playing = false;
var joined = false;

//Startup | Uses token to login.
client.login(config.token);
//Warning if there is not token (Can be removed once setup).
if (config.token === ""){
	console.log("There is no token. Please enter one in ./config.json | For more information visit: https://discord.js.org");
}

//Startup information on login.
client.on("ready", () => {
	console.log(`[Start] ${new Date()}`);
	console.log(`Bot is online, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
	client.user.setGame(`on ${client.guilds.size} servers | ${config.prefix}help`);
});

music(client);

//Will warn user of a guild change and update the bot's setGame.
client.on("guildCreate", guild => {
  //This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members.`);
  client.user.setGame(`on ${client.guilds.size} servers | ${config.prefix}help`);
});

client.on("guildDelete", guild => {
  //This event triggers when the bot is removed from a guild.
  console.log(`Removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers | ${config.prefix}help`);
});


//Main command loop
client.on("message", async message => {
		
	//Essential Non command bot stuff
	//Will not reply to other bots.
	if(message.author.bot) return;
		
	//Makes sure message has prefix
	if(message.content.indexOf(config.prefix) !== 0) return;
	
	//seperates commands for advanced commands
	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	//Non image commands
	//WIll reply with "Pong!"
	if (command === "ping") {
		message.channel.send("Pong!");
		console.log(`${message.author.username} ,${message.author.id}, | Used ping`);
	}
	
	//Replies with avatar
	if (command === "avatar"){
		const tempAvatar = args.join(" ");
		if (tempAvatar == ""){
		message.reply(message.author.avatarURL);
		}
		else message.channel.send(tempAvatar);
	}
	
	//image test
	if (command === "image"){
		const disImage = args.join(" ");
		if (disImage === "") {
			message.channel.send("Please tell me what to send");
		}
		else {
				gimage.search(disImage);
                        embed.setColor(config.botColour)
                        .setTitle(":frame_photo: Image Result")
                        .setDescription(`Result for ${disImage}:`)
                        .setImage([0].url)
                        .addField(`URL:  ${[0].url}`)
                        message.channel.send({
                            embed
                        });
			}
	}
	
	//Displays stats of bot
	if (command === "stats") {
		embed.setColor(config.botColour)		
			.setAuthor(message.author.username, message.author.avatarURL)
			.addField("Stats",`${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`)
			.addField("Version Info",`Running Discord.js v11.2 | LegomindsBot Rev ${config.version} | Node ${process.version}`)
			.setfooter(new Date)
	return message.channel.send({embed});
	}
		
	//Sends invite link
	if (command === "invite"){
		message.reply("Here: https://discordapp.com/oauth2/authorize?client_id=212563097565659136&scope=bot&permissions=0");
	}
	
	//Sends git link
	if (command === "git"){
		message.reply("Here: https://github.com/OfficialLegominds/LegomindsBot");
	}
	
	//Stops the bot
	if (command === "die"){
		if (message.author.id === "99220750648496128"){
		message.channel.send("Shutdown");
		console.log(`Shutdown Initiated: ${new Date}`);
		console.log(`Uptime ${process.uptime()}`);
		console.log (`Initiated By: ${message.author.username}, ${message.author.id}`);
		process.exit(1);
		}
		else message.channel.send(`${message.author.username}, you don't have auth`),console.log(`${message.author.username} Tried to shutdown`);
	}
	
	//Displays uptime
	if (command === "time"){
		message.channel.send(`Current uptime: ${process.uptime()}`);
	}
		
	//Restarts the bot
	if (command === "help"){
		message.channel.send(embed
			.setColor(config.botColour)
			.setAuthor(message.author.username, message.author.avatarURL)
			.addField("Main Commands", "dsadasas")
		);
	}
	
	
	//Image commands
	
	//Replies with 
	if (command === "sourpls"){
		message.channel.send("", {
			file: "./misc/Img/pepe.gif"
		});
	}
		
	//Main Voice Commands - Needs cleenup
	//Makes the bot join a VC
	if (command === "join"){
		if (message.member.voiceChannel) {
			message.member.voiceChannel.join()
			.then(connection => {
				joined = true;
				console.log(`Joined VC : ${message.member.voiceChannel.name} in ${message.member.guild.name}`);
			})
			.catch(console.log);
		} else {
			message.reply(`you need to join a voice you faggot`);
		}
	}
	
	//Bot leaves authors VC
	if (command === "leave"){
			if (message.member.voiceChannel) {
				message.member.voiceChannel.leave()			
				message.channel.send(`cya nerds`);
				joined = false;
				playing = false;
				console.log(`Left VC : ${message.member.voiceChannel.name} in ${message.member.guild.name}`);
		}
	}
	
	//meems
	if (command === "rick"){
				if (playing==false&&joined==true){
		message.member.voiceChannel.join().then(connection => {
			playing=true;
			connection.playFile("./rick.mp3");
		})
		}
		else {
			message.reply("I'm not in a vc");
	}}
	
	//Advanced commands
	
	//Changes the bots game
	if (command === "game"){
		const playGame = args.join(" ");
		//If there was no suffix, bot will reply with the current game.
		if (playGame === "") {
			message.channel.send(`Current game is: ${client.user.setGame()}`);
		}
		//Changes the bot's game to the authors suffix.
		else { 
		client.user.setGame(playGame);
		message.channel.send(`Changed game to: ${playGame}`);
		console.log(`${message.author.username} changed game to : ${playGame}`);
		}
	}
	
	//Changes the prefix / tells user what the suffix is.
	if (command === "prefix"){
		const playPrefix = args.join(" ");
		if (playPrefix === ""){
			message.channel.send(`The current prefix is: ${config.prefix}`);
		}
		else {
		config.prefix=playPrefix;
		message.channel.send(`Prefix is now: ${playPrefix}`);
		console.log(`${message.author.username} changed prefix to : ${playPrefix}`);
		}
	}
	
	//Youtube Test
	if (command === "vid"){
		const preVideo = args.join(" ");
		if (preVideo === "") {
			console.log("No URL / Search");
		}
		console.log(preVideo);
	}
	
	if (command === "youtube"){
		const youVideo = args.join(" ");
		if (youVideo === "") {
			message.channel.send("pls gib video query");
		}
		else {
			YouTube.search(youVideo, 1, function (error, result) {
				let beforeid = "nothing";
				let id = "nothing";
				if (result.items[0].id.kind === "youtube#video") {
                    beforeid = "https://www.youtube.com/watch?v="
                    id = result.items[0].id.videoId
                    } else if (result.items[0].id.kind === "youtube#playlist") {
                        beforeid = "https://www.youtube.com/playlist?list="
                         id = result.items[0].id.playlistId
                    } else if (result.items[0].id.kind === "youtube#channel") {
                        beforeid = "https://www.youtube.com/channel/"
                        id = result.items[0].id.channelId
                    } else {
						return message.channel.send(":x: Nothing found on YouTube.")
                    }
			message.channel.send(`:video_camera: ${beforeid + id}`)
			})
		}
	}
	
	//Deletes a set ammount of messages
	if (command === "purge"){
		message.channel.send("nope");
	//	const deleteCount = parseInt(args[0], 10);
	//	if(!deleteCount || deleteCount < 2 || deleteCount > 100 )
	//		return message.reply("please provide a number between 2 - 100 for the number of messages to delete.");
	//	
	//	const fetched = await message.channel.fetchMessages({count: deleteCount});
	//	message.channel.bulkDelete(fetched)
	//		.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
	}
	
	if (command === "google") {
		const googleTerm = args.join(" ")
		if (googleTerm == ""){
			message.channel.send("Tell me what to google | Example: ,google example");
		}
		google.resultsPerPage = 25
		var nextCounter = 0
		google(googleTerm, function (err, res) {
			if (err) console.error(err)
			for (var i = 0; i < res.links.length; ++i) {
                var link = res.links[i];
					embed
						.setColor(config.botColour)
						.setAuthor(message.author.username, message.author.avatarURL)
						.addField("Result:",link.href)
						return message.channel.send({embed})
							.then(function (message) {
								message.react("⬅");
								message.react("➡");
							});
            }
		})
	}
	
});
