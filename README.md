# Portfolio Dashboard - Apple Music Style

A modern portfolio website inspired by Apple Music's design, built with React, Vite, and Tailwind CSS.

## Features

- 🎵 Apple Music-inspired UI
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast development with Vite
- 🎨 Beautiful gradient backgrounds
- 🔗 Project showcase with GitHub links
- 📊 Three main sections: Listen Now, Browse Projects, About & Bio

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5500`

### Build

To build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
.
├── index.html          # HTML entry point
├── src/
│   ├── main.jsx       # React entry point
│   ├── App.jsx        # Main component
│   └── index.css      # Tailwind styles
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── package.json       # Dependencies
```

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Customization

Edit the `projects` array in `src/App.jsx` to add your own projects:

```jsx
const projects = [
  { 
    id: 1, 
    title: 'Your Project', 
    category: 'Category', 
    tech: 'Tech Stack', 
    desc: 'Description',
    liveUrl: 'https://...',
    githubUrl: 'https://...',
    color: 'from-color-500 to-color-600' 
  },
  // ...
];
```

## License

MIT
