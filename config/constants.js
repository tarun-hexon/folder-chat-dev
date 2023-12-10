import settingUserIcon from '../public/assets/Settings-MyProfile.svg';
import creditCardIcon from '../public/assets/credit-card.svg';
import settingsIcon from '../public/assets/settings.svg';



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
        icon: settingUserIcon
    },
    {
        title: 'Plan',
        icon: creditCardIcon
    },
    {
        title: 'Settings',
        icon: settingsIcon
    }
]