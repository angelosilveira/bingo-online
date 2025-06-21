-- Add username column and constraints
ALTER TABLE users ADD COLUMN username text;

-- Make username required and unique
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);

-- Create temporary usernames for existing users based on their names
UPDATE users 
SET username = LOWER(REGEXP_REPLACE(name, '\s+', '_', 'g')) 
WHERE username IS NULL;
