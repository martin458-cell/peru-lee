import express from "express";
import path from "path";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database path configuration
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const fichasFilePath = path.join(dataDir, "fichas.json");
  const evaluationsFilePath = path.join(dataDir, "evaluations.json");

  // Helper functions to read/write JSON files
  const readDatabase = (filePath: string): any[] => {
    try {
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
        return [];
      }
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error(`Error reading database file: ${filePath}`, e);
      return [];
    }
  };

  const writeDatabase = (filePath: string, data: any[]) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error(`Error writing database file: ${filePath}`, e);
    }
  };

  // Pre-populate with a sample Ficha if empty to make it look active!
  const prepopulateIfEmpty = () => {
    const fichas = readDatabase(fichasFilePath);
    if (fichas.length === 0) {
      const sampleFicha = {
        id: "sample-f1-1",
        category: "C",
        ieName: "I.E.P.M. N° 24009 Túpac Amaru II",
        ieModular: "0361493",
        ieDre: "Ayacucho",
        ieUgel: "UGEL Lucanas",
        ieGestion: "Pública EBR",
        ieRegion: "Ayacucho",
        ieProvincia: "Lucanas",
        ieDistrito: "Puquio",
        ieDireccion: "Jr. Andamarca S/N",
        workTitle: "El Vuelo de los Cóndores y Paco Yunque: Una mirada de justicia",
        workLang: "Castellano",
        workLink: "https://drive.google.com/file/d/1exampleLINK/view",
        docName: "Mendoza Quispe, Gladis Elena",
        docDni: "10245678",
        docSpec: "Educación Primaria",
        docCell: "966123456",
        docEmail: "gladis.mendoza@ie24009.edu.pe",
        students: [
          {
            fullname: "Cahuana Huamán, Juan Carlos",
            dni: "71234567",
            age: "11 años",
            grade: "5.to Grado de Primaria",
            section: "B",
            parentName: "Cahuana Quispe, Pedro",
            parentDni: "10443322",
            parentRel: "Padre"
          },
          {
            fullname: "Gutiérrez Quispe, Milagros Sofía",
            dni: "72345678",
            age: "11 años",
            grade: "5.to Grado de Primaria",
            section: "B",
            parentName: "Quispe Sulca, María",
            parentDni: "10554433",
            parentRel: "Madre"
          },
          {
            fullname: "Rojas Mendoza, Kevin Brayan",
            dni: "73456789",
            age: "11 años",
            grade: "6.to Grado de Primaria",
            section: "A",
            parentName: "Rojas Medina, Jorge",
            parentDni: "10665544",
            parentRel: "Padre"
          }
        ],
        createdAt: new Date().toISOString()
      };
      writeDatabase(fichasFilePath, [sampleFicha]);
    }

    const evals = readDatabase(evaluationsFilePath);
    if (evals.length === 0) {
      const sampleEval = {
        id: "sample-ev-1",
        studentName: "Cahuana, Milagros, Kevin (Equipo C)",
        category: "C5",
        scores: [4, 3, 3, 4, 3, 3, 4, 3, 3],
        desafioScores: [4, 3],
        totalProductRaw: 30,
        maxProductRaw: 36,
        finalScorePercent: 86.11,
        level: "LOGRO ESPERADO",
        createdAt: new Date().toISOString()
      };
      writeDatabase(evaluationsFilePath, [sampleEval]);
    }
  };

  prepopulateIfEmpty();

  // API Routes
  // 1. Fichas endpoints
  app.get("/api/fichas", (req, res) => {
    const fichas = readDatabase(fichasFilePath);
    res.json(fichas);
  });

  app.post("/api/fichas", (req, res) => {
    const fichas = readDatabase(fichasFilePath);
    const incoming = req.body || {};
    const id = incoming.id;
    
    if (id) {
      const idx = fichas.findIndex((f) => f.id === id);
      if (idx !== -1) {
        // Update existing
        fichas[idx] = {
          ...fichas[idx],
          ...incoming,
          updatedAt: new Date().toISOString()
        };
        writeDatabase(fichasFilePath, fichas);
        return res.json(fichas[idx]);
      }
    }

    const newFicha = {
      id: id || "f1-" + Date.now(),
      ...incoming,
      createdAt: incoming.createdAt || new Date().toISOString()
    };
    fichas.unshift(newFicha); // Add to beginning
    writeDatabase(fichasFilePath, fichas);
    res.status(201).json(newFicha);
  });

  app.delete("/api/fichas/:id", (req, res) => {
    const { id } = req.params;
    let fichas = readDatabase(fichasFilePath);
    const initialLength = fichas.length;
    fichas = fichas.filter((f) => f.id !== id);
    if (fichas.length < initialLength) {
      writeDatabase(fichasFilePath, fichas);
      res.json({ success: true, message: "Ficha eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Ficha no encontrada" });
    }
  });

  // 2. Evaluations endpoints
  app.get("/api/evaluations", (req, res) => {
    const evals = readDatabase(evaluationsFilePath);
    res.json(evals);
  });

  app.post("/api/evaluations", (req, res) => {
    const evals = readDatabase(evaluationsFilePath);
    const incoming = req.body || {};
    const id = incoming.id;

    if (id) {
      const idx = evals.findIndex((e) => e.id === id);
      if (idx !== -1) {
        // Update existing
        evals[idx] = {
          ...evals[idx],
          ...incoming,
          updatedAt: new Date().toISOString()
        };
        writeDatabase(evaluationsFilePath, evals);
        return res.json(evals[idx]);
      }
    }

    const newEval = {
      id: id || "ev-" + Date.now(),
      ...incoming,
      createdAt: incoming.createdAt || new Date().toISOString()
    };
    evals.unshift(newEval); // Add to beginning
    writeDatabase(evaluationsFilePath, evals);
    res.status(201).json(newEval);
  });

  app.delete("/api/evaluations/:id", (req, res) => {
    const { id } = req.params;
    let evals = readDatabase(evaluationsFilePath);
    const initialLength = evals.length;
    evals = evals.filter((e) => e.id !== id);
    if (evals.length < initialLength) {
      writeDatabase(evaluationsFilePath, evals);
      res.json({ success: true, message: "Evaluación eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Evaluación no encontrada" });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
