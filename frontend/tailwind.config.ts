import { nextui } from "@nextui-org/react";
import { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        fontFamily: {
            sans: [
                "Work Sans",
                "ui-sans-serif",
                "system-ui",
                "sans-serif",
                "Apple Color Emoji",
                "Noto Color Emoji",
                "Segoe UI Emoji",
                "Segoe UI Symbol"
            ],
            serif: [
                "Spectral",
                "ui-serif",
                "Georgia",
                "Cambria",
                "Times New Roman",
                "Times",
                "serif"
            ],
            mono: [
                "ui-monospace",
                "SFMono-Regular",
                "Menlo",
                "Monaco",
                "Consolas",
                "Liberation Mono",
                "Courier New",
                "monospace"
            ]
        }
    },
    darkMode: "class",
    plugins: [
        nextui({
            themes: {
                light: {
                    colors: {
                        primary: {
                            50: "#ffe2e9",
                            100: "#ffb2c0",
                            200: "#ff8097",
                            300: "#fe4e6d",
                            400: "#fd2044",
                            500: "#e40b2b",
                            600: "#b20421",
                            700: "#800017",
                            800: "#4e000d",
                            900: "#1f0004",
                            foreground: "#000000",
                            DEFAULT: "#8f001a"
                        },
                        secondary: {
                            50: "#fbf1e6",
                            100: "#e1d7d2",
                            200: "#c7bdb8",
                            300: "#aea49d",
                            400: "#968a83",
                            500: "#7c7169",
                            600: "#625851",
                            700: "#473f38",
                            800: "#2c251f",
                            900: "#150b00",
                            foreground: "#000000",
                            DEFAULT: "#80746c"
                        }
                    }
                },
                dark: {
                    colors: {
                        primary: {
                            50: "#1f0007",
                            100: "#4d000e",
                            200: "#800017",
                            300: "#b20121",
                            400: "#de0227",
                            500: "#f41a3b",
                            600: "#fb4b68",
                            700: "#ff8097",
                            800: "#ffb3bf",
                            900: "#ffe0e4",
                            foreground: "#ffffff",
                            DEFAULT: "#ff708a"
                        },
                        secondary: {
                            50: "#1a1004",
                            100: "#2e241f",
                            200: "#473d38",
                            300: "#615851",
                            400: "#7c706a",
                            500: "#958b83",
                            600: "#aea49e",
                            700: "#c7bfb8",
                            800: "#dfd8d2",
                            900: "#fff5eb",
                            foreground: "#ffffff",
                            DEFAULT: "#938880"
                        }
                    }
                }
            }
        })
    ]
};

export default config;
