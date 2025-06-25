# TypeRacer Pro

A modern, feature-rich typing speed test application built with Next.js, shadcn/ui, and PostgreSQL.

## 🚀 Live Demo

[View on Vercel](https://type-racer-pro-sa.vercel.app)

## 📸 Screenshots

### Homepage

![Homepage](https://github.com/sadik-tofik/TypeRacer-Pro/blob/main/public/assets/screenshots/home_light.png)
![Dark Mode](https://github.com/sadik-tofik/TypeRacer-Pro/blob/main/public/assets/screenshots/home_dark.png)
![Typing Challenge](https://github.com/sadik-tofik/blob/main/TypeRacer-Pro/public/assets/screenshots/typing_challenge.png)
![Result](https://github.com/sadik-tofik/TypeRacer-Pro/blob/main/public/assets/screenshots/results.png)


## Features

- **Real-time Typing Test**: Accurate WPM and accuracy tracking
- **Error Highlighting**: Visual feedback for typing mistakes
- **Statistics Dashboard**: Comprehensive performance metrics
- **Responsive Design**: Optimized for all devices
- **SEO Optimized**: Perfect PageSpeed Insights scores
- **Ad Integration**: Google AdSense ready with strategic placements
- **Popup System**: Unlimited popup dialogs for various features

## Tech Stack

- **Frontend**: Next.js 13.5.1, React 18, TypeScript
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/typeracer-pro.git

```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/typeracer_pro"
```

4. Set up the database:
```bash
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

The application uses three main models:

- **TestResult**: Stores individual test results with WPM and accuracy


## API Routes

- `/api/test-results` - POST/GET test results


## Ad Integration

The application includes strategic ad placements:

1. **Sidebar Unit** (right sidebar)
2. **Post-test Popup** (after completing a test)

All ad spaces are Google AdSense ready with fallback placeholders.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```
DATABASE_URL=your_postgresql_connection_string
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_ADSENSE_ID=your-adsense-id
```

## Performance Optimization

- Server-side rendering with Next.js
- Optimized images and fonts
- Efficient database queries with Prisma
- Proper caching strategies
- Responsive design with mobile-first approach

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@typeracer-pro.com or create an issue on GitHub.
