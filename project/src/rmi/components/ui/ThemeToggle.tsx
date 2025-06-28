import useDarkMode from '../../../hooks/useDarkMode';

const ThemeToggle = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="text-2xl p-2 rounded-full transition-all hover:scale-105"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
