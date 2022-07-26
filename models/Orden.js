const mongoose = require("mongoose");

const OrdenSchema = new mongoose.Schema(
  {
    usuarioId: { type: String, required: true },
    productos: [
      {
        productoId: {
          type: String,
        },
        cantidad: {
          type: Number,
          default: 1,
        },
      },
    ],
    importe: { type: Number, required: true },
    direccion: { type: Object, required: true },
    estado: { type: String, default: "Pendiente..."},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orden", OrdenSchema);
