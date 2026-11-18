-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tomos table
CREATE TABLE tomos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pages table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tomo_id UUID NOT NULL REFERENCES tomos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create page_references table (renamed from "references" to avoid SQL reserved word)
CREATE TABLE page_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  target_page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices
CREATE INDEX idx_tomos_user_id ON tomos(user_id);
CREATE INDEX idx_pages_tomo_id ON pages(tomo_id);
CREATE INDEX idx_pages_user_id ON pages(user_id);
CREATE INDEX idx_page_references_source ON page_references(source_page_id);
CREATE INDEX idx_page_references_target ON page_references(target_page_id);
CREATE INDEX idx_page_references_user_id ON page_references(user_id);

-- Enable Row Level Security
ALTER TABLE tomos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_references ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tomos
CREATE POLICY "Users can view their own tomos" ON tomos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tomos" ON tomos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tomos" ON tomos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tomos" ON tomos
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for pages
CREATE POLICY "Users can view their own pages" ON pages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pages" ON pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pages" ON pages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pages" ON pages
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for page_references
CREATE POLICY "Users can view their own references" ON page_references
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own references" ON page_references
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own references" ON page_references
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own references" ON page_references
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
