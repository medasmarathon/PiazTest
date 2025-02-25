import { Router } from 'express';
import { supabase } from '../index';

const router = Router();

interface Link {
  id?: string;
  url: string;
  title: string;
  description?: string;
  created_at?: string;
}

// Create a new link
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('links')
      .insert({
        ...req.body,
        created_at: new Date(req.body.created_at)
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Get all links
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });

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

// Get a specific link
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('id', req.params.id)
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

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
});

export default router;