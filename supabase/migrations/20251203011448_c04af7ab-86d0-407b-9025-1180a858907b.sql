-- Create celebrations table for storing birthday celebration info
CREATE TABLE public.celebrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  birthday_person_name TEXT NOT NULL,
  view_password TEXT NOT NULL,
  admin_password TEXT NOT NULL,
  main_media_url TEXT,
  main_media_type TEXT DEFAULT 'image',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for birthday wishes
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  celebration_id UUID NOT NULL REFERENCES public.celebrations(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.celebrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public can read celebrations (password check happens in app)
CREATE POLICY "Anyone can view celebrations" 
ON public.celebrations 
FOR SELECT 
USING (true);

-- Public can insert celebrations (for creating new ones)
CREATE POLICY "Anyone can create celebrations" 
ON public.celebrations 
FOR INSERT 
WITH CHECK (true);

-- Public can update celebrations (admin password check in app)
CREATE POLICY "Anyone can update celebrations" 
ON public.celebrations 
FOR UPDATE 
USING (true);

-- Public can read messages
CREATE POLICY "Anyone can view messages" 
ON public.messages 
FOR SELECT 
USING (true);

-- Public can insert messages
CREATE POLICY "Anyone can add messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

-- Public can delete messages (admin password check in app)
CREATE POLICY "Anyone can delete messages" 
ON public.messages 
FOR DELETE 
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_celebrations_updated_at
BEFORE UPDATE ON public.celebrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();