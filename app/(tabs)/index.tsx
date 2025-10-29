import { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, TextInput } from 'react-native';

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
      <View style={styles.studentContainer}>
        <View style={styles.infoContainer}>
          <Image source={{uri: item.imageURL}} style={styles.smallImage}/>

          <View style={styles.infoText}>
            <Text>{item.firstName} {item.lastName}</Text>
            <Text>{item.officer}</Text>
          </View>
        </View>

        <View style={styles.extraInfo}>
          <Text>{item.classification}</Text>
          <Text>{item.relationshipStatus}</Text>
        </View>
      </View>
    )
  }

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Club Directory</Text>
      <TextInput
        placeholder="Search by first or last name..."
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.search}
        clearButtonMode="while-editing"
      />
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
    
  },
  title: {
    fontSize: 40,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  studentContainer: {
    marginLeft: 20,
    marginRight: 60,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  smallImage: {
    borderRadius: 10,
    height: 75,
    width: 75
  },
  bigImage: {
    height: 150,
    width: 150
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  infoText: {
    display: 'flex',
    justifyContent: 'space-around',
    marginLeft: 10
  },
  extraInfo: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
    backgroundColor: "#000000"
  },
});
