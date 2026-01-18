const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const adminChatId = process.env.ADMIN_CHAT_ID;
const bot = new TelegramBot(token, { polling: true });

const INTRO = `Hey 👋
Nice meeting you at iGB!

I’m Nerya from Traffic Flow Partners, operators of:
Rollino, CasinoJoy, JettBet, PalmSlots.

We work with SEO, PPC, Email, SMS traffic.

Quick question:
What traffic source do you work with?`;

const FOLLOWUP = `Thanks! One more question:
Which GEOs do you focus on and rough monthly volume?`;

const THANKS = `Perfect 🙌
Got it. I’ll get back to you shortly with the best deal options.`;

let step = {};

bot.onText(/\/start/, (msg) => {
  const id = msg.chat.id;
  step[id] = 1;
  bot.sendMessage(id, INTRO);
});

bot.on("message", (msg) => {
  const id = msg.chat.id;
  if (!step[id] || msg.text.startsWith("/")) return;

  if (adminChatId) {
    bot.sendMessage(adminChatId, `Lead: @${msg.from.username || msg.from.first_name}\n${msg.text}`);
  }

  if (step[id] === 1) {
    step[id] = 2;
    bot.sendMessage(id, FOLLOWUP);
  } else {
    delete step[id];
    bot.sendMessage(id, THANKS);
  }
});
