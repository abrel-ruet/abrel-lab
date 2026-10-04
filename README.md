# ABREL — Advanced Bio-Resources Engineering Lab

Website and admin CMS for the Advanced Bio-Resources Engineering Lab, built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Firebase** (Firestore + Auth + Analytics) and **Cloudinary** (image/file uploads).

The dark theme is derived from the lab logo: leaf green → helix teal → gear blue on deep navy (see `app/globals.css`).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Credentials live in `.env.local` (see `.env.example` for the variable list).

## One-time Firebase setup

1. **Firestore** — Firebase console → Build → Firestore Database → create the database if you haven't.
2. **Security rules** — publish `firestore.rules`, either by pasting it into *Firestore → Rules* in the console, or with the CLI:
   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules
   ```
   Until the rules are published, Firestore denies all reads, so public pages show "Couldn't load content".
3. **Authentication** — Build → Authentication → Sign-in method → enable **Email/Password**. Under *Users*, add an admin user and copy their **User UID**.
4. **Grant admin access** — in Firestore, create a collection named `admins` with a document whose **ID is that UID** (the document can have any field, e.g. `email`). Only users listed in `admins` can edit content or read submissions. Self-registered accounts get nothing.
5. Sign in at `/admin/login` and start adding content.

## Cloudinary

Uploads go directly from the browser to Cloudinary through the **unsigned** preset `abrel-preset` (folder `assets`). To accept CV/PDF uploads, make sure the preset allows those formats (Settings → Upload → Upload presets → `abrel-preset`).

## Team hierarchy

The Team page defaults to a **Research Hierarchy** view:

- **Research Domains** (Admin → Research Domains) are the subject areas students belong to.
- Each team member has a **Research Domain** and a **Works Under** (supervisor) field (Admin → Team Members).
- Faculty assigned to a domain are shown as its leads. Researchers and students form a tree inside their domain: anyone whose supervisor is another student/researcher is nested under them, to any depth.
- Profile pages show the member's domain, who they work under, and the researchers working under them.
- The supervisor dropdown hides the member and everyone below them, so supervision cycles can't be created.

## Customizing

- **Lab name, contact info, social links, research areas** → `lib/site-config.ts`
- **Theme colors** → `@theme` block in `app/globals.css`
- **Logo** → `public/abrel-logo.jpeg` (favicon: `app/icon.jpg`)

## Project structure

```
app/
  page.tsx                 Home (hero, stats, research areas, faculty, news, FAQ, newsletter)
  team/ publications/ projects/ resources/ news/   Public listing + [slug] detail pages
  recruitment/ contact/ certificate/               Public forms & certificate verification
  admin/login/             Admin sign-in
  admin/(dashboard)/       Protected CMS: dashboard + one page per collection
components/
  layout/                  Navbar, footer, analytics
  home/                    Homepage sections
  ui/                      Shared public UI (page hero, filter bar, states, avatar)
  admin/                   CMS building blocks (CrudPage, EntityForm, DataTable, uploads, rich text)
lib/
  firebase.ts firestore.ts cloudinary.ts auth-context.tsx
  types.ts site-config.ts team-tree.ts utils.ts
firestore.rules            Security rules (public read, admin-only writes, public form submissions)
```

### Firestore collections

| Collection | Public | Admin |
|---|---|---|
| `team`, `domains`, `publications`, `projects`, `news`, `announcements`, `resources`, `certificates` | read | full |
| `contactMessages`, `recruitmentApplications`, `newsletterSubscribers` | create only | full |
| `admins` | — | managed in the console |

## Deploying

Deploy to Vercel (or any Next.js host) and add every variable from `.env.local` to the host's environment settings. Set `NEXT_PUBLIC_SITE_URL` to the production URL, and add the production domain under Firebase → Authentication → Settings → **Authorized domains**.
