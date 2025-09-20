// tailwind.config.js
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          // Clustr Core Colors
          primary: {
            DEFAULT: '#6366F1',
            dark: '#4F46E5',
          },
          secondary: '#06B6D4',
          accent: '#F97316',
          success: '#10B981',
          error: '#F43F5E',
          
          // Clustr Neutral Colors
          background: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#94A3B8',
          text: {
            DEFAULT: '#334155',
            secondary: '#64748B',
          }
        },
        
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        
        fontSize: {
          xs: ['12px', '16px'],
          sm: ['14px', '20px'],
          base: ['16px', '24px'],
          lg: ['18px', '28px'],
          xl: ['20px', '28px'],
          '2xl': ['24px', '32px'],
        },
        
        fontWeight: {
          regular: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
        
        spacing: {
          xs: '4px',
          sm: '8px',
          md: '16px',
          lg: '24px',
          xl: '32px',
        },
        
        borderRadius: {
          button: '8px',
          card: '12px',
          input: '8px',
        },
        
        boxShadow: {
          card: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }
      },
    },
    plugins: [],
  }