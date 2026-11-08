const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../database/models/User");

module.exports = {
    // Slash Command
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription(
            "Responde com Pong, a latência e salva no banco de dados!",
        ),

    // Comando por prefixo
    name: "ping",
    aliases: ["latencia", "p"],
    description: "Retorna o tempo de resposta.",

    async executeSlash(interaction, client) {
        const discordId = interaction.user.id;

        // Cria o perfil ou incrementa o contador de pings
        let userProfile = await User.findOne({ userId: discordId });

        if (!userProfile) {
            userProfile = new User({ userId: discordId, pings: 1 });
        } else {
            userProfile.pings += 1;
        }

        await userProfile.save();

        const pingEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Pong! 🏓`)
            .setDescription(`Latência: **${client.ws.ping}ms**`)
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({
                text: `Já usaste este comando ${userProfile.pings} vez(es)!`,
            })
            .setTimestamp();

        await interaction.reply({ embeds: [pingEmbed] });
    },

    async executePrefix(message, args, client) {
        const discordId = message.author.id;

        // Cria o perfil ou incrementa o contador de pings
        let userProfile = await User.findOne({ userId: discordId });

        if (!userProfile) {
            userProfile = new User({ userId: discordId, pings: 1 });
        } else {
            userProfile.pings += 1;
        }

        await userProfile.save();

        const pingEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Pong! 🏓`)
            .setDescription(`Latência: **${client.ws.ping}ms**`)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setFooter({
                text: `Já usaste este comando ${userProfile.pings} vez(es)!`,
            })
            .setTimestamp();

        await message.channel.send({ embeds: [pingEmbed] });
    },
};
