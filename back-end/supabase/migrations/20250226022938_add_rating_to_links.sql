-- Add rating column to links table
ALTER TABLE links
ADD COLUMN "rating" INTEGER CHECK (rating BETWEEN 1 AND 5);