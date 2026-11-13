# Alif Naturalist – Website Requirement Portal (InsightFlux)
1. Create a Supabase project. Run `supabase/schema.sql` in the SQL editor.
2. Authentication > Users > Add user (the admin email + a strong password). Disable public sign-ups (Authentication > Providers > Email > turn off "Allow new users to sign up").
3. Run: `insert into admin_users(user_id) select id from auth.users where email='YOUR_ADMIN_EMAIL';`
4. Copy `.env.example` to `.env.local`, fill values (ADMIN_USERNAME / ADMIN_EMAIL / service key are server-only).
5. `npm install && npm run dev`. Deploy to Vercel with the same env vars.
Admin: /admin/login. PDF: open a submission > "Download PDF report" > Save as PDF.
