const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categorias: { type: Array },
    talle: { type: String },
    color: { type: Array },
    precio: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Producto", ProductoSchema);
