const Producto = require("../models/Producto");
const {
  verificarToken,
  verificarTokenYAuth,
  verificarTokenYAdmin,
} = require("./verificarToken");

const router = require("express").Router();

//CREAR
router.post("/", verificarTokenYAdmin, async (req, res) => {
  const productoNuevo = new Producto(req.body);
  try {
    const productoGuardado = await productoNuevo.save();
    res.status(200).json(productoGuardado);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ACTUALIZAR PRODUCTO
router.put("/:id", verificarTokenYAdmin, async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(productoActualizado);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ELIMINAR PRODUCTO
router.delete("/:id", verificarTokenYAdmin, async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.status(200).json("El producto ha sido eliminado");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCTO
router.get("/buscar/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    res.status(200).json(producto);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {
  const qNuevo = req.query.nuevo;
  const qCategoria = req.query.categoria;
  try {
    let productos;

    if (qNuevo) {
      productos = await Producto.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategoria) {
      productos = await Producto.find({
        categorias: {
          $in: [qCategoria],
        },
      });
    } else {
      productos = await Producto.find();
    }

    res.status(200).json(productos);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
