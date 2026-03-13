"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"       // .dark class body pe lagega
            defaultTheme="light"    // default light mode
            enableSystem={true}     // system preference bhi respect karega
            disableTransitionOnChange={false}
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}