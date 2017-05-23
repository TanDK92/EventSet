import { Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import registerScreens from './screens';

// screen related book keeping
registerScreens();

const tabs = [
     {
    label: 'Login',
    screen: 'example.Login',
    icon: require('../img/list.png'),
},{
    label: 'Navigation',
    screen: 'example.Types',
    icon: require('../img/list.png'),
    title: 'Navigation Types',
}, {
    label: 'Action',
    screen: 'example.Actions',
    icon: require('../img/swap.png'),
}, {
    label: 'EventIndex',
    screen: 'example.EventIndex',
    icon: require('../img/swap.png'),
    title: 'Events',
}];

Navigation.startSingleScreenApp({
  screen: {
    screen: 'example.Login', // unique ID registered with Navigation.registerScreen
  },
});

// this will start our app
// Navigation.startTabBasedApp({
//     tabs,
//     tabsStyle: {
//         tabBarBackgroundColor: '#003a66',
//         navBarButtonColor: '#ffffff',
//         tabBarButtonColor: '#ffffff',
//         navBarTextColor: '#ffffff',
//         tabBarSelectedButtonColor: '#ff505c',
//         navigationBarColor: '#003a66',
//         navBarBackgroundColor: '#003a66',
//         statusBarColor: '#002b4c',
//         tabFontFamily: 'BioRhyme-Bold',
//     },
//     appStyle: {
//         tabBarBackgroundColor: '#003a66',
//         navBarButtonColor: '#ffffff',
//         tabBarButtonColor: '#ffffff',
//         navBarTextColor: '#ffffff',
//         tabBarSelectedButtonColor: '#ff505c',
//         navigationBarColor: '#003a66',
//         navBarBackgroundColor: '#003a66',
//         statusBarColor: '#002b4c',
//         tabFontFamily: 'BioRhyme-Bold',
//     },
//     drawer: {
//         left: {
//             screen: 'example.Types.Drawer'
//         }
//     }
// });
