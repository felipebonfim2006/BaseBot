const { Events } = require("discord.js");
const { prefix } = require("../../configs/config.json");

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;

        // Separa o comando dos argumentos (ex: "!ping oi tudo bem" -> comando="ping", args=["oi", "tudo", "bem"])
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const nomeComando = args.shift().toLowerCase();

        const comando = client.prefixCommands.get(nomeComando);
        if (!comando) return;

        try {
            await comando.executePrefix(message, args, client);
        } catch (error) {
            console.error(error);
            await message.reply(
                "Houve um erro ao executar este comando por prefixo!",
            );
        }
    },
};
