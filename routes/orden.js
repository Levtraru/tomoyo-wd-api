const Orden = require("../models/Orden");
const {
  verificarToken,
  verificarTokenYAuth,
  verificarTokenYAdmin,
} = require("./verificarToken");

const router = require("express").Router();

//CREAR ORDEN
router.post("/", verificarToken, async (req, res) => {
  const ordenNueva = new Orden(req.body);
  try {
    const ordenGuardada = await ordenNueva.save();
    res.status(200).json(ordenGuardada);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ACTUALIZAR ORDEN
router.put("/:id", verificarTokenYAdmin, async (req, res) => {
  try {
    const ordenActualizada = await Orden.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(ordenActualizada);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ELIMINAR ORDEN
router.delete("/:id", verificarTokenYAdmin, async (req, res) => {
  try {
    await Orden.findByIdAndDelete(req.params.id);
    res.status(200).json("La orden ha sido eliminada");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USUARIO-ORDEN
router.get("/buscar/:userId", verificarTokenYAuth, async (req, res) => {
  try {
    const ordenes = await Orden.find({ userId: req.params.userId });
    res.status(200).json(ordenes);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TODAS LAS ORDENES
router.get("/", verificarTokenYAdmin, async (req, res) => {
  try {
    const ordenes = await Orden.find();
    res.status(200).json(ordenes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET INGRESO MENSUAL
router.get("/importe", async (req, res) => {
  const fecha = new Date();
  const ultimoMes = new Date(fecha.setMonth(fecha.getMonth() - 1));
  const anteriorMes = new Date(new Date().setMonth(ultimoMes.getMonth() - 1));

  try {
    const ingreso = await Orden.aggregate([
      { $match: { createdAt: { $gte: anteriorMes } } },
      {
        $project: {
          mes: { $mes: "$createdAt" },
          ventas: "$cantidad",
        },
      },
      {
        $group: {
          _id: "$mes",
          total: { $sum: "$ventas" },
        },
      },
    ]);
    res.status(200).json(ingreso);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
