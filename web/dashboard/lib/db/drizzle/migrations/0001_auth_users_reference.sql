ALTER TABLE "user_profiles" 
ADD CONSTRAINT "user_profiles_id_fkey" 
FOREIGN KEY ("id") 
REFERENCES auth.users(id) 
ON DELETE CASCADE;