const User = require('../models/User');
const Notification = require('../schemas/Notification');

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!isProvider) {
      return res.status(401).json({
        error: 'Provedor não encontrado.',
      });
    }

    const notification = await Notification.find({ user: req.userId })
      .sort({
        createdAt: 'desc',
      })
      .limit(20);

    return res.json(notification);
  }
}

module.exports = new NotificationController();
