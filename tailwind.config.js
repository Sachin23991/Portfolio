/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                theme1: {
                    bg: '#0F0F0F', // Light Black / Charcoal
                    text: '#F5F5F5', // Alabaster White
                },
                theme2: {
                    bg: '#FFFFFF', // Crisp White
                    primary: '#87CEFA', // Light Sky Blue
                    accent: '#90EE90', // Light Green
                }
            }
        },
    },
    plugins: [],
}
