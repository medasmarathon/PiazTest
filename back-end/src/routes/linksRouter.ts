import { Router } from 'express';
import { LinksService } from '../services/links.service';

const router = Router();
const linksService = new LinksService();

// Create a new link
router.post('/', async (req, res) => {
  try {
    const result = await linksService.createLink(req.body, req.body.userEmail);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update a link
router.put('/:id', async (req, res) => {
  try {
    const result = await linksService.updateLink(req.params.id, req.body, req.body.userEmail);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all links for a specific user
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query;
    const result = await linksService.getLinksForUser(String(userEmail));
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific link
router.get('/:id', async (req, res) => {
  try {
    const result = await linksService.getLinkById(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a link
router.delete('/:url', async (req, res) => {
  try {
    const result = await linksService.deleteLinkByUrl(req.params.url);
    if (result === null) {
      res.sendStatus(404);
    } else {
      res.status(204).send();
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;