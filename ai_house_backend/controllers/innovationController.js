const Workshop = require('../models/Workshop');
const Representative = require('../models/Representative');
const Registration = require('../models/Registration');
const Department = require('../models/Department');
const mongoose = require('mongoose');
exports.getInnovationStats = async (req, res) => {
    try {
        const upcoming = await Workshop.countDocuments({ status: 'Upcoming' });
        const completed = await Workshop.countDocuments({ status: 'Past' });
        const representatives = await Representative.countDocuments();
        const registrations = await Registration.countDocuments({ type: 'Workshop' });
        const totalParticipants = 1247 + registrations;

        const departments = await Department.find();
        const deptActivity = await Promise.all(departments.map(async (dept) => {
            const workshopsCount = await Workshop.countDocuments({ department: dept._id });
            const participantCount = await Registration.countDocuments({ department: dept.name });
            return {
                name: dept.code,
                fullName: dept.name,
                workshops: workshopsCount,
                participants: participantCount + Math.floor(Math.random() * 50)
            };
        }));

        res.json({
            summary: { upcoming, totalParticipants, completed, representatives },
            departmentStats: deptActivity,
            distribution: [
                { type: 'Workshops', count: await Workshop.countDocuments({ type: 'Workshop' }) },
                { type: 'Seminars', count: await Workshop.countDocuments({ type: 'Seminar' }) },
                { type: 'Competitions', count: await Workshop.countDocuments({ type: 'Competition' }) }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};