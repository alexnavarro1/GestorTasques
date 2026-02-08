const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  resource: {
    type: String // ID del recurs afectat com a string
  },
  resourceType: {
    type: String
  },
  status: {
    type: String,
    enum: ['success', 'error'],
    required: true
  },
  changes: {
    type: Object // Quins camps van canviar i com
  },
  errorMessage: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: { createdAt: 'timestamp', updatedAt: false } // 'timestamp' serà el createdAt
});

// Mètodes estàtics
auditLogSchema.statics.log = async function(userId, action, resource, resourceType, status, changes, req, errorMessage) {
  const logData = {
    userId,
    action,
    resource,
    resourceType,
    status,
    changes,
    errorMessage
  };

  if (req) {
    logData.ipAddress = req.ip || req.connection.remoteAddress;
    logData.userAgent = req.headers['user-agent'];
  }

  return this.create(logData);
};

auditLogSchema.statics.getByUser = function(userId, limit = 20, skip = 0) {
  return this.find({ userId }).sort({ timestamp: -1 }).limit(Number(limit)).skip(Number(skip)).populate('userId', 'name email');
};

auditLogSchema.statics.getByAction = function(action, limit = 20, skip = 0) {
  return this.find({ action }).sort({ timestamp: -1 }).limit(Number(limit)).skip(Number(skip)).populate('userId', 'name email');
};

auditLogSchema.statics.getStats = async function() {
    const totalActions = await this.countDocuments();
    
    // Taxa d'èxit (aproximada)
    const successCount = await this.countDocuments({ status: 'success' });
    const successRate = totalActions > 0 ? (successCount / totalActions) * 100 : 0;
    
    // Accions més freqüents
    const topActions = await this.aggregate([
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 },
        { $project: { action: "$_id", count: 1, _id: 0 } }
    ]);

    // Usuaris més actius
    const topUsersStats = await this.aggregate([
        { $group: { _id: "$userId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 }
    ]);
    
    const User = mongoose.model('User');
    const topUsers = await Promise.all(topUsersStats.map(async (stat) => {
        const user = await User.findById(stat._id);
        return {
            userId: stat._id,
            userName: user ? user.name : 'Unknown',
            count: stat.count
        };
    }));

    // Errors recents
     const recentErrors = await this.aggregate([
        { $match: { status: 'error' } },
        { $group: { _id: { action: "$action", error: "$errorMessage" }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 3 },
         { $project: { action: "$_id.action", error: "$_id.error", count: 1, _id: 0 } }
    ]);


    return {
        totalActions,
        successRate: Math.round(successRate * 10) / 10,
        topActions,
        topUsers,
        recentErrors
    };
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
