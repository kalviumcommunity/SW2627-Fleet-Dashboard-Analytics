create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamp with time zone default now()
);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'viewer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
