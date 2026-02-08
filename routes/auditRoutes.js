const express = require('express');
const router = express.Router();
const {
    getAuditLogs,
    getAuditLogById,
    getUserAuditLogs,
    getAuditStats
} = require('../controllers/auditController');
const { protect } = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

router.use(protect);

router.get('/', checkPermission('audit:read'), getAuditLogs);
router.get('/stats', checkPermission('audit:read'), getAuditStats);
router.get('/:id', checkPermission('audit:read'), getAuditLogById);
router.get('/user/:userId', checkPermission('audit:read'), getUserAuditLogs);

module.exports = router;
