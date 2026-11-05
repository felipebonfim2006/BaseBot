const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    // --- CONFIGURAÇÃO DO SLASH COMMAND ---
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responde com Pong e a latência!"),

    // --- CONFIGURAÇÃO DO COMANDO POR PREFIXO ---
    name: "ping", // Nome que o usuário digita após o prefixo (ex: !ping)
    aliases: ["latencia", "p"], // (Opcional) Apelidos para o comando

    // --- EXECUÇÃO DO SLASH COMMAND ---
    async executeSlash(interaction, client) {
        const pingEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Pong! 🏓`)
            .setDescription(`Latência: ${client.ws.ping}ms`)
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        await interaction.reply({ embeds: [pingEmbed] });
    },

    // --- EXECUÇÃO DO COMANDO POR PREFIXO ---
    async executePrefix(message, args, client) {
        const pingEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Pong! 🏓`)
            .setDescription(`Latência: ${client.ws.ping}ms`)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        await message.channel.send({ embeds: [pingEmbed] });
    },
};
