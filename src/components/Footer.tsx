import { Settings } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer className="py-12 px-6 border-t border-gray-200/50 dark:border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            AURORA
          </span>
          <span className="text-gray-500 dark:text-gray-500">
            Multimedia Studio
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © 2026 — All works by the Aurora creatives.
          </p>
          <button
            onClick={onAdminClick}
            className="p-2 rounded-lg opacity-30 hover:opacity-100 transition-opacity"
            title="Admin Panel"
          >
            <Settings className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </footer>
  );
}
