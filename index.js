// Dependencias e configuracoes
const { Client, GatewayIntentBits } = require("discord.js");
const { token } = require("./src/configs/config.json");

// Criacao da instancia do bot/client com os intents corretos
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// Manipulacao de comandos e eventos
["Events", "Commands"].forEach((handler) => {
    try {
        require(`./src/handlers/${handler}.js`)(client);
    } catch (err) {
        console.error(`Erro ao carregar ${handler}:`, err.message);
    }
});

// Conexao com o bot
client.login(token);
