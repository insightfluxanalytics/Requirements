create extension if not exists pgcrypto;
create table admin_users(user_id uuid primary key references auth.users on delete cascade);
create table login_attempts(id bigserial primary key, ip text not null, created_at timestamptz not null default now());
create index on login_attempts(ip, created_at);
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from admin_users where user_id = auth.uid()) $$;
grant execute on function public.is_admin() to authenticated;

create table organizations(id uuid primary key default gen_random_uuid(), name text not null, founder_name text not null, address text, website_url text, instagram text, facebook text, logo_path text, category text, about text, established_year text, target_audience text, business_location text, brand_description text, created_at timestamptz default now());
create table submissions(id uuid primary key default gen_random_uuid(), ref text unique not null, organization_id uuid not null references organizations on delete cascade, launch_date text, budget text, special_instructions text, status text not null default 'new', created_at timestamptz not null default now());
create table contacts(id uuid primary key default gen_random_uuid(), submission_id uuid unique not null references submissions on delete cascade, organization_id uuid references organizations on delete cascade, contact_person text, mobile text not null, whatsapp text, email text not null, approval_contact text);
create table products(id uuid primary key default gen_random_uuid(), submission_id uuid not null references submissions on delete cascade, organization_id uuid references organizations on delete cascade, position int, name text not null, category text, description text, original_price numeric, selling_price numeric, discount_pct numeric, weight_size text, variants text, stock text, sku text);
create table product_images(id uuid primary key default gen_random_uuid(), product_id uuid not null references products on delete cascade, path text not null, created_at timestamptz default now());
create table website_requirements(id uuid primary key default gen_random_uuid(), submission_id uuid unique not null references submissions on delete cascade, features text[] default '{}', additional_features text);
create table payment_requirements(id uuid primary key default gen_random_uuid(), submission_id uuid unique not null references submissions on delete cascade, methods text[] default '{}', gateway text);
create table delivery_requirements(id uuid primary key default gen_random_uuid(), submission_id uuid unique not null references submissions on delete cascade, locations text, shipping_charges text, free_shipping_conditions text, partner text, return_policy text, delivery_time text);
create table design_preferences(id uuid primary key default gen_random_uuid(), submission_id uuid unique not null references submissions on delete cascade, colour_theme text, reference_links text, language text, logo_available text, banners_available text, style text, mobile_responsive text);
create table technical_requirements(id uuid primary key default gen_random_uuid(), submission_id uuid unique not null references submissions on delete cascade, owns_domain text, domain_name text, has_hosting text, hosting_provider text, business_email text, seo text, analytics text, pixel text, admin_training text);

-- Lock everything: anon gets nothing. Public inserts happen only via the server route (service role).
revoke all on all tables in schema public from anon;
do $$ declare t text; begin
 foreach t in array array['admin_users','login_attempts','organizations','submissions','contacts','products','product_images','website_requirements','payment_requirements','delivery_requirements','design_preferences','technical_requirements'] loop
  execute format('alter table %I enable row level security', t);
  if t not in ('login_attempts','admin_users') then
   execute format('create policy "admin read" on %I for select to authenticated using (public.is_admin())', t);
  end if;
 end loop; end $$;
revoke all on login_attempts, admin_users from authenticated;

insert into storage.buckets(id,name,public) values('submissions','submissions',false) on conflict do nothing;
create policy "admin read files" on storage.objects for select to authenticated using (bucket_id='submissions' and public.is_admin());
-- After creating the admin user in Supabase Auth (Dashboard > Authentication > Users):
-- insert into admin_users(user_id) select id from auth.users where email='YOUR_ADMIN_EMAIL';
