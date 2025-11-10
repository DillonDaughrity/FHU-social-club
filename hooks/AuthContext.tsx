import { createAppWriteService, MemberRow } from '@/lib/appwrite'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Models } from 'react-native-appwrite'

type AuthContextType = {
    user: Models.User<Models.Preferences> | null
    loading: boolean
    member: MemberRow | null
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, name: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider( {children}: {children: React.ReactNode}) {

    const appwriteService = useMemo(() => createAppWriteService(), [])

    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
    const [member, setMember] = useState<MemberRow | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async() => {
            const currentUser = await appwriteService.getCurrentUser()
            setUser(currentUser)
            setLoading(false)
        })()
    }, [])

    async function login(email: string, password: string) {
        const loggedInUser = await appwriteService.loginWithEmail({email, password})
        setUser(loggedInUser)
    }

    async function register(email: string, password:string, name: string) {
        const loggedInUser = await appwriteService.registerWithEmail({email, password, name})
        setUser(loggedInUser)
    }

    async function logout() {
        await appwriteService.logoutCurrentDevice()
        setUser(null)
    }

    const loadUser = useCallback( async () => {
        setLoading(true)
        try {
            const user = await appwriteService.getCurrentUser()

            if (user) {
                const member = await appwriteService.getMemberByUserId(user.$id)
                setMember(member ?? null)
            }

            else {
                setMember(null)
            }
        }

        finally {
            setLoading(false)
        }

    }, [appwriteService])

   // useEffect( () => {loadUser()}, [loadUser])

    return (
        <AuthContext.Provider value = {{ user, loading, member, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {throw new Error("useAuth() must be used inside <AuthProvider />")}

    return context
}