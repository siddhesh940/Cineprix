import type { Config } from 'tailwindcss';
export default {
    darkMode: ['class'],
    content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
    	extend: {
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		animation: {
    			gradient: 'gradient 8s linear infinite',
    			'fade-in': 'fadeIn 0.5s ease-out forwards',
    			'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
    			'fade-in-down': 'fadeInDown 0.5s ease-out forwards',
    			'slide-in-left': 'slideInLeft 0.5s ease-out forwards',
    			'slide-in-right': 'slideInRight 0.5s ease-out forwards',
    			'scale-in': 'scaleIn 0.3s ease-out forwards',
    			'glow-pulse': 'glowPulse 2s ease-in-out infinite',
    			'shimmer': 'shimmer 2s linear infinite',
    			'float': 'float 6s ease-in-out infinite',
    			'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    		},
    		keyframes: {
    			gradient: {
    				to: {
    					backgroundPosition: 'var(--bg-size) 0'
    				}
    			},
    			fadeIn: {
    				from: { opacity: '0' },
    				to: { opacity: '1' }
    			},
    			fadeInUp: {
    				from: { opacity: '0', transform: 'translateY(20px)' },
    				to: { opacity: '1', transform: 'translateY(0)' }
    			},
    			fadeInDown: {
    				from: { opacity: '0', transform: 'translateY(-20px)' },
    				to: { opacity: '1', transform: 'translateY(0)' }
    			},
    			slideInLeft: {
    				from: { opacity: '0', transform: 'translateX(-20px)' },
    				to: { opacity: '1', transform: 'translateX(0)' }
    			},
    			slideInRight: {
    				from: { opacity: '0', transform: 'translateX(20px)' },
    				to: { opacity: '1', transform: 'translateX(0)' }
    			},
    			scaleIn: {
    				from: { opacity: '0', transform: 'scale(0.95)' },
    				to: { opacity: '1', transform: 'scale(1)' }
    			},
    			glowPulse: {
    				'0%, 100%': { boxShadow: '0 0 20px -5px hsl(var(--primary) / 0.4)' },
    				'50%': { boxShadow: '0 0 30px -5px hsl(var(--primary) / 0.6)' }
    			},
    			shimmer: {
    				from: { backgroundPosition: '-200% 0' },
    				to: { backgroundPosition: '200% 0' }
    			},
    			float: {
    				'0%, 100%': { transform: 'translateY(0)' },
    				'50%': { transform: 'translateY(-10px)' }
    			}
    		},
    		transitionTimingFunction: {
    			'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
    			'bounce-sm': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    		},
    		backgroundImage: {
    			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    			'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    		}
    	}
    },
    plugins: [require('tailwindcss-animate')],
} satisfies Config;
