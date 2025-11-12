import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { createAppWriteService } from '@/lib/appwrite';

type Event = {
    $id: string,
    title: string,
    description: string,
    date: string,
    time: string,
    club: string,
    location: string
  }

export default function TabTwoScreen() {
  const appwriteService = useMemo(() => createAppWriteService(), [])

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvents = async () => {
      const data = await appwriteService.getEvents()
      setEvents(data)
      setLoading(false)
    }
    loadEvents()
  }, [])

  if (loading) {
    return (
      <View>
        <ActivityIndicator size='large' color='#007AFF' />
        <Text>Loading events...</Text>
      </View>
    )
  }

  const renderItem = ( {item}: {item: Event}) => {
    return(
      <View style={styles.eventContainer}>
        <View style={styles.eventInfo}>
          <Text style={{fontSize: 20}}>{item.title}</Text>
          <Text style={{fontSize: 17, marginTop: 5, marginBottom: 10}}>{item.location}</Text>
          <Text style={{fontSize: 15}}>{item.club}</Text>
        </View>
        <Text style={styles.eventDescription}>{item.description}</Text>
        <View style={styles.eventTime}>
          <Text>{item.date}</Text>
          <Text>{item.time}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <View style={styles.separator} />
      <FlatList 
        data={events}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  title: {
    fontSize: 30,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#333',
    alignSelf: 'center'
  },
  eventContainer: {
    marginHorizontal: 30
  },
  eventInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  eventDescription: {
    marginVertical: 10,
    textAlign: 'center'
  },
  eventTime: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});
