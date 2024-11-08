-- Supabase SQL schema

-- Create content table
create table
  public.content (
    id bigint generated by default as identity primary key,
    title text not null,
    description text,
    content text,
    image text,
    created_at timestamp with time zone default timezone ('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone ('utc'::text, now()) not null,
    user_id uuid references auth.users (id)
  );

-- Enable RLS
alter table public.content enable row level security;

-- Create storage bucket for content images
insert into
  storage.buckets (id, name, public)
values
  ('content-images', 'content-images', true);

-- RLS policies for content table
create policy "Public content is viewable by everyone" on public.content for
select
  using (true);

create policy "Users can insert their own content" on public.content for insert
with
  check (auth.uid () = user_id);

create policy "Users can update their own content" on public.content
for update
  using (auth.uid () = user_id);

create policy "Users can delete their own content" on public.content for delete using (auth.uid () = user_id);

-- Storage policies
create policy "Content images are publicly accessible" on storage.objects for
select
  using (bucket_id = 'content-images');

create policy "Authenticated users can upload content images" on storage.objects for insert
with
  check (
    bucket_id = 'content-images'
    and auth.role () = 'authenticated'
  );

create policy "Users can update their own content images" on storage.objects
for update
  using (
    bucket_id = 'content-images'
    and auth.uid () = owner
  );

create policy "Users can delete their own content images" on storage.objects for delete using (
  bucket_id = 'content-images'
  and auth.uid () = owner
);
