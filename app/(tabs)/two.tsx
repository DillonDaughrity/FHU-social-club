import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

const dataURL = 'https://nyc.cloud.appwrite.io/v1/storage/buckets/68f8ed0e001b9c51e7ce/files/690cefab00299b58429a/view?project=68f8eca00020d0b00702&mode=admin'

type Event = {
  "id": number,
  "Title": string,
  "Description": string,
  "Date": string,
  "Time": string,
  "Club": "Chi Beta Chi" | "Phi Kappa Alpha" | "Omega Chi" | "Xi Chi Delta" | "Sigma Rho",
  "Location": string
}

export default function TabTwoScreen() {
  const renderItem = ( {item}: {item: Event}) => {
    return (
      <View>
        <Text>{item.Club}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <FlatList 
        data={}
        renderItem={renderItem}
        ItemSeparatorComponent={styles.separator}
      /> */}
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
  },
});
