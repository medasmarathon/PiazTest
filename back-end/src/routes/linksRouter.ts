import { Router } from 'express';
import { supabase } from '../index';
import { CreateLinkRequest, CreateLinkRequestType } from '../dto/createLinkRequest';
import { UpdateLinkRequest, UpdateLinkRequestType } from '../dto/updateLinkRequest';

const router = Router();

// Centralized error handling
interface ApiError extends Error {
  statusCode?: number;
}

const handleError = (error: unknown, res: any) => {
  if (error instanceof Error) {
    const apiError = error as ApiError;
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
    const { data: existedLink, error: existedLinkError } = await supabase
      .from('links')
      .select()
      .eq("url", parsed.url);

    if (existedLinkError) {
      const err = new Error(`Failed to create link: ${existedLinkError.message}`);
      (err as ApiError).statusCode = 400;
      throw err;
    }

    const { data, error } = await supabase
      .from('links')
      .upsert({
        ...parsed,
        id: existedLink?.length > 0 ? existedLink[0].id : undefined,
        created_at: new Date(parsed.created_at).toUTCString(),
        userEmail: req.body.userEmail
      })
      .select()
      .single();

    if (error) {
      const err = new Error(`Failed to create link: ${error.message}`);
      (err as ApiError).statusCode = 400;
      throw err;
    }
    res.status(201).json(data);
  } catch (error) {
    handleError(error, res);
  }
});

// Update a link
router.put('/:id', async (req, res) => {
  try {
    const parsed = UpdateLinkRequest.parse(req.body);
    const { data, error } = await supabase
      .from('links')
      .update(parsed)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      const err = new Error(`Failed to update link: ${error.message}`);
      (err as ApiError).statusCode = 400;
      throw err;
    }
    res.status(200).json(data);
  } catch (error) {
    handleError(error, res);
  }
});

// Get all links for a specific user
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query;

    let query = supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });

    if (userEmail) {
      query = query.eq('userEmail', userEmail);
    }

    const { data, error } = await query;

    if (error) {
      const err = new Error(`Failed to fetch links: ${error.message}`);
      (err as ApiError).statusCode = 500;
      throw err;
    }
    res.status(200).json(data);
  } catch (error) {
    handleError(error, res);
  }
});

// Get a specific link
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      const err = new Error(`Failed to fetch link: ${error.message}`);
      (err as ApiError).statusCode = 404;
      throw err;
    }
    res.status(200).json(data);
  } catch (error) {
    handleError(error, res);
  }
});

// Update a link
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('links')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Delete a link
router.delete('/:url', async (req, res) => {
  try {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('url', decodeURIComponent(req.params.url));

    if (error) {
      const err = new Error(`Failed to delete link: ${error.message}`);
      (err as ApiError).statusCode = 500;
      throw err;
    }
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});

export default router;