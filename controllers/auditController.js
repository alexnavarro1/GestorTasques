const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, action, userId, startDate, endDate } = req.query;
    
    const query = {};
    if (action) query.action = action;
    if (userId) query.userId = userId;
    if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query)
        .sort({ timestamp: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .populate('userId', 'name email');

    const count = await AuditLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: count,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

exports.getAuditLogById = async (req, res, next) => {
    try {
        const log = await AuditLog.findById(req.params.id).populate('userId', 'name email');
         if (!log) return res.status(404).json({success: false, error: 'Registre no trobat'});
         
         res.status(200).json({
             success: true,
             data: log
         });
    } catch (error) {
        next(error);
    }
};

exports.getUserAuditLogs = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const logs = await AuditLog.getByUser(userId);
        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        next(error);
    }
};

exports.getAuditStats = async (req, res, next) => {
    try {
        const stats = await AuditLog.getStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};
