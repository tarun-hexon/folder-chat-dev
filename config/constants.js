import user from '../public/assets/user.svg';
import creditCardIcon from '../public/assets/credit-card.svg';
import settingsIcon from '../public/assets/settings.svg';
import {CreditCard, Keyboard, Settings, Upload, User, Edit, Trash2, MessagesSquare } from "lucide-react";
import showAllIcon from '../public/assets/Danswer-All.svg';
import gDriveIcon from '../public/assets/Danswer-google.svg';
import slackIcon from '../public/assets/Danswer-slack.svg';
import confluenceIcon from '../public/assets/Danswer-confluence.svg';
import gitPrsIcon from '../public/assets/Danswer-github.svg';
import webIcon from '../public/assets/Danswer-web.svg';
import filesIcon from '../public/assets/Danswer-doc.svg';
import fileIconB from '../public/assets/Danswer-doc-B.svg';
import gDriveIconB from '../public/assets/Danswer-google-B.svg'
import webB from '../public/assets/Danswer-web-B.svg'
import slackIconB from '../public/assets/Danswer-slack-B.svg'
import confluenceIconB from '../public/assets/Danswer-confluence-B.svg'
import gitIconB from '../public/assets/Danswer-github-B.svg';

export const selectOptions = [
    {
      id:'option_1',
      title: 'What kind of work you do?'
    },
    {
      id:'option_2',
      title: 'What is your role?'
    },
    {
      id:'option_3',
      title: 'Roughly how many people work at your company?'
    },
    {
      id:'option_4',
      title: 'What are you planning to use folder.chat for?'
    }
];

export const sidebarOptions = [
    {
        title: 'My Profile',
        icon: user
    },
    {
        title: 'Plan',
        icon: creditCardIcon
    },
    {
        title: 'Settings',
        icon: settingsIcon
    }
];

export const plans = [
  "Collaborative workspace",
  "Slack, GitHub, and more integrations",
  "Unlimited blocks for teams",
  "Unlimited file uploads",
  "30 day page history",
  "Invite up to 100 guests"
];

export const setting = [
  {
    title: 'My Profile',
    icon: User,
    id:'profile'
  },
  {
    title: 'Plans',
    icon: CreditCard,
    id:'plans'
  },
  {
    title: 'Settings',
    icon: Settings,
    id:'settings'
  },
  {
    title: 'Notification Settings',
    icon: Keyboard,
    id:'n-settings'
  },
];

export const folderOptions = [
  {
    id:'new-chat',
    title:'New Chat',
    icon: MessagesSquare
  },
  {
    id:'edit',
    title:'Edit',
    icon: Edit
  },
  // {
  //   id:'upload',
  //   title:'Upload New File',
  //   icon: Upload
  // },
  {
    id:"delete",
    title:'Delete',
    icon:Trash2
  }
];

export const advanceOption = [
  {
    id:'advance',
    title:'Show All',
    icon: showAllIcon
  },
  {
    id:'drive',
    title:'Google Drive',
    icon: gDriveIcon
  },
  {
    id:'slack',
    title:'Slack',
    icon: slackIcon
  },
  {
    id:'confluence',
    title:'Confluence',
    icon: confluenceIcon
  },
  {
    id:'git',
    title:'Github PRs',
    icon: gitPrsIcon
  },
  {
    id:'web',
    title:'Web',
    icon: webIcon
  },
  {
    id:'files',
    title:'Files',
    icon: filesIcon
  }
];

export function iconSelector(icon){
  if(icon === "web"){
      return webB
  }else if(icon === "file"){
      return fileIconB
  }else if(icon === "github"){
      return gitIconB
  }else if(icon === "slack"){
      return slackIconB
  }else if(icon === "confluence"){
      return confluenceIconB
  }else{
      return gDriveIconB
  }
};
