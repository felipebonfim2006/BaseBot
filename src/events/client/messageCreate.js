import { Events } from "discord.js";
import GuildModel from "../../database/models/GuildModel.js";
import "dotenv/config";

export default {
    // Define o evento a ser escutado (Nova mensagem enviada no chat)
    name: Events.MessageCreate,

    // Função executada sempre que o evento é disparado
    async execute(message, client) {
        // Ignora mensagens enviadas por outros bots ou mensagens que não sejam em servidores (DMs)
        if (message.author.bot || !message.guild) return;

        // Obtém o ID do servidor da mensagem
        const guildId = message.guild.id;

        // Procura os dados do servidor no banco de dados
        let guildData = await GuildModel.findOne({ guildID: guildId });

        // Se não houver dados do servidor, cria um novo documento com o prefixo padrão
        if (!guildData) {
            guildData = new GuildModel({
                guildID: guildId,
                prefix: process.env.PREFIX || "?", // Define o prefixo padrão por segurança
            });
            await guildData.save();
        } else {
            // Se já houver dados do servidor, atualiza o prefixo caso esteja vazio
            if (!guildData.prefix) {
                guildData.prefix = process.env.PREFIX || "?"; // Define o prefixo padrão por segurança
            };
            await guildData.save();
        }

        // Define o prefixo fixo do bot com base no arquivo de configuração
        const prefix = guildData.prefix || process.env.PREFIX || "?"; // Define o prefixo padrão por segurança

        // Cria uma expressão regular para detetar se o bot foi mencionado no início da mensagem
        const prefixMention = new RegExp(`^<@!?${client.user.id}>\\s*`);

        let usadoPrefix = false;
        let conteudoParaProcessar = "";

        // Verifica se a mensagem começa com o prefixo ou com a menção ao bot
        if (message.content.startsWith(prefix)) {
            conteudoParaProcessar = message.content.slice(prefix.length).trim();
            usadoPrefix = true;
        } else if (message.content.match(prefixMention)) {
            conteudoParaProcessar = message.content
                .replace(prefixMention, "")
                .trim();
            usadoPrefix = true;
        }

        // Se a mensagem não usar o prefixo nem a menção, ignora
        if (!usadoPrefix) return;

        // Se o utilizador apenas mencionar o bot, responde informando o prefixo atual
        if (!conteudoParaProcessar) {
            return message.reply(
                `Olá, ${message.author}! O meu prefixo neste servidor é \`${prefix}\`. Você pode acessar o meu painel de ajuda digitando \`/help\` ou \`${prefix}help\`.`,
            );
        }

        // Separa os argumentos e identifica o nome do comando digitado
        const args = conteudoParaProcessar.split(/ +/);
        const nomeComando = args.shift().toLowerCase();

        // Procura o comando pelo nome principal ou pelos aliases na collection do client
        const comando =
            client.prefixCommands.get(nomeComando) ||
            client.prefixCommands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(nomeComando),
            );

        // Se o comando não for encontrado, encerra a execução
        if (!comando) return;

        // Verifica se o utilizador possui as permissões necessárias para usar o comando
        if (comando.userPermissions && comando.userPermissions.length > 0) {
            if (!message.member.permissions.has(comando.userPermissions)) {
                return message.reply({
                    content:
                        "Você não tem permissão para utilizar este comando.",
                });
            }
        }

        try {
            // Executa a função do comando por prefixo
            await comando.executePrefix(message, args, client);
        } catch (error) {
            console.error(error);
            await message.reply(
                "Houve um erro ao executar este comando por prefixo!",
            );
        }
    },
};
