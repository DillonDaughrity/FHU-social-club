import { Account, Client, ID, Models, Query, TablesDB } from 'react-native-appwrite'
import "react-native-url-polyfill/auto"

const APPWRITE_ENDPOINT = "https://nyc.cloud.appwrite.io/v1"
const APPWRITE_PROJECT_ID = "68f8eca00020d0b00702"
const APPWRITE_PLATFORM_NAME = "edu.fhu.fhu-social-club"
const DATABASE_ID = '6908d1cd0021a16d1690'
const MEMBERS_TABLE_ID = 'members'
const EVENTS_TABLE_ID = 'events'

export interface MemberRow extends Models.Row {
    firstName: string,
    lastName: string,
    userID: string,
    club?: string,
    phoneNumber: string,
    email: string,
}

export interface EventRow extends Models.Row {
    title: string,
    description: string,
    date: string,
    time: string,
    club: string,
    location: string
}

export function createAppWriteService() {
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setPlatform(APPWRITE_PLATFORM_NAME)

    const account = new Account(client)
    const tables = new TablesDB(client)

    const registerWithEmail = async ( {email, password, name}: {email: string, password: string, name: string} ) => {

        await account.create( {userId:ID.unique(), email, password, name} )

        await account.createEmailPasswordSession( {email, password} )

        return await account.get<Models.User<Models.Preferences>>()
    }

    const loginWithEmail = async ( {email, password }: {email: string, password: string} ) => {

        await account.createEmailPasswordSession( {email, password} )

        return await account.get<Models.User<Models.Preferences>>()
    }

    const getCurrentUser = async () => {
        try {
            const user = await account.get<Models.User<Models.Preferences>>()
            return user
        }

        catch {
            return null
        }
    }

    const logoutCurrentDevice = async () => {
        await account.deleteSession({sessionId: 'current'})
    }

    const getMemberByUserId = async( userID: string ): Promise<MemberRow> => {

        const response = await tables.listRows<MemberRow>({
            databaseId: DATABASE_ID,
            tableId: MEMBERS_TABLE_ID,
            queries: [Query.equal('userID', userID), Query.limit(1)]
        })

        return response.rows[0] ?? null
    }

    const getEvents = async (): Promise<EventRow[]> => {

        const response = await tables.listRows<EventRow>({
            databaseId: DATABASE_ID,
            tableId: EVENTS_TABLE_ID,
            queries: [Query.orderAsc('date')]
        })

        return response.rows
    }

    return {
        client,
        account,
        tables,

        getCurrentUser,
        registerWithEmail,
        loginWithEmail,
        logoutCurrentDevice,

        getMemberByUserId,
        getEvents
    }
}
// export const databases = new Databases(client)


// export const appwrite = {
//     client,
//     account,
//     databases,
//     registerWithEmail,
//     loginWithEmail,
//     getCurrentUser,
//     logoutCurrentDevice
// }