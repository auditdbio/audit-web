import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
const report = JSON.parse(localStorage.getItem('report') || '{}');

const auditId = report.auditId ? report.auditId : Date.now();

export const authorizedPages = [
  {
    id: 1,
    name: 'Audits',
    menuOptions: [
      {
        id: 111,
        role: AUDITOR,
        itemName: 'My audits',
        link: '/profile/audits',
      },
      {
        id: 112,
        role: AUDITOR,
        itemName: 'My audit requests',
        link: '/profile/audit-requests',
      },
      {
        id: 113,
        role: AUDITOR,
        itemName: 'Search for auditors',
        link: '/auditors',
      },
      {
        id: 114,
        role: CUSTOMER,
        itemName: 'My audits',
        link: '/profile/audits',
      },
      {
        id: 116,
        role: CUSTOMER,
        itemName: 'Search for auditors',
        link: '/auditors',
      },
    ],
  },
  {
    id: 2,
    name: 'Projects',
    menuOptions: [
      {
        id: 221,
        role: AUDITOR,
        itemName: 'Search for projects',
        link: '/projects',
      },
      {
        id: 222,
        role: CUSTOMER,
        itemName: 'My projects',
        link: '/profile/projects',
      },
      {
        id: 223,
        role: CUSTOMER,
        itemName: 'Create project',
        link: '/create-project',
      },
      {
        id: 224,
        role: CUSTOMER,
        itemName: 'Search for projects',
        link: '/projects',
      },
    ],
  },
  {
    id: 3,
    name: 'Tools',
    menuOptions: [
      {
        id: 331,
        role: AUDITOR,
        itemName: 'Audit builder',
        link: `/audit-builder/${auditId}`,
      },
      {
        id: 3312,
        role: CUSTOMER,
        itemName: 'Audit builder',
        link: `/audit-builder/${auditId}`,
      },
    ],
  },
];

export const pages = [
  {
    id: 1,
    name: 'Product',
    menuOptions: [
      {
        id: 11,
        itemName: 'AuditDB',
        link: '/audit-db',
      },
      {
        id: 12,
        itemName: 'For customers',
        link: '/for-customers',
      },
      {
        id: 13,
        itemName: 'For auditors',
        link: '/for-auditors',
      },
    ],
  },
  {
    id: 3,
    name: 'Tools',
    menuOptions: [
      {
        id: 31,
        itemName: 'Audit builder',
        link: `/audit-builder/${auditId}`,
      },
    ],
  },
  {
    id: 2,
    name: 'About Us',
    menuOptions: [
      {
        id: 23,
        itemName: 'Contact us',
        link: '/contact-us',
      },
      {
        id: 24,
        itemName: 'FAQ',
        link: '/FAQ',
      },
      {
        id: 25,
        itemName: 'Screencast',
        link: 'https://youtu.be/J7L4yAhS6Rw',
      },
    ],
  },
];
