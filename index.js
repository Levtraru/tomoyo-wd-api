const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const usuarioRoute = require("./routes/usuario");
const authRoute = require("./routes/auth");
const productoRoute = require("./routes/producto");
const changoRoute = require("./routes/chango");
const ordenRoute = require("./routes/orden");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("ConeccionDB exitosa."))
  .catch((err) => {
    console.log(err);
  });
  
  app.use(express.json());
  app.use('/api/auth', authRoute);
  app.use('/api/usuarios', usuarioRoute);
  app.use('/api/productos', productoRoute);
  app.use('/api/changos', changoRoute);
  app.use('/api/ordenes', ordenRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend on!");
});
