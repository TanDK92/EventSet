import { Navigation } from 'react-native-navigation';

import Types from './Types';
import Actions from './Actions';

import Push from './types/Push';
import Drawer from './types/Drawer';
import LightBox from './types/LightBox';
import Notification from './types/Notification';
import Modal from './types/Modal';
import TopTabs from './types/TopTabs';
import TabOne from './types/tabs/TabOne';
import TabTwo from './types/tabs/TabTwo';

import Login from './Login';
import Main from './Main';
import EventInfo from './EventInfo';
import VotePage from './VotePage';
import VoteResult from './VoteResult';
import CreateEvent from './CreateEvent';
import InviteFriend from './InviteFriend';
import MemberList from './MemberList';

export default function () {
    Navigation.registerComponent('example.Types', () => Types);
    Navigation.registerComponent('example.Actions', () => Actions);
    Navigation.registerComponent('example.Login', () => Login);
    Navigation.registerComponent('example.CreateEvent', () => CreateEvent);
    Navigation.registerComponent('example.Main', () => Main);
    Navigation.registerComponent('example.EventInfo', () => EventInfo);
    Navigation.registerComponent('example.VotePage', () => VotePage);
    Navigation.registerComponent('example.VoteResult', () => VoteResult);
    Navigation.registerComponent('example.InviteFriend', () => InviteFriend);
    Navigation.registerComponent('example.MemberList', () => MemberList);

    Navigation.registerComponent('example.Types.Push', () => Push);
    Navigation.registerComponent('example.Types.Drawer', () => Drawer);
    Navigation.registerComponent('example.Types.Screen', () => Drawer);
    Navigation.registerComponent('example.Types.Modal', () => Modal);
    Navigation.registerComponent('example.Types.LightBox', () => LightBox);
    Navigation.registerComponent('example.Types.Notification', () => Notification);
    Navigation.registerComponent('example.Types.TopTabs', () => TopTabs);
    Navigation.registerComponent('example.Types.TopTabs.TabOne', () => TabOne);
    Navigation.registerComponent('example.Types.TopTabs.TabTwo', () => TabTwo);
}
