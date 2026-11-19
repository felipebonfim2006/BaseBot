import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    // Configuração do Slash Command (Estrutura enviada para a API do Discord)
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Retorna o tempo de resposta."),

    // Configurações do comando por prefixo (Nome principal, aliases e descrição)
    name: "ping",
    aliases: ["latencia", "p"],
    description: "Retorna o tempo de resposta.",

    // Função executada quando o comando é acionado via Slash Command (/)
    async executeSlash(interaction, client) {
        // Cria o embed visual contendo a latência atual do bot (websocket ping)
        const pingEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Pong! 🏓`)
            .setDescription(`Latência: **${client.ws.ping}ms**`)
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        // Responde à interação do usuário enviando o embed criado
        await interaction.reply({ embeds: [pingEmbed] });
    },

    // Função executada quando o comando é acionado via Prefixo (ex: !ping)
    async executePrefix(message, args, client) {
        // Cria o embed visual contendo a latência atual do bot (websocket ping)
        const pingEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Pong! 🏓`)
            .setDescription(`Latência: **${client.ws.ping}ms**`)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        // Envia o embed diretamente no canal de texto onde o comando foi digitado
        await message.channel.send({ embeds: [pingEmbed] });
    },
};
