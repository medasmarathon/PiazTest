import express from 'express';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseApp } from '../firebase-app';

const router = express.Router();
const auth = getAuth(firebaseApp);

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    await signOut(auth);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

export default router;