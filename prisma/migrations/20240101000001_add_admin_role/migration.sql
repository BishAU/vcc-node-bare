-- Add isAdmin field to User table
ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Create initial admin user
INSERT INTO "User" (email, password, name, isAdmin)
VALUES ('emailbish@gmail.com', '$2b$10$YourHashedPasswordHere', 'Admin User', true);
