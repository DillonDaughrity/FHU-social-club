import { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

const dataURL = 'https://nyc.cloud.appwrite.io/v1/storage/buckets/68f8ed0e001b9c51e7ce/files/68fd148a002df982b65d/view?project=68f8eca00020d0b00702&mode=admin'

type Student = {
  id: number,
  firstName: string,
  lastName: string,
  relationshipStatus: "single" | "taken" | "complicated",
  classification: "freshman" | "sophomore" | "junior" | "senior",
  email: string,
  phone: string,
  showEmail: boolean,
  showPhone: boolean,
  imageURL: string,
  officer: string
}

export default function TabOneScreen() {
  const [students, setStudents] = useState<Student[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setErrorMsg(null)

        const res = await fetch(dataURL, { method: "GET" })
        if (!res.ok) {throw new Error(`HTTP ${res.status}`)}
        const json = (await res.json()) as Student[]

        if (isMounted) {setStudents(json)}
      }

      catch (e: any) {
        if (isMounted) {
          setErrorMsg(e?.message ?? "unknown error")
        }
      }
    }

    load()
    return () => {isMounted = false}    
  }, [])

  const q = query.trimEnd().toLowerCase()
  const filtered = students.filter((person) => {
      return person.firstName.toLowerCase().includes(q) || 
              person.lastName.toLowerCase().includes(q)
    }
  )

  const filteredWithMemoization = useMemo( ()=> {
    const q = query.trimEnd().toLowerCase()

    if(!q) return students

    return students.filter((person) => {
      return person.firstName.toLowerCase().includes(q) || 
              person.lastName.toLowerCase().includes(q)
    })
  }, [query, students])

  const renderItem = ( {item}: {item: Student }) => {
    return (
      <View>
        <Image source={{uri: item.imageURL}} style={{width: 50, height: 50}}/>

        <Text>{item.firstName} {item.lastName}</Text>

        <Text>{item.classification} {item.relationshipStatus}</Text>
      </View>
    )
  }

  return (
    
    <View style={styles.container}>
      <Text>Club Directory</Text>
      <View style={styles.separator}></View>
      <FlatList
          data={filtered}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View>
              <Text>
                No students match “{query}”.
              </Text>
            </View>
          }
        />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
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
    backgroundColor: "#04ff00ff"
  },
});
