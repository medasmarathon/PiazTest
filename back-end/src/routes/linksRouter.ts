import { Router } from 'express';
import { CreateLinkRequest } from '../dto/createLinkRequest';
import { UpdateLinkRequest } from '../dto/updateLinkRequest';
import { LinkModel } from '../model/LinkModel';
import { AppDataSource } from '../data-source';

const linkRepository = AppDataSource.getRepository(LinkModel)
const router = Router();

// Centralized error handling
interface ApiError extends Error {
  statusCode?: number;
}

const handleError = (error: unknown, res: any) => {
  if (error instanceof Error) {
    const apiError = error as ApiError;
    console.log("Server Error", apiError.message);
    res.status(apiError.statusCode || 500).json({
      error: apiError.message || 'An unexpected error occurred'
    });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
};

// Create a new link
router.post('/', async (req, res) => {
  try {
    const parsed = CreateLinkRequest.parse(req.body);
    const existedLink = await linkRepository.findOne({
      where: { url: parsed.url }
    })

    let result = await linkRepository.save({
      ...parsed,
      id: existedLink ? existedLink.id : undefined,
      created_at: new Date(parsed.created_at).toUTCString(),
      userEmail: req.body.userEmail
    });

    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// Update a link
router.put('/:id', async (req, res) => {
  try {
    const parsed = UpdateLinkRequest.parse(req.body);
    let result = await linkRepository.save({
      ...parsed,
      id: req.params.id,
      userEmail: req.body.userEmail
    });

    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// Get all links for a specific user
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) {
      res.status(200).json([]);
      return;
    }

    let userSavedLinks = await linkRepository.find({
      where: {
        userEmail: String(userEmail)
      }
    });
    res.status(200).json(userSavedLinks);
  } catch (error) {
    handleError(error, res);
  }
});

// Get a specific link
router.get('/:id', async (req, res) => {
  try {
    let foundLink = await linkRepository.findOneBy({ id: req.params.id });
    res.status(200).json(foundLink);
  } catch (error) {
    handleError(error, res);
  }
});

// Update a link
router.put('/:id', async (req, res) => {
  try {
    const parsed = CreateLinkRequest.parse(req.body);
    const existedLink = await linkRepository.findOne({
      where: { url: parsed.url }
    })
    if (!existedLink) {
      res.sendStatus(404);
      return;
    }

    let result = await linkRepository.save({
      ...parsed,
      id: existedLink.id,
      created_at: new Date(parsed.created_at).toUTCString(),
      userEmail: req.body.userEmail
    });

    res.status(201).json(result);
  } catch (error) {
    handleError(error, res);
  }
});

// Delete a link
router.delete('/:url', async (req, res) => {
  try {
    let linkToRemove = await linkRepository.findOneBy({ url: req.params.url });
    if (!linkToRemove) {
      res.sendStatus(404);
      return;
    }

    await linkRepository.remove(linkToRemove);
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});

export default router;