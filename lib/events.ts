import { Query } from "react-native-appwrite";
import { databases } from "./appwrite";

const DATABASE_ID = '6908d1cd0021a16d1690'
const COLLECTION_ID = 'events'

export async function getEvents() {
    try {
        const res = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.orderAsc('Date')]
        )

        const events = res.documents.map( (doc) => ({
            $id: doc.$id,
            eventName: doc.Title,
            description: doc.Description,
            eventDate: doc.Date,
            time: doc.Time,
            club: doc.Club,
            location: doc.Location
        }))

        return events
    }

    catch (err) {
        console.error('Error fetching events:', err)
        return []
    }
}