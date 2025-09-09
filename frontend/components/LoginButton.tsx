export default function LoginButton() {
  return (
    <a
      href="/api/auth/login"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
    >
      Login
    </a>
  );
}