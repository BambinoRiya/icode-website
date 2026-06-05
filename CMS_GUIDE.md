# iCODE Abakwa Field Notes CMS - User Guide

## Overview

Your Field Notes CMS is now fully integrated with Supabase. This guide walks you through creating, editing, and publishing articles.

## Getting Started

### 1. Admin Login

Visit your site and navigate to `/admin/login` to access the admin dashboard.

**First Time Setup:**
- Click "Sign up" to create an admin account
- Use a valid email address (you'll need to confirm it)
- Set a secure password (min 6 characters)
- Check your email and click the confirmation link
- Return to login with your credentials

### 2. Access the Dashboard

Once logged in, you'll see the admin dashboard at `/admin/dashboard` with:
- List of all articles (published and drafts)
- Quick stats showing number of articles
- Buttons to create new articles or edit existing ones

## Managing Articles

### Creating a New Article

1. Click the **"+ New Article"** button
2. Fill in the article details:
   - **Title**: Article headline
   - **Description**: Brief preview text (shown in article lists)
   - **Category**: Group articles by topic (e.g., "AI & EDUCATION", "BUILD LOGS")
   - **Date**: Publication date
   - **Read Time**: Estimated reading time (e.g., "5 min read")
   - **Featured Image URL**: Link to a cover image

3. Check the **Published** checkbox to make it live (uncheck to save as draft)
4. Click **Save Article**

### Editing Articles

1. Click **Edit** on any article in the dashboard
2. Update any fields you want to change
3. Click **Save Article** to update

### Publishing Status

- **Published**: Article appears on the site and in article lists
- **Draft**: Article is hidden from the public site (only visible in admin)
- Toggle the status badge in the dashboard to quickly publish/unpublish

### Deleting Articles

1. Click **Delete** on any article
2. Confirm the deletion (this cannot be undone)

## Article URLs & Slugs

Articles are automatically assigned a URL slug based on the title. For example:
- Title: "Testing MamaMath in Real Classrooms"
- URL slug: `testing-mamamath-in-real-classrooms`
- Full URL: `/field-notes/testing-mamamath-in-real-classrooms`

The slug is generated automatically when you save - no need to set it manually.

## Rich Content (Future Enhancement)

Currently, articles support:
- Title, description, date, read time
- Featured image
- Full content editing in the admin

The article detail pages show where rich content (text blocks, quotes, images) can be added. The backend structure supports JSONB content blocks for future expansion.

## Public Pages

### Field Notes List (`/field-notes`)
- Displays all published articles
- Shows articles in date order (newest first)
- Features article card with image, title, date, read time
- Links to full article pages

### Article Detail Pages (`/field-notes/[slug]`)
- Full article view
- Featured image
- Meta information (category, date, read time)
- Related articles sidebar
- SEO-optimized with metadata

## Logout

Click the **Logout** button in the top-right corner of the dashboard to sign out.

## Troubleshooting

### Can't sign up?
- Make sure you're using a valid email address
- Check your spam folder for the confirmation email
- The confirmation link must be clicked within 24 hours

### Articles not showing on the public site?
- Make sure the article is **Published** (not Draft)
- Check that the featured image URL is valid and accessible
- The article needs a title and category to display

### Can't log back in?
- Make sure you're using the same email and password you signed up with
- Reset your password through the login page if needed

## Database Schema

Articles are stored in the `field_notes` table with:
- `id`: Unique identifier
- `slug`: URL-friendly title
- `title`: Article headline
- `description`: Preview text
- `category`: Topic category
- `date`: Publication date
- `read_time`: Estimated reading time
- `featured_image_url`: Cover image link
- `body_content`: Rich content blocks (JSONB)
- `is_published`: Publishing status
- `created_at`, `updated_at`: Timestamps

## Need Help?

The fallback data ensures that even if there are database issues, the site will display sample articles. This is built in to prevent downtime.

All article content is automatically fetched from Supabase when available, with graceful fallback to demo data.
