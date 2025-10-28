import { createContext, useState } from 'react'
import { useColorScheme } from 'react-native'

export const ThemeContext = createContext()

export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState(useColorScheme())

    const toggleTheme = () => {
        setTheme( (prev) => (prev === 'light' ? 'dark' : 'light'))
    }

    return (
        <ThemeContext.Provider value = {{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}