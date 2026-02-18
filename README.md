A secure, full-stack Bookmark Manager Web Application built with Next.js, Supabase, and Google OAuth Authentication.

Users can sign in with Google, manage their personal bookmarks, and securely store data with Row Level Security (RLS).

Challenges & Solutions

-Next.js Routing Issues:
  The app initially showed only the default Next.js welcome page because required App Router files (layout.tsx, page.tsx) were missing. This was fixed by rebuilding the project using the correct src/app structure   with proper routing files.

-Hydration & SSR Errors:
  React hydration errors occurred due to client-only logic running during server-side rendering. This was solved by correctly using "use client" directives and separating client and server logic.

-Supabase Import & Path Errors:
  Errors like Cannot find module '@/lib/supabaseClient' were caused by missing tsconfig.json and incorrect path aliases. This was resolved by adding tsconfig.json and configuring proper @/* path mapping.

-TypeScript never Insert Errors:
  Supabase insert() operations failed with never type errors because no database types were defined. Creating a types.ts file and connecting the Supabase client with proper database typings fixed this completely.

-Authentication Loop Issue:
  After magic link login, users were redirected back to login repeatedly due to missing session handling. This was solved by implementing session checks using supabase.auth.getSession() and protected route logic.

-Google OAuth Redirect Errors:
  Google OAuth failed with redirect_uri_mismatch because the Supabase callback URL was not registered in Google Cloud Console. Adding the Supabase callback URL fixed the issue.

-OAuth Client Deletion Error:
  Login failed with deleted_client due to removed OAuth credentials. This was fixed by recreating the OAuth client and reconnecting Google Auth in Supabase.

-Supabase Server Client Cookie Errors:
  Server-side authentication failed due to incorrect cookie handling. This was resolved by correctly using Next.js App Router cookie methods with createServerClient.

-Row Level Security (RLS) Blocking Data:
  Bookmarks could not be added because RLS policies were missing. Proper RLS policies were created for select, insert, and delete.

-UI State & Auth Sync Issues:
  Buttons like logout and add-bookmark disappeared due to broken session state rendering. This was solved using session-based conditional rendering and proper client-side auth state syncing.

