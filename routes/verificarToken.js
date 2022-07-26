const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, usuario) => {
      if (err) return res.status(401).json("Token inválido!");
      req.usuario = usuario;
      next();
    });
  } else {
    return res.status(401).json("No estás autentificado!");
  }
};

const verificarTokenYAuth = (req, res, next) => {
  verificarToken(req, res, () => {
    if (req.usuario.id === req.params.id || req.usuario.esAdmin) {
      next();
    } else {
      res.status(403).json("Permisos insuficientes!");
    }
  });
};

const verificarTokenYAdmin = (req, res, next) => {
  verificarToken(req, res, () => {
    if (req.usuario.esAdmin) {
      next();
    } else {
      res.status(403).json("Se requieren permisos de admin!");
    }
  });
};

module.exports = { verificarToken, verificarTokenYAuth, verificarTokenYAdmin };
