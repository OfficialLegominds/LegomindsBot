/* Discord Js Bot by Legominds
*	Installation: npm install --save discord.js | More docs at: https://discord.js.org
*	
*	Revision 2 | Node 6 | Discord.js v11.2
*/

//Global Variables
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
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
		message.reply("Pong!");
		console.log(`${message.author.username} ,${message.author.id}, | Used ping`);
	}
	
	//Replies with avatar
	if (command === "avatar"){
		message.reply(message.author.avatarURL);
	}
		
	//Displays stats of bot
	if (command === "stats") {
		message.channel.send(`${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
		message.channel.send(`Running Discord.js v11.2 | Node 6`);
	}
		
	//Sends invite link
	if (command === "invite"){
		message.reply("Here: <Insert bot invite link>");
	}
	
	//Sends git link
	if (command === "git"){
		message.reply("Here: https://github.com/OfficialLegominds/LegomindsBot");
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
			message.reply(`Please join a VC.`);
		}
	}
	
	//Bot leaves authors VC
	if (command === "leave"){
			if (message.member.voiceChannel) {
				message.member.voiceChannel.leave()			
				message.channel.send(`Bye!`);
				joined = false;
				playing = false;
				console.log(`Left VC : ${message.member.voiceChannel.name} in ${message.member.guild.name}`);
		}
	}
	
	//Bot voice test command | Wiill play file (Needs FFMPEG)
	if (command === "play"){
			if (playing==false&&joined==true){
			message.member.voiceChannel.join().then(connection => {
			playing=true;
			connection.playFile("./test.mp3");
		})
		}
		else {
			message.reply("I'm not in a VC");
		}}
		
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
});
