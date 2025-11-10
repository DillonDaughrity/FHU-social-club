import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Linking, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/hooks/AuthContext';
import { createAppWriteService } from '@/lib/appwrite';

const dataURL = 'https://nyc.cloud.appwrite.io/v1/storage/buckets/68f8ed0e001b9c51e7ce/files/691259c400160b95dd4f/view?project=68f8eca00020d0b00702&mode=admin'

type Student = {
  id: number,
  userID?: string,
  firstName: string,
  lastName: string,
  relationshipStatus: "Single" | "Taken" | "Complicated",
  classification: "Freshman" | "Sophomore" | "Junior" | "Senior",
  email: string,
  phone: string,
  showEmail: boolean,
  showPhone: boolean,
  imageURL: string,
  officer: string,
  club: 'Phi Kappa Alpha' | 'Omega Chi' | 'Chi Beta Chi' | 'Sigma Rho' | 'Xi Chi Delta'
}

export default function TabOneScreen() {
  const appwriteService = useMemo(() => createAppWriteService(), [])

  const {user, register, login, loading} = useAuth()

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
    if(user) {
      const loadMembers = async () => {
        const data = await appwriteService.getMembersByClub((await appwriteService.getMemberByUserId(user.$id)).club)
        setStudents(data)
      }
      
      loadMembers()
    }
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
              <Text>{item.firstName} {item.lastName} </Text>

              {item.officer != null && <Text>{item.officer}</Text>}
              {item.officer == null && <Text></Text>}
            </View>
          </View>

          <View style={styles.extraInfo}>
            <Text>{item.classification}</Text>

            <Text>{item.relationshipStatus}</Text>
          </View>
            
          <Ionicons name="chevron-forward-outline" size={30} color={'#000000aa'} style={{alignSelf: 'center'}}/>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Directory</Text>

      {!user && <View style={{marginHorizontal: 20}}>
        <Text style={{fontSize: 18, textAlign: 'center', marginVertical: 15}}>
          You must be logged in to see this page.
        </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/auth')}>
          <Text style={styles.link}>Need to login? Click here</Text>
        </TouchableOpacity>
      </View>}

      {user && <View>
        <TextInput
          placeholder="Search by first or last name..."
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.search, {color: '#333'}]}
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
            <View style={{marginTop: 40}}>
              <TouchableOpacity onPress={profileOff}>
                <Text style={{fontSize: 30, opacity: 50, color: '#000000aa'}}><Ionicons name="chevron-back-outline" size={30}/> Back</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.studentProfile}>
              <Image source={{uri: selectedStudent?.imageURL}} style={[styles.bigImage, {alignSelf: 'center'}]}/>
              <Text style={{fontSize: 20}}>{<Ionicons name='person-outline' size={20}/>} {selectedStudent?.firstName} {selectedStudent?.lastName}</Text>
              {selectedStudent?.officer != null && <Text style={{fontSize: 20}}>{<Ionicons name='shield-checkmark-outline' size={20} />} {selectedStudent.officer}</Text>}
              <Text style={{fontSize: 20}}>{<Ionicons name='school-outline' size={20}/>} {selectedStudent?.classification}</Text>
              {selectedStudent?.showEmail && 
              <View style={{display: 'flex', flexDirection: 'row', alignItems:'center'}}>
                {<Ionicons name='mail-outline' size={20}/>} 
                {<TouchableOpacity onPress={() => Linking.openURL(`mailto:${selectedStudent.email}`)}>
                  <Text style={{fontSize: 20, marginLeft: 5, textDecorationLine: 'underline', textDecorationColor: '#1500ff'}}>{selectedStudent.email}</Text>
                </TouchableOpacity>}
              </View>}
              {selectedStudent?.showPhone && 
              <View style={{display: 'flex', flexDirection: 'row', alignItems:'center'}}>
                {<Ionicons name='call-outline' size={20}/>} 
                {<TouchableOpacity onPress={() => Linking.openURL(`tel:${selectedStudent.phone}`)}>
                  <Text style={{fontSize: 20, marginLeft: 5, textDecorationLine: 'underline', textDecorationColor: '#1500ff'}}>{selectedStudent.phone}</Text>
                </TouchableOpacity>}
              </View>}
              <Text style={{fontSize: 20}}>{<Ionicons name='heart-outline' size={20}/>} {selectedStudent?.relationshipStatus}</Text>
            </View>
          </Modal>
        </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
  },
  title: {
    fontSize: 30,
    marginVertical: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    color:'#4000ff',
    textDecorationLine: 'underline',
    textAlign: 'center',
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
