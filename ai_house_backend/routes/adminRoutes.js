const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/authMiddleware');


// 1. DASHBOARD & ANALYTICS


// Récupère les compteurs globaux (Students, Profs, etc.) 
router.get('/stats', auth, isAdmin, adminCtrl.getAdminStats);

// Récupère les derniers workshops créés pour le flux d'activité 
router.get('/activity', auth, isAdmin, adminCtrl.getRecentActivity);

// Données pour les graphiques par département 
router.get('/analytics', auth, isAdmin, adminCtrl.getAnalyticsData);



// 2. WORKSHOP VALIDATION (Flux d'approbation)


// Liste des workshops en attente 'Pending' 
router.get('/pending', auth, isAdmin, adminCtrl.getPendingWorkshops);

// Action d'Approuver ou Refuser un workshop 
router.patch('/validate', auth, isAdmin, adminCtrl.validateWorkshop);


 
// 3. MANAGEMENT (Workshops & Utilisateurs)
 

// Liste complète pour Workshop Management (avec taux de remplissage) 
router.get('/workshops', auth, isAdmin, adminCtrl.getAllWorkshops);

// Liste des utilisateurs filtrée par rôle (Student ou Professor)
router.get('/users', auth, isAdmin, adminCtrl.getUsersByRole);



// 4. REPORTS, MESSAGES & CALENDAR


// Récupère tous les messages de support/plaintes 
router.get('/reports', auth, isAdmin, adminCtrl.getAllReports);

// Marque un rapport comme résolu
router.patch('/reports/:reportId/resolve', auth, isAdmin, adminCtrl.markReportResolved);

// Récupère tous les messages du formulaire de contact
router.get('/contacts', auth, isAdmin, adminCtrl.getAllContactMessages);

// Marque un message de contact comme lu
router.patch('/contacts/:messageId/read', auth, isAdmin, adminCtrl.markContactMessageRead);

// Récupère les workshops formatés pour la vue Calendrier 
router.get('/calendar', auth, isAdmin, adminCtrl.getCalendarWorkshops);

// 5. CERTIFICATE MANAGEMENT


// Liste des workshops terminés pour affichage
router.get('/certificates/completed', auth, isAdmin, adminCtrl.getCompletedWorkshops);

// Action pour déclencher l'envoi 
router.post('/certificates/send/:workshopId', auth, isAdmin, adminCtrl.sendCertificates);


// 6. NAVIGATION & SESSION 
// URL: /api/admin/logout
router.post('/logout', auth, adminCtrl.logout);

module.exports = router;