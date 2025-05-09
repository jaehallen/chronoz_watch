import type { AppPages} from "./app-types";

//DICEBREAR LINK FOR AVATAR
export const AVATAR_SRC = 'https://api.dicebear.com/9.x/initials/svg?seed=Jessica&radius=50&fontWeight=900';

export const OPTIONS_LIST: AppPages[] = [
  {
    resource: 'settings',
    id: 'jobs',
    href: '#jobs',
    title: "Jobs",
  },
  {
    resource: 'settings',
    id: 'departments',
    href: "#departments",
    title: 'Departments',
  },
  {
    resource: 'settings',
    id: 'roles',
    href: '#roles',
    title: 'Roles',
  },
]

export const SETTINGS_TAB: AppPages[] = [
  {
    resource: 'settings',
    href: "#options",
    title: "Options",
    icon: 'playlist_add',
    id: 'options',
  },
  {
    resource: 'settings',
    href: "#access",
    title: "Access",
    icon: 'admin_panel_settings',
    id: 'access'
  },
  {
    resource: 'settings',
    href: "#alias",
    title: 'Alias',
    icon: 'domino_mask',
    id: 'alias',
  }
]

export const APP_PAGES: AppPages[] = [
  {
    resource: 'entries',
    href: '/entries',
    title: 'Entries',
    icon: 'punch_clock',
    id: 'entries',
  },
  {
    resource: 'timesheets',
    href: '/timesheets',
    title: 'Timesheets',
    icon: 'history',
    id: 'timesheets'
  },
  {
    resource: "users",
    href: "/users",
    title: "Users",
    icon: 'group',
    id: 'users',
  },
  {
    resource: "settings",
    href: "/settings",
    title: "Settings",
    icon: 'settings',
    id: 'settings',
  },
  {
    resource: "register",
    href: "/register",
    title: "Register",
    icon: 'person_add',
    id: 'register'
  }
]


//TESTING
export const TIMESHEETS_TAB: AppPages[] = [
  {
    resource: 'settings',
    href: "#clock-in",
    title: "Clock In",
    icon: 'timer',
    id: 'clock-in',
  },
  {
    resource: 'settings',
    href: "#access",
    title: "Access",
    icon: 'admin_panel_settings',
    id: 'access'
  },
  {
    resource: 'settings',
    href: "#alias",
    title: 'Alias',
    icon: 'domino_mask',
    id: 'alias',
  }
]
