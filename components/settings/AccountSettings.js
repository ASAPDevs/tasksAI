import React, {useState} from'react';
import { View, Text, Pressable, Icon} from 'native-base';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
const LazyLoadChangePassword = React.lazy(() => import('./ChangePasswordForm'));

export default function Account({updateCurrentView}) {
  const [currentAccountView, updateCurrentAccountView] = useState('main')
  const username = useSelector((state) => state.storage.username)
  const email = useSelector((state) => state.storage.email)

console.log("EMAIL: ", email)

  const conditionalRender = () => {
    switch (currentAccountView) {
      case'main':
        return (
          <View style={styles.innerContainer}>
            <Pressable onPress={() => updateCurrentView('main')}>
              <Icon as={Ionicons} name="arrow-back" color="black" size={6} marginLeft={2} marginBottom={2} />
            </Pressable>
            <Text 
              style={styles.text}
              onPress={() => updateCurrentAccountView('change-password')}
            >
              Change Password
            </Text>
            <Text style={styles.text}>
              Change Email Address
            </Text>
            <View flexDirection="row" justifyContent="start" width={135}>
              <Text style={styles.text}>
                Username:
              </Text>
              <Text style={styles.text} color="amber.500">
                {username}
              </Text>
            </View>
            <View flexDirection="row" justifyContent="start" width={295}>
              <Text style={styles.text} >
                Email:
              </Text>
              <View >
                <Text style={styles.text} color="amber.500">
                  {email}
                </Text>
              </View>
            </View>
        </View>
        );
      case 'change-password':
        return (
          <LazyLoadChangePassword updateCurrentAccountView={updateCurrentAccountView} />
        )
    }
  }

  return (
    <View>
      {conditionalRender()}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    paddingTop: 30,
    paddingLeft: 20
  },
  text: {
    fontSize: 22,
    margin: 10,
    fontFamily: 'FamiljenGrotesk'
  }
})