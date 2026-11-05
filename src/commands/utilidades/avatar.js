const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    // --- CONFIGURAÇÃO DO SLASH COMMAND ---
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Mostra a foto de perfil de um usuário")
        .addUserOption((option) =>
            option
                .setName("usuario")
                .setDescription("O usuário que você quer ver o avatar")
                .setRequired(false),
        ),

    // --- CONFIGURAÇÃO DO COMANDO POR PREFIXO ---
    name: "avatar",
    aliases: ["av", "foto"],

    // --- EXECUÇÃO DO SLASH COMMAND (/avatar) ---
    async executeSlash(interaction, client) {
        const usuario =
            interaction.options.getUser("usuario") || interaction.user;

        const avatarURL = usuario.displayAvatarURL({
            dynamic: true,
            size: 4096,
        });

        const avatarEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Avatar de ${usuario.username}`)
            .setURL(avatarURL)
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setImage(avatarURL)
            .setTimestamp();

        await interaction.reply({ embeds: [avatarEmbed] });
    },

    // --- EXECUÇÃO DO COMANDO POR PREFIXO (?avatar) ---
    async executePrefix(message, args, client) {
        const usuario = message.mentions.users.first() || message.author;

        const avatarURL = usuario.displayAvatarURL({
            dynamic: true,
            size: 4096,
        });

        const avatarEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Avatar de ${usuario.username}`)
            .setURL(avatarURL)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setImage(avatarURL)
            .setTimestamp();

        await message.channel.send({ embeds: [avatarEmbed] });
    },
};
