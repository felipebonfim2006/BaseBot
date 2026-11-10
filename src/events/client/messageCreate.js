const { Events } = require("discord.js");
const { prefix: prefixoPadrao } = require("../../configs/config.json");
const Guild = require("../../database/models/Guild"); // Importa o modelo do servidor

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        // 1. Busca o prefixo do servidor na base de dados
        let guildProfile = await Guild.findOne({ guildId: message.guild.id });

        // Se o servidor tiver um prefixo na DB, usa-o. Senão, usa o do config.json
        const prefix = guildProfile ? guildProfile.prefix : prefixoPadrao;

        // Detecta o bot mencionado no início da mensagem
        const prefixMention = new RegExp(`^<@!?${client.user.id}>\\s*`);

        let usadoPrefix = false;
        let conteudoParaProcessar = "";

        // Verifica se a mensagem usa o prefixo da base de dados ou a menção
        if (message.content.startsWith(prefix)) {
            conteudoParaProcessar = message.content.slice(prefix.length).trim();
            usadoPrefix = true;
        } else if (message.content.match(prefixMention)) {
            conteudoParaProcessar = message.content
                .replace(prefixMention, "")
                .trim();
            usadoPrefix = true;
        }

        if (!usadoPrefix) return;

        // Se o utilizador apenas mencionar o bot, responde com o prefixo atual do servidor
        if (!conteudoParaProcessar) {
            return message.reply(
                `Olá, ${message.author}! O meu prefixo neste servidor é \`${prefix}\`. Podes aceder ao meu painel de ajuda digitando \`/help\` ou \`${prefix}help\`.`,
            );
        }

        const args = conteudoParaProcessar.split(/ +/);
        const nomeComando = args.shift().toLowerCase();

        const comando =
            client.prefixCommands.get(nomeComando) ||
            client.prefixCommands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(nomeComando),
            );

        if (!comando) return;

        // Verifica se o usuario tem permissao para usar o comando
        if (comando.userPermissions && comando.userPermissions.length > 0) {
            if (!message.member.permissions.has(comando.userPermissions)) {
                return message.reply({
                    content: "❌ Não tens permissão para usar este comando.",
                });
            }
        }

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
