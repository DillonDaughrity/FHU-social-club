import { createContext, useEffect, useState } from 'react'
import { Models } from 'react-native-appwrite'

import { appwrite } from '@/lib/appwrite'


const AuthContext = createContext(undefined)

export function AuthProvider() {

    const [user, setUser] = useState<Models.User<Models.Preferences>>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async() => {
            const user = await appwrite.getCurrentUser()
            setUser(currentUser)
        })()
    }, [])
}