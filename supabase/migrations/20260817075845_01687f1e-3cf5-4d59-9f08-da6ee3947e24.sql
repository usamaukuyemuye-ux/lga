ALTER TABLE public.students ADD COLUMN IF NOT EXISTS religion text NOT NULL DEFAULT 'non-muslim';
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS action_label text;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS action_url text;