import { Account, Client, ID, Models, Query, TablesDB } from 'react-native-appwrite'
import "react-native-url-polyfill/auto"

const APPWRITE_ENDPOINT = "https://nyc.cloud.appwrite.io/v1"
const APPWRITE_PROJECT_ID = "68f8eca00020d0b00702"
const APPWRITE_PLATFORM_NAME = "edu.fhu.fhu-social-club"
const DATABASE_ID = 'social-club-db'
const MEMBERS_TABLES_ID = 'members'

export interface MemberRow extends Models.Row {
    firstName: string,
    lastName: string,
    userID: string,
    club?: string,
    phoneNumber: string,
    email: string,
}

export function createAppWriteService(config) {
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
            tableId: MEMBERS_TABLES_ID,
            queries: [Query.equal('userID', userID), Query.limit(1)]
        })

        return response.rows[0] ?? null
    }

    return {
        client,
        account,
        tables,

        getCurrentUser,
        registerWithEmail,
        loginWithEmail,
        logoutCurrentDevice,

        getMemberByUserId
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