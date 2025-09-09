export default function LoginButton() {
  return (
    <a href="/api/auth/login" className="btn-primary group shimmer">
      <span className="flex items-center justify-center">
        <svg
          className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Sign In
      </span>
    </a>
  );
}
