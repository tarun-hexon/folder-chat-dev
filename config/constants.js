import user from '../public/assets/user.svg';
import creditCardIcon from '../public/assets/credit-card.svg';
import settingsIcon from '../public/assets/settings.svg';
import {Cloud,CreditCard,Github,Keyboard,LifeBuoy,LogOut,Mail,MessageSquare,Plus,PlusCircle,Settings,User,UserPlus,Users,} from "lucide-react"


export const selectOptions = [
    {
      title: 'What kind of work you do?'
    },
    {
      title: 'What is your role?'
    },
    {
      title: 'Roughly how many people work at your company?'
    },
    {
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


