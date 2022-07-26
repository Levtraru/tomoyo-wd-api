const Usuario = require("../models/Usuario");
const {
  verificarToken,
  verificarTokenYAuth,
  verificarTokenYAdmin,
} = require("./verificarToken");

const router = require("express").Router();

//ACTUALIZAR NOMBREUSUARIO
router.put("/:id", verificarTokenYAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(usuarioActualizado);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ELIMINAR USUARIO
router.delete("/:id", verificarTokenYAuth, async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.status(200).json("El usuario ha sido eliminado");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USUARIO
router.get("/buscar/:id", verificarTokenYAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    const { password, ...otros } = usuario._doc;

    res.status(200).json(otros);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TODOS LOS USUARIOS
router.get("/", verificarTokenYAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const usuarios = query
      ? await Usuario.find().sort({ _id: -1 }).limit(5)
      : await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET STATS USUARIOS
router.get("/stats", verificarTokenYAdmin, async (req, res) => {
  const fecha = new Date();
  const ultimoYear = new Date(fecha.setFullYear(fecha.getFullYear() - 1));

  try {
    const data = await Usuario.aggregate([
      { $match: { createdAt: { $gte: ultimoYear } } },
      {
        $project: {
          mes: { $mes: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$mes",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
