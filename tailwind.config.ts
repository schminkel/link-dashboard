import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        reorderPulse: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
          },
        },
        successFlash: {
          "0%": {
            boxShadow: "0 0 20px rgba(34, 197, 94, 0.6)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(34, 197, 94, 0.8)",
          },
          "100%": {
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
          },
        },
        tabReorderPulse: {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
            transform: "scale(1)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(59, 130, 246, 0.7)",
            transform: "scale(1.02)",
          },
        },
        tabSuccessFlash: {
          "0%": {
            boxShadow: "0 0 15px rgba(34, 197, 94, 0.6)",
            transform: "scale(1)",
          },
          "25%": {
            boxShadow: "0 0 30px rgba(34, 197, 94, 0.8)",
            transform: "scale(1.05)",
          },
          "50%": {
            boxShadow: "0 0 35px rgba(34, 197, 94, 0.9)",
            transform: "scale(1.03)",
          },
          "100%": {
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
            transform: "scale(1)",
          },
        },
        tabDropPulse: {
          "0%, 100%": {
            opacity: "0.6",
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
          },
          "50%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)",
          },
        },
        spinGlow: {
          "0%": {
            transform: "rotate(0deg)",
            filter: "drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))",
          },
          "50%": {
            filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))",
          },
          "100%": {
            transform: "rotate(360deg)",
            filter: "drop-shadow(0 0 2px rgba(59, 130, 246, 0.5))",
          },
        },
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        reorderPulse: "reorderPulse 2s ease-in-out infinite",
        successFlash: "successFlash 1.5s ease-out",
        tabReorderPulse: "tabReorderPulse 2s ease-in-out infinite",
        tabSuccessFlash: "tabSuccessFlash 1.5s ease-out",
        tabDropPulse: "tabDropPulse 1.5s ease-in-out infinite",
        spinGlow: "spinGlow 1s linear infinite",
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
