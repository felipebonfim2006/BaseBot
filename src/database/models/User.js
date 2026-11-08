const { Schema, model } = require("mongoose");

// Estrutura do documento de usuário
const userSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    pings: { type: Number, default: 0 },
    registadoEm: { type: Date, default: Date.now },
});

// Exporta o modelo User
module.exports = model("User", userSchema);
