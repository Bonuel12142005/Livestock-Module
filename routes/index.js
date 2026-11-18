import express from 'express';
import * as authController from '../app/controllers/authController.js';
import * as livestockController from '../app/controllers/livestockController.js';
import { isAuthenticated } from '../app/middleware/authMiddleware.js';

const router = express.Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    module: 'Livestock Management',
    timestamp: new Date().toISOString()
  });
});

// Authentication Routes
router.get('/', (req, res) => res.redirect('/livestock'));
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Main Livestock Management & Dashboard Routes
router.get('/dashboard', isAuthenticated, livestockController.dashboard);
router.get('/livestock', isAuthenticated, livestockController.dashboard);
router.post('/livestock', isAuthenticated, livestockController.store);
router.get('/livestock/api/:id', isAuthenticated, livestockController.getDetails);
router.post('/livestock/:id/update', isAuthenticated, livestockController.update);
router.post('/livestock/:id/archive', isAuthenticated, livestockController.archive);
router.get('/livestock/archived', isAuthenticated, livestockController.archivedList);
router.post('/livestock/:id/restore', isAuthenticated, livestockController.restore);

// Profile & Account Settings Routes
router.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile', {
    title: 'My Administrator Profile - KAMBAC Livestock',
    activeNav: ''
  });
});

router.get('/settings', isAuthenticated, (req, res) => {
  res.render('profile', {
    title: 'Account Settings - KAMBAC Livestock',
    activeNav: ''
  });
});

export default router;
