require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- 1. IMPORTATION DES ROUTES (MVC) ---
const departmentRoutes = require('./routes/departmentRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const innovationRoutes = require('./routes/innovationRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const representativeRoutes = require('./routes/representativeRoutes');
const statsRoutes = require('./routes/statsRoutes'); 
const contactRoutes = require('./routes/contactRoutes'); 
const expertRoutes = require('./routes/expertRoutes'); 
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

const app = express();

// --- 2. MIDDLEWARES ---
app.use(cors());
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));

// --- 3. UTILISATION DES ROUTES (APIs) ---

app.use('/api/users', userRoutes);         // Login, Register et Dashboard (Étudiant/Prof)
app.use('/api/admin', adminRoutes);         // <-- AJOUTÉ : Pour les stats globales Admin
app.use('/api/departments', departmentRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/innovation', innovationRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/representatives', representativeRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/contacts', contactRoutes);

// --- 4. GESTION DES ERREURS ET RACINE ---

app.get('/', (req, res) => {
    res.send("Le serveur AI House est en ligne !");
});

app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée" });
});

// --- 5. CONNEXION ET LANCEMENT ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
      console.log("Connexion à MongoDB réussie ! Structure MVC prête.");
      app.listen(5000, () => {
          console.log("Serveur en écoute sur le port 5000");
      });
  })
  .catch((err) => console.log("Erreur de connexion :", err));