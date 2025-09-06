require('dotenv').config();
const { Telegraf } = require('telegraf');
const commands = require('./src/commands');

// Initialize bot with token from environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN must be provided in environment variables! Check .env file.');
}

// Initialize bot
const bot = new Telegraf(BOT_TOKEN);

// Error handling middleware
bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
    ctx.reply('An error occurred while processing your request. Please try again later.');
});

// Register commands
bot.command('start', commands.start);
bot.command('tournaments', commands.tournaments);
bot.command('event', commands.events);
bot.command('clear', commands.clear);
bot.command('restart', commands.restart);
bot.command('help', commands.help);
bot.command('about', commands.about);

// Handle unknown commands
bot.on('text', (ctx) => {
    if (ctx.message.text.startsWith('/')) {
        return commands.default(ctx);
    }
});

// Start the bot
bot.launch()
    .then(() => {
        console.log('Aptos_verse bot is running! 🚀');
    })
    .catch((err) => {
        console.error('Error starting bot:', err);
        process.exit(1);
    });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
