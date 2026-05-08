export function ChromeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="chromeRed" x1="3.2" y1="15" x2="44.7" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d93025" />
          <stop offset="1" stopColor="#ea4335" />
        </linearGradient>
        <linearGradient id="chromeYellow" x1="20.7" y1="47.7" x2="41.5" y2="11.7" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fcc934" />
          <stop offset="1" stopColor="#fbbc04" />
        </linearGradient>
        <linearGradient id="chromeGreen" x1="26.6" y1="46.5" x2="5.8" y2="10.6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1e8e3e" />
          <stop offset="1" stopColor="#34a853" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="12" fill="#fff" />
      <path d="M3.2 36A24 24 0 0 0 44.7 36L33.3 30A12 12 0 0 1 14.7 30Z" fill="url(#chromeGreen)" />
      <path d="M44.7 36A24 24 0 0 0 24 0v12a12 12 0 0 1 9.3 18Z" fill="url(#chromeYellow)" />
      <path d="M24 0A24 24 0 0 0 3.2 36l11.4-6A12 12 0 0 1 24 12Z" fill="url(#chromeRed)" />
      <circle cx="24" cy="24" r="6" fill="#1a73e8" />
    </svg>
  );
}
