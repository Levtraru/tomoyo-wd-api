const router = require("express").Router();
const Usuario = require("../models/Usuario");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTRO
router.post("/registro", async (req, res) => {
  const nuevoUsuario = new Usuario({
    nombreusuario: req.body.nombreusuario,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      nombreusuario: req.body.nombreusuario,
    });
    !usuario && res.status(401).json("Usuario incorrecto!");

    const hashedPassword = CryptoJS.AES.decrypt(
      usuario.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json("Contraseña incorrecta!");

    const tokenAcceso = jwt.sign(
      {
        id: usuario._id,
        esAdmin: usuario.esAdmin,
      },
      process.env.JWT_SEC,
      {expiresIn:"3d"}
    );

    const { password, ...otros } = usuario._doc;

    res.status(200).json({...otros, tokenAcceso});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
