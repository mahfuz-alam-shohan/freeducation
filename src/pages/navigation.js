import { iconDashboard, iconHome, iconManagement, iconProfile, iconUsers } from './templates/icons.js';

export function getNavigation(role) {
  const nav = [
    {
      title: 'Public',
      items: [{ key: 'home', href: '/', label: 'Home', icon: iconHome }],
    },
  ];

  if (!role) return nav;

  nav.push({
    title: 'Workspace',
    items: [
      { key: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: iconDashboard },
      { key: 'profile', href: '/profile', label: 'Profile', icon: iconProfile },
    ],
  });

  if (role === 'admin') {
    nav.push({
      title: 'Management',
      collapsible: true,
      expandedKeys: ['users'],
      key: 'management',
      icon: iconManagement,
      items: [{ key: 'users', href: '/users', label: 'Users', icon: iconUsers }],
    });
  }

  return nav;
}
