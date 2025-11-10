import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { createAppWriteService } from '@/lib/appwrite';

const dataURL = 'https://nyc.cloud.appwrite.io/v1/storage/buckets/68f8ed0e001b9c51e7ce/files/690cefab00299b58429a/view?project=68f8eca00020d0b00702&mode=admin'

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
          <Text>{item.title}</Text>
          <Text>{item.club}</Text>
        </View>
        <Text>{item.description}</Text>
        <Text>{item.date}     {item.time}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} />
      <FlatList 
        data={events}
        keyExtractor={(item) => item.$id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
