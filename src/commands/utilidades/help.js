import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    // Configuração do Slash Command (Estrutura enviada para a API do Discord)
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Retorna com o menu de ajuda."),

    // Configurações do comando por prefixo (Nome principal, aliases e descrição)
    name: "help",
    aliases: ["ajuda", "h"],
    description: "Retorna com o menu de ajuda.",

    // Função executada quando o comando é acionado via Slash Command (/)
    async executeSlash(interaction, client) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("📖 Menu de ajuda")
            .setDescription(
                `Olá ${interaction.user}! Este é o nosso menu de ajuda.\nPara usar um comando...`,
            );
        await interaction.reply({ embeds: [helpEmbed] });
    },

    async executePrefix(message, args, client) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("📖 Menu de ajuda")
            .setDescription(
                `Olá ${message.author}! Este é o nosso menu de ajuda.\nPara usar um comando...`,
            );

        await message.channel.send({ embeds: [helpEmbed] });
    },
};
