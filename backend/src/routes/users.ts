import express from 'express';

import {
  signUp,
  signIn,
  isUserAuthenticated,
  signOut,
} from '../controllers/users';

const router = express.Router();

router.get('/', isUserAuthenticated);

router.post('/sign-up', signUp);

router.post('/sign-in', signIn);

router.post('/sign-out', signOut);

export default router;
