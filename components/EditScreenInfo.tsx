import { useContext } from 'react';
import { Button, StyleSheet } from 'react-native';

import { Text, View } from './Themed';

import { ThemeContext } from '@/hooks/ThemeContext';

export default function EditScreenInfo({ path }: { path: string }) {

  const {theme, toggleTheme} = useContext( ThemeContext )

  return (
    <View style={styles.getStartedContainer}>
      
      <Button onPress={toggleTheme} title='Toggle Mode (Light/Dark)'></Button>

      <Text>{theme}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
