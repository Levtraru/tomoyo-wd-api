const Chango = require("../models/Chango");
const {
  verificarToken,
  verificarTokenYAuth,
  verificarTokenYAdmin,
} = require("./verificarToken");

const router = require("express").Router();

//CREAR CHANGO
router.post("/", verificarToken, async (req, res) => {
  const changoNuevo = new Chango(req.body);
  try {
    const changoGuardado = await changoNuevo.save();
    res.status(200).json(changoGuardado);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ACTUALIZAR CHANGO
router.put("/:id", verificarTokenYAuth, async (req, res) => {
  try {
    const changoActualizado = await Chango.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(changoActualizado);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ELIMINAR CHANGO
router.delete("/:id", verificarTokenYAuth, async (req, res) => {
  try {
    await Chango.findByIdAndDelete(req.params.id);
    res.status(200).json("El chango ha sido eliminado");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USUARIO-CHANGO
router.get("/buscar/:userId", verificarTokenYAuth, async (req, res) => {
  try {
    const chango = await Chango.findOne({ userId: req.params.userId });
    res.status(200).json(chango);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TODOS LOS CHANGOS
router.get("/", verificarTokenYAdmin, async (req, res) => {
  try {
    const changos = await Chango.find();
    res.status(200).json(changos);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
