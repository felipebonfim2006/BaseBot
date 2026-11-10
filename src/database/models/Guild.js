const { Schema, model } = require("mongoose");
const { prefix } = require("../../configs/config.json");

const guildSchema = new Schema({
    guildId: { type: String, required: true, unique: true },
    prefix: { type: String, default: prefix }, // Prefixo padrão de segurança
    slashCommandsAtivos: { type: Boolean, default: false },
});

module.exports = model("Guild", guildSchema);
