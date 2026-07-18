const { Router } = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const productRoutes = require('../modules/products/product.routes');
const categoryRoutes = require('../modules/categories/category.routes');
const behaviorRoutes = require('../modules/behavior/behavior.routes');
const adaptationRoutes = require('../modules/adaptation/adaptation.routes');
const translationRoutes = require('../modules/translation/translation.routes');
const audioRoutes = require('../modules/audio/audio.routes');
const reportingRoutes = require('../modules/reporting/reporting.routes');
const adminRoutes = require('../modules/admin/admin.routes');
const aiRoutes = require('../ai/ai.routes');
const uploadRoutes = require('../upload/upload.routes');
const chatbotRoutes = require('../modules/chatbot/chatbot.routes');
const orderRoutes = require('../modules/orders/order.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/behavior', behaviorRoutes);
router.use('/adaptation', adaptationRoutes);
router.use('/translations', translationRoutes);
router.use('/audio', audioRoutes);
router.use('/reports', reportingRoutes);
router.use('/admin', adminRoutes);
router.use('/ai', aiRoutes);
router.use('/upload', uploadRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/orders', orderRoutes);

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
