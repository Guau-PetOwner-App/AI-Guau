# AI Guau - Pet Analysis App

An AI-powered pet analysis application that uses OpenAI's Vision API to analyze pet photos and generate personalized care routines.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key
- Supabase account (already configured)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   The `.env` file should already be created. If not, create it with:
   ```bash
   ./crear-env-ahora.sh
   ```
   
   Or manually create `.env` with:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_OPENAI_ASSISTANT_ID=asst_7bJDB6UcFWaQkvWSjPixb7NB
   VITE_SUPABASE_URL=https://oqoaxusesfcrmejftwmt.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GUAU_APP_URL=https://get.guau.app
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...
├── services/           # Business logic
│   ├── openai.ts      # OpenAI API integration
│   ├── petAnalysisService.ts  # Supabase operations
│   └── ...
├── lib/                # Library files
│   └── supabase.ts    # Supabase client
├── config/             # Configuration
│   └── app.ts         # App configuration
└── supabase/           # SQL scripts
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Supabase** - Backend & Auth
- **OpenAI API** - AI analysis
- **Sonner** - Toast notifications

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the browser.

## 📝 Notes

- The app uses OpenAI's Assistants API for pet image analysis
- Supabase handles authentication and data storage
- Images are stored in Supabase Storage bucket `pet-photos`
- The app supports both authenticated and anonymous users

## 🐛 Troubleshooting

1. **Import errors**: Make sure all dependencies are installed with `npm install`
2. **Environment variables not loading**: Restart the dev server after changing `.env`
3. **Supabase errors**: Check that RLS policies are properly configured
4. **OpenAI API errors**: Verify your API key is valid and has credits

## 📄 License

See LICENSE file for details.

