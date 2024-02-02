import express from 'express';

import { requiresAuth } from '../middleware/auth';
import {
  signUp,
  signIn,
  isUserAuthenticated,
  signOut,
} from '../controllers/users';

const router = express.Router();

router.get('/', requiresAuth, isUserAuthenticated);

router.post('/sign-up', signUp);

router.post('/sign-in', signIn);

router.post('/sign-out', signOut);

export default router;
