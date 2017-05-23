import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import registerScreens from './screens';

// screen related book keeping
registerScreens();

Navigation.startSingleScreenApp({
  screen: {
    screen: 'example.Login', // unique ID registered with Navigation.registerScreen
  },
});
