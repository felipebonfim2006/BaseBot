const { Events } = require("discord.js");
const { prefix } = require("../../configs/config.json");

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        // 1. Cria a regex para verificar se o bot foi mencionado no início da mensagem
        const prefixMention = new RegExp(`^<@!?${client.user.id}>\\s*`);

        let usadoPrefix = false;
        let conteudoParaProcessar = "";

        // 2. Verifica se a mensagem começa com o prefixo tradicional ou com a menção
        if (message.content.startsWith(prefix)) {
            conteudoParaProcessar = message.content.slice(prefix.length).trim();
            usadoPrefix = true;
        } else if (message.content.match(prefixMention)) {
            conteudoParaProcessar = message.content
                .replace(prefixMention, "")
                .trim();
            usadoPrefix = true;
        }

        // Se não usou prefixo nem menção, ignora
        if (!usadoPrefix) return;

        // Se o usuário apenas mencionou o bot ou digitou só o prefixo sem comando
        if (!conteudoParaProcessar) {
            return message.reply(
                `Olá, ${message.author}! Meu painel de ajuda pode ser acessado digitando \`/help\` ou \`${prefix}help\`.`,
            );
        }

        // 3. Separa o comando dos argumentos
        const args = conteudoParaProcessar.split(/ +/);
        const nomeComando = args.shift().toLowerCase();

        const comando = client.prefixCommands.get(nomeComando);
        if (!comando) return;

        try {
            // Executa o comando passando a mensagem, os argumentos e o client
            await comando.executePrefix(message, args, client);
        } catch (error) {
            console.error(error);
            await message.reply(
                "Houve um erro ao executar este comando por prefixo!",
            );
        }
    },
};
