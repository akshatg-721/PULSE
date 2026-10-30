/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind scans these files for class names. Any class used in a template,
  // a client script, or the JSON data files (e.g. gradient classes) is kept.
  content: ["./views/**/*.{hbs,json}", "./index/*.js"],
  theme: {
    extend: {
      colors: {
        pulse: {
          bg: "#0a0a0a",
          surface: "#151515",
          border: "#343434",
          text: "#f7f4ea",
          muted: "#a7a39a",
          accent: "#f5c400",
          accent2: "#c7cbd1"
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"]
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(30px, -40px) scale(1.08)" }
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.35)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.25)" },
          "70%": { transform: "scale(1)" }
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" }
        },
        shimmer: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "100%": { transform: "translateX(220%) skewX(-20deg)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
        float: "float 14s ease-in-out infinite",
        "float-slow": "float 20s ease-in-out infinite reverse",
        heartbeat: "heartbeat 1.6s ease-in-out infinite",
        gradient: "gradient 6s linear infinite",
        shimmer: "shimmer 2.4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
