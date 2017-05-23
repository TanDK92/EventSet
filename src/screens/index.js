import { Navigation } from 'react-native-navigation';

import Login from './Login';
import Signup from './Signup';
import Main from './Main';
import EventInfo from './EventInfo';
import VotePage from './VotePage';
import VoteResult from './VoteResult';
import CreateEvent from './CreateEvent';
import InviteFriend from './InviteFriend';
import MemberList from './MemberList';
import AddDatetime from './AddDatetime';
import AddLocation from './AddLocation';

export default function () {
    Navigation.registerComponent('example.Login', () => Login);
    Navigation.registerComponent('example.Signup', () => Signup);
    Navigation.registerComponent('example.CreateEvent', () => CreateEvent);
    Navigation.registerComponent('example.Main', () => Main);
    Navigation.registerComponent('example.EventInfo', () => EventInfo);
    Navigation.registerComponent('example.VotePage', () => VotePage);
    Navigation.registerComponent('example.VoteResult', () => VoteResult);
    Navigation.registerComponent('example.InviteFriend', () => InviteFriend);
    Navigation.registerComponent('example.MemberList', () => MemberList);
    Navigation.registerComponent('example.AddLocation', () => AddLocation);
};
