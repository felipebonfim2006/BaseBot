const { Events } = require("discord.js");
const { prefix } = require("../../configs/config.json");

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        // Detecta o bot mencionado no início da mensagem
        const prefixMention = new RegExp(`^<@!?${client.user.id}>\\s*`);

        let usadoPrefix = false;
        let conteudoParaProcessar = "";

        // Verifica se a mensagem usa o prefixo tradicional ou a menção
        if (message.content.startsWith(prefix)) {
            conteudoParaProcessar = message.content.slice(prefix.length).trim();
            usadoPrefix = true;
        } else if (message.content.match(prefixMention)) {
            conteudoParaProcessar = message.content
                .replace(prefixMention, "")
                .trim();
            usadoPrefix = true;
        }

        // Ignora mensagens sem prefixo e sem menção
        if (!usadoPrefix) return;

        // Responde quando apenas o prefixo ou a menção é enviado
        if (!conteudoParaProcessar) {
            return message.reply(
                `Olá, ${message.author}! Meu painel de ajuda pode ser acessado digitando \`/help\` ou \`${prefix}help\`.`,
            );
        }

        // Separa o comando dos argumentos
        const args = conteudoParaProcessar.split(/ +/);
        const nomeComando = args.shift().toLowerCase();

        const comando = client.prefixCommands.get(nomeComando);
        if (!comando) return;

        try {
            // Executa o comando por prefixo
            await comando.executePrefix(message, args, client);
        } catch (error) {
            console.error(error);
            await message.reply(
                "Houve um erro ao executar este comando por prefixo!",
            );
        }
    },
};
