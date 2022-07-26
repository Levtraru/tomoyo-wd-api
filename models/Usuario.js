const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
  {
    nombreusuario: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    esAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usuario", UsuarioSchema);
