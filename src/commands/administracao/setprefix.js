import {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("setprefix")
        .setDescription("Altere o prefixo do bot neste servidor.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption((option) =>
            option
                .setName("novo_prefixo")
                .setDescription(
                    "O novo prefixo a ser usado (máx. 3 caracteres)",
                )
                .setRequired(true)
                .setMaxLength(3),
        ),

    name: "setprefix",
    aliases: ["prefixo", "changeprefix"],
    description: "Altera o prefixo do bot neste servidor.",
    userPermissions: [PermissionFlagsBits.ManageGuild],
};
