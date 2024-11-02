# Your Basic Blog (AI Generated)
 **All code in this project was generated through AI**, specifically using the Cline AI assistant, with human guidance and iteration. What makes this interesting:

- Zero manual code writing - all code was generated through AI-human collaboration
- The developer had never used Laravel or Vue before this project
- No framework documentation was consulted during development
- All architecture decisions and implementations were handled by AI with human feedback

## Features

- Modern, responsive UI
- Content management system
- Authentication system (mock by default)
- File upload capabilities (mock by default)
- Sample blog posts pre-loaded
- Easy local development with zero configuration
- AI-generated codebase with clean architecture

## Quick Start

1. Clone the repository
2. Run setup commands:
```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run migrations
php artisan migrate

# Start Laravel server (in one terminal)
php artisan serve

# Start Vite dev server (in another terminal)
npm run dev
```

3. Visit `http://localhost:8000` in your browser

## Development

By default, the application runs in mock mode with sample data:

- Sample blog posts are pre-loaded
- Login with any email/password combination (e.g., admin@example.com / any-password)
- File uploads are simulated
- No external services required

### Using Supabase (Optional)

To use Supabase instead of mock data:

1. Create a new Supabase project at https://supabase.com

2. Set up the database schema:
   - Go to your Supabase project's SQL editor
   - Copy the contents of `database/supabase/schema.sql`
   - Run the SQL commands to create:
     - Content table with RLS policies
     - Storage bucket for content images
     - Required storage policies

3. Configure your environment:
   ```
   # Update .env file
   USE_MOCK_REPOSITORIES=false
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Enable authentication:
   - Go to Authentication settings in your Supabase dashboard
   - Enable Email provider under Authentication > Providers
   - Create a user account through the Auth UI or SQL editor

The schema includes:
- Content management with title, description, content, and image fields
- Row Level Security (RLS) policies for user-specific content
- Public storage bucket for content images
- Storage policies for authenticated image uploads


