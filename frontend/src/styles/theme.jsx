import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, { 
  theme: {
    tokens: {
      colors: {
        brand: {
          50: '#e6f7eb',
          100: '#c2ebcf',
          200: '#99e0b3',
          300: '#70d597',
          400: '#47ca7b',
          500: '#2db162',
          600: '#22894d',
          700: '#166038',
          800: '#0a3722',
          900: '#001e0d',
        },
      },
    },
    styles: {
      global: {
        body: {
          bg: 'brand.50',
          color: 'brand.900',
        },
        a: {
          color: 'brand.500',
          _hover: {
            textDecoration: 'underline',
          },
        },
      },
    },
  }  
})

export default theme;