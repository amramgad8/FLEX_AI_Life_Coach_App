import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Flex theme colors - Updated to match brand specs
				flex: {
					green: {
						light: '#8BC34A',
						DEFAULT: '#4CAF50',
						dark: '#388E3C'
					},
					yellow: {
						light: '#FFE082',
						DEFAULT: '#FFC107',
						dark: '#FFA000'
					},
					orange: {
						light: '#FFCC80',
						DEFAULT: '#FF9800',
						dark: '#F57C00'
					},
					text: '#111827' // Dark blue for contrast & text
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'scale': {
					'0%': { transform: 'scale(0.95)' },
					'100%': { transform: 'scale(1)' }
				},
				'color-shift': {
					'0%': { filter: 'hue-rotate(0deg)' },
					'50%': { filter: 'hue-rotate(15deg)' },
					'100%': { filter: 'hue-rotate(0deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-in-right': 'fade-in-right 0.5s ease-out forwards',
				'fade-in-left': 'fade-in-left 0.5s ease-out forwards',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'scale': 'scale 0.3s ease-out forwards',
				'color-shift': 'color-shift 8s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'flex-gradient': 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 30%, #FFC107 70%, #FF9800 100%)',
				'flex-gradient-reverse': 'linear-gradient(90deg, #FF9800 0%, #FFC107 30%, #8BC34A 70%, #4CAF50 100%)',
				'flex-light': 'linear-gradient(135deg, rgba(139, 195, 74, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)'
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: 'none',
						color: 'inherit',
						a: {
							color: 'inherit',
							textDecoration: 'underline',
							fontWeight: '500',
						},
						strong: {
							color: 'inherit',
							fontWeight: '600',
						},
						code: {
							color: 'inherit',
							fontWeight: '400',
							backgroundColor: 'hsl(var(--muted))',
							borderRadius: '0.25rem',
							padding: '0.25rem 0.375rem',
						},
						pre: {
							backgroundColor: 'hsl(var(--muted))',
							borderRadius: '0.5rem',
							padding: '1rem',
						},
					},
				},
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography")
	],
} satisfies Config;
