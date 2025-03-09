require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); 


const db = mysql.createConnection({
  host: "localhost", 
  user: "root",
  password: "TU_CONTRASEÑA",
  database: "solutoria",
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.post("/guardarUF", (req, res) => {
  const { codigoIndicador,nombreIndicador, unidadMedidaIndicador, valorIndicador, fechaIndicador, origenIndicador  } = req.body;
  const checkSql = "SELECT * FROM uf WHERE fechaIndicador = ?";
  db.query(checkSql, [fechaIndicador], (err, results) => {
    if (err) {
      console.error("Error verificando datos:", err);
      res.status(500).send("Error verificando datos");
      return;
    }



    if (results.length > 0) {
      res.status(200).send("Ese dato ya existe, omitido");
    } else {
      const insertSql = "INSERT INTO uf (codigoIndicador,nombreIndicador, unidadMedidaIndicador, valorIndicador, fechaIndicador, origenIndicador ) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(insertSql, [codigoIndicador,nombreIndicador, unidadMedidaIndicador, valorIndicador, fechaIndicador, origenIndicador ], (err, result) => {
        if (err) {
          console.error("Error insertando datos:", err);
          res.status(500).send("Error insertando datos");
        } else {
          res.status(200).send("Dato insertado correctamente");
        }
      });
    }
  });
});



app.get("/obtenerUF", (req, res) => {
  const sql = "SELECT * FROM uf ORDER BY fechaIndicador DESC";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener datos:", err);
      res.status(500).send("Error al obtener datos");
    } else {
      res.json(results);
    }
  });
});


app.put("/actualizarUF/:id", (req, res) => {
  const { id } = req.params;
  const { codigoIndicador, nombreIndicador, unidadMedidaIndicador, valorIndicador, fechaIndicador, origenIndicador } = req.body;

  const updateSql = `
    UPDATE uf 
    SET codigoIndicador = ?, nombreIndicador = ?, unidadMedidaIndicador = ?, valorIndicador = ?, origenIndicador = ?
    WHERE fechaIndicador = ?
  `;

  db.query(updateSql, [codigoIndicador, nombreIndicador, unidadMedidaIndicador, valorIndicador, origenIndicador, fechaIndicador], (err, result) => {
    if (err) {
      console.error("Error al actualizar:", err);
      res.status(500).send("Error al actualizar");
    } else {
      if (result.affectedRows > 0) {
        res.send("Dato actualizado correctamente");
      } else {
        res.status(404).send("No se encontró un registro con esa fecha");
      }
    }
  });
});



app.delete("/eliminarUF/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM uf WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar:", err);
      res.status(500).send("Error al eliminar");
    } else {
      res.send("Dato eliminado correctamente");
    }
  });
});
