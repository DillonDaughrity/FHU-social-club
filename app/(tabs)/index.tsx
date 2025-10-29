import { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { Text, View } from '@/components/Themed';

import { Ionicons } from '@expo/vector-icons';

const dataURL = 'https://nyc.cloud.appwrite.io/v1/storage/buckets/68f8ed0e001b9c51e7ce/files/69017e74002823cca3e9/view?project=68f8eca00020d0b00702&mode=admin'

type Student = {
  id: number,
  firstName: string,
  lastName: string,
  relationshipStatus: "Single" | "Taken" | "Complicated",
  classification: "Freshman" | "Sophomore" | "Junior" | "Senior",
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
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [profileVisibility, setProfileVisibility] = useState(false)
  
  const selectedStudent = students.find(student => student.id === selectedStudentId)

  const profileOn = (id: number) => {
    setSelectedStudentId(id)
    setProfileVisibility(true)
  }

  const profileOff = () => {
    setSelectedStudentId(null)
    setProfileVisibility(false)
  }

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
      <TouchableOpacity onPress={() => profileOn(item.id)}>
        <View style={styles.studentContainer}>
          <View style={styles.infoContainer}>
            <Image source={{uri: item.imageURL}} style={styles.smallImage}/>

            <View style={styles.infoText}>
              <Text>{item.firstName} {item.lastName}</Text>

              <Text>{item.classification}</Text>
            </View>
          </View>

          <View style={styles.extraInfo}>
            {item.officer != null && <Text>{item.officer}</Text>}
            {item.officer == null && <Text></Text>}

            <Text>{item.relationshipStatus}</Text>
          </View>
            
          <Ionicons name="chevron-forward-outline" size={30} color={'#000000aa'} style={{alignSelf: 'center'}}/>
        </View>
      </TouchableOpacity>
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
          data={filteredWithMemoization}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View>
              <Text style={{textAlign: 'center', marginHorizontal: 10}}>
                No students match “{query}”.
              </Text>
            </View>
          }
        />

        <Modal visible={profileVisibility}>
          <View>
            <TouchableOpacity onPress={profileOff}>
              <Text style={{fontSize: 30, opacity: 50, color: '#000000aa'}}><Ionicons name="chevron-back-outline" size={30}/> Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.studentProfile}>
            <Image source={{uri: selectedStudent?.imageURL}} style={[styles.bigImage, {alignSelf: 'center'}]}/>
            <Text style={{fontSize: 20}}>{<Ionicons name='person-outline' size={20}/>} {selectedStudent?.firstName} {selectedStudent?.lastName}</Text>
            {selectedStudent?.officer != null && <Text style={{fontSize: 20}}>{<Ionicons name='shield-checkmark-outline' size={20} />} {selectedStudent.officer}</Text>}
            <Text style={{fontSize: 20}}>{<Ionicons name='school-outline' size={20}/>} {selectedStudent?.classification}</Text>
            {selectedStudent?.showEmail && <Text style={{fontSize: 20}}>{<Ionicons name='mail-outline' size={20}/>} {selectedStudent.email}</Text>}
            {selectedStudent?.showPhone && <Text style={{fontSize: 20}}>{<Ionicons name='call-outline' size={20}/>} {selectedStudent.phone}</Text>}
            <Text style={{fontSize: 20}}>{<Ionicons name='heart-outline' size={20}/>} {selectedStudent?.relationshipStatus}</Text>
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30
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
    marginRight: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  smallImage: {
    borderRadius: 10,
    height: 75,
    width: 75
  },
  bigImage: {
    borderRadius: 10,
    marginVertical: 20,
    height: 250,
    width: 250
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
  studentProfile: {
    display: 'flex',
    marginHorizontal: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',
    backgroundColor: "#000"
  },
});
