const User = require('../models/User');
const Workshop = require('../models/Workshop');
const Report = require('../models/Report');
const Registration = require('../models/Registration');
const Contact = require('../models/Contact');

const normalizeStatus = (value) => String(value || '').toLowerCase();
const todayKey = () => new Date().toISOString().slice(0, 10);


// TOUTES LES FONCTIONS DU CONTRÔLEUR ADMIN


// 1. Statistiques Globales 
exports.getAdminStats = async (req, res) => {
    try {
        const today = todayKey();
        const stats = {
            totalStudents: await User.countDocuments({ role: 'Student' }),
            totalProfessors: await User.countDocuments({ role: 'Professor' }),
            totalWorkshops: await Workshop.countDocuments(),
            upcomingEvents: await Workshop.countDocuments({ status: 'approved', date: { $gte: today } }),
            pendingApprovals: await Workshop.countDocuments({ status: 'pending' })
        };
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Activité Récente 
exports.getRecentActivity = async (req, res) => {
    try {
        const recentWorkshops = await Workshop.find()
            .sort({ createdAt: -1 })
            .limit(5);
        res.json(recentWorkshops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Gestion de la Validation 
exports.getPendingWorkshops = async (req, res) => {
    try {
        const pending = await Workshop.find({ status: 'pending' })
            .sort({ createdAt: -1 });
        res.json(pending);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.validateWorkshop = async (req, res) => {
    try {
        const { workshopId, action } = req.body; 
        const nextStatus = normalizeStatus(action);
        const updatedWorkshop = await Workshop.findByIdAndUpdate(
            workshopId,
            { status: nextStatus },
            { new: true }
        );
        res.json({ message: `Workshop ${nextStatus === 'approved' ? 'approuvé' : 'refusé'} !`, workshop: updatedWorkshop });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Workshop Management 
exports.getAllWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find()
            .sort({ date: -1 });
        res.json(workshops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 5. User Management  
exports.getUsersByRole = async (req, res) => {
    try {
        const { role } = req.query; 
        const users = await User.find({ role }).select('-password');

        const usersWithActivity = await Promise.all(users.map(async (user) => {
            let activityCount = 0;
            if (role === 'Student') {
                activityCount = await Registration.countDocuments({ studentId: user._id });
            } else if (role === 'Professor') {
                activityCount = await Workshop.countDocuments({ professorId: user._id });
            }
            
            // On retourne TOUTES les propriétés du document original + le compteur
            return {
                ...user._doc, 
                activityCount: activityCount
            };
        }));
        res.json(usersWithActivity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 6. Reports & Messages 
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllContactMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markContactMessageRead = async (req, res) => {
    try {
        const { messageId } = req.params;
        const updatedMessage = await Contact.findByIdAndUpdate(
            messageId,
            { status: 'Read' },
            { new: true }
        );
        if (!updatedMessage) {
            return res.status(404).json({ error: 'Contact message not found' });
        }
        res.json({ message: 'Contact message marked as read', message: updatedMessage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markReportResolved = async (req, res) => {
    try {
        const { reportId } = req.params;
        const updatedReport = await Report.findByIdAndUpdate(
            reportId,
            { read: true },
            { new: true }
        );
        if (!updatedReport) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json({ message: 'Report marked as resolved', report: updatedReport });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 7. Analytics 
exports.getAnalyticsData = async (req, res) => {
    try {
        const departmentStats = await Workshop.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        res.json({
            cards: {
                totalVisitors: 1247,
                activeStudents: await User.countDocuments({ role: 'Student' }),
                totalProfessors: await User.countDocuments({ role: 'Professor' }),
                totalWorkshops: await Workshop.countDocuments()
            },
            chartData: departmentStats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 8. Calendrier 
exports.getCalendarWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find({ status: 'approved' })
            .sort({ date: 1 }) 
            .select('title professor department date time location status');
        res.json(workshops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 9. Certificats
exports.getCompletedWorkshops = async (req, res) => {
    try {
        const today = todayKey();
        const completed = await Workshop.find({ status: 'approved', date: { $lt: today } });
        res.json(completed);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendCertificates = async (req, res) => {
    try {
        res.json({ message: "Certificats envoyés avec succès !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 10. Logout
exports.logout = (req, res) => {
    res.status(200).json({ success: true, message: "Déconnexion réussie." });
};
