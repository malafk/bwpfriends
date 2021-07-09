require('dotenv').config()
const mineflayer = require('mineflayer');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);
const ChatMessage = require('prismarine-chat')('1.8')
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');


let app = express();

let config = require('./config.json');

let friendsIgnColor = []
let friendsIgn = []

// made by mal (run at your own risk..)

const bot = mineflayer.createBot({
        host: "bedwarspractice.club",
        port: 25565,
        username: process.env.EMAIL,
        password: process.env.PASSWORD,
        version: "1.8.8"
})


bindEvents(bot);

let friendsAmount = 0;
let yes;
let i = 0;

function bindEvents() {

    app.listen('3000', () => {
        console.log("listening on 3000")
    })

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.get('/', (req, res) => {
        res.render("index", {
            friendsIgn: friendsIgn,
            friendsIgnColor: friendsIgnColor
        });
    })

    navigatePlugin(bot);

    const joinedPlayers = []

    bot.on('message', (msg) => {

        if(msg.text.includes("You have received a friend request from ")) {
            let username = msg.text.replace(/[§&][0-9A-z]/g, "").split(" ").pop()
            bot.chat('/f ' + username);
        }

        if(msg.text.includes("Listing all friends")) {
            friendsAmount = msg.toString().replace("Listing all friends (", "").replace("):", "");
            yes = true;
            setInterval(() => {
                yes = false;
                i = 0;
                friendsIgn = [];
                friendsIgnColor = [];
            }, 29950)
        }
        if(yes === true) {
            if(msg.text.includes(" is currently in a game") || msg.text.includes(" is currently online") || msg.text.includes(" is currently offline")) {
                i++;
                let friendIgnColor = msg.text.replace(" is currently in a game").replace(" is currently online").replace(" is currently offline").replace("undefined", "")
                let friendIgn = msg.text.replace(" is currently in a game").replace(" is currently online").replace(" is currently offline").replace(/§[A-z]|§[1-9]/g, "").replace("undefined", "")
                friendsIgn.push(friendIgn);
                friendsIgnColor.push(friendIgnColor);
            }
        }
        if(msg.toString() === "You are now in limbo! The server you were connecting/connected to is down. Do /reconnect to join back!") {
            bot.chat("/reconnect")
        }
        console.log(msg.toString())
    });

    bot.on('spawn', () => {
        joinedPlayers.length = 0;
        bot.chat('/server') // debug
    })

    setInterval(() => {
	    console.log("Switching server.");
            bot.chat("/server bwp-lobby-" + randomInteger(0, config.lobbysamount))
    }, 150000)

    setInterval(() => {
        console.log("[ANTI-AFK] Moving")
        bot.navigate.to(bot.entity.position.offset(5,0,0))
    }, 30000)

    setInterval(() => {
        const next = joinedPlayers.pop()
        if (next) {
            if (joinedPlayers.includes(next.username)) return;
            bot.chat('/f add ' + next.username);
        }
    }, 2500)


    setInterval(() => {
        bot.chat("/f list")
    }, 30000)


    bot.on('playerJoined', (player) => {
        if (player.username === bot.username) return
        joinedPlayers.push(player)
    })

    bot.on('kicked', (reason, loggedIn) => {
        console.log(reason, loggedIn)
    })

    bot.on('error', err => console.log(err))

    function randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}