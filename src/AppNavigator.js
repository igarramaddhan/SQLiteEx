import { DrawerNavigator, StackNavigator } from 'react-navigation';
import React from 'react';
import { Button } from 'react-native';
import Main from './screens/Main';

const StackApp = StackNavigator({
  Main: {
    screen: Main,
    navigationOptions: ({ navigation }) => ({
      title: 'Main'
    })
  }
});

export default StackApp;
