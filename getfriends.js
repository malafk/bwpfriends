const mineflayer = require('mineflayer');
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');



let app = express();

let config = require('./config.json');

// made by mal (run at your own risk..)

const bot = mineflayer.createBot({
    host: config.ip,
    port: config.port,
    username: config.email,
    password: config.password,
    version: "1.8.8"
});

let friendsIgnColor = []
let friendsIgn = []

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

    // bot.on('message', (msg) => {
    //     if(msg.text.includes("Listing all friends")) {
    //         friendsAmount = msg.toString().replace("Listing all friends (", "").replace("):", "");
    //         yes = true;
    //         console.log("yea")
    //         setInterval(() => {
    //             yes = false;
    //             i = 0;
    //             friendsIgn = [];
    //             friendsIgnColor = [];
    //         }, 25000)
    //     }
    //     if(yes === true) {
    //         if(msg.text.includes(" is currently in a game") || msg.text.includes(" is currently online") || msg.text.includes(" is currently offline")) {
    //             i++;
    //             let friendIgnColor = msg.text.replace(" is currently in a game").replace(" is currently online").replace(" is currently offline").replace("undefined", "")
    //             let friendIgn = msg.text.replace(" is currently in a game").replace(" is currently online").replace(" is currently offline").replace(/§[A-z]|§[1-9]/g, "").replace("undefined", "")
    //             friendsIgn.push(friendIgn);
    //             friendsIgnColor.push(friendIgnColor);
    //         }
    //     }
    // });

    bot.on('message', (msg) => {
        if(msg.text.includes("Listing all friends")) {
            friendsAmount = msg.toString().replace("Listing all friends (", "").replace("):", "");
            yes = true;
            console.log("yea")
            setInterval(() => {
                yes = false;
                i = 0;
                friendsIgn = [];
                f = [];
            }, 25000)
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
    });

    setInterval(() => {
        bot.chat("/f list")
    }, 30000)

    bot.on('spawn', () => {
        bot.chat('/server play-12')
        bot.chat("/f list")
    })

    bot.on('kicked', (reason, loggedIn) => {
        console.log(reason, loggedIn)
    })
    bot.on('error', err => console.log(err))
}