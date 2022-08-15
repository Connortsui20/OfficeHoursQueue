/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
    mode: "jit",
    content: ["./out/**/*.{js, jsx, ts, tsx}", "./public/index.html"],
    theme: {
        extend: {},
    },
    plugins: [],
};
