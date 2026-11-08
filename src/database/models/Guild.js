const { Schema, model } = require("mongoose");

// Estrutura do documento de servidor (guild)
const guildSchema = new Schema({
    guildId: { type: String, required: true, unique: true },
    prefix: { type: String, required: true },
    registadoEm: { type: Date, default: Date.now },
});

// Exporta o modelo Guild
module.exports = model("Guild", guildSchema);
