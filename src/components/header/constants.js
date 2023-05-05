import { AUDITOR, CUSTOMER } from "../../redux/actions/types.js"

export const authorizedPages = [
  {
    id: 1,
    name: "Audits",
    menuOptions: [
      {
        id: 111,
        role: AUDITOR,
        itemName: "My audits",
        link: '/profile/projects'
      },
      {
        id: 112,
        role: AUDITOR,
        itemName: "My audit requests",
        link: '/profile/audits'
      },
      {
        id: 113,
        role: AUDITOR,
        itemName: "Search for auditors",
        link: '/auditors'
      },
      {
        id: 114,
        role: CUSTOMER,
        itemName: "My audits",
        link: '/profile/audits'
      },
      {
        id: 116,
        role: CUSTOMER,
        itemName: "Search for auditors",
        link: '/auditors'
      },
    ],
  },
  {
    id: 2,
    name: "Projects",
    menuOptions: [
      {
        id: 221,
        role: AUDITOR,
        itemName: "Search for projects",
        link: '/projects'
      },
      {
        id: 222,
        role: CUSTOMER,
        itemName: "My projects",
        link: '/profile/projects'
      },
      {
        id: 223,
        role: CUSTOMER,
        itemName: "Create project",
        link: '/create-project'
      },
      {
        id: 224,
        role: CUSTOMER,
        itemName: "Search for projects",
        link: '/projects'
      },
    ],
  },
];

export const pages = [
  {
    id: 1,
    name: "Product",
    menuOptions: [
      {
        id: 11,
        itemName: "AuditDB",
        link: "/audit-db",
      },
      {
        id: 12,
        itemName: "For customers",
        link: "/for-customers",
      },
      {
        id: 13,
        itemName: "For auditors",
        link: "/for-auditors",
      },
    ],
  },
  {
    id: 2,
    name: "About Us",
    menuOptions: [
      {
        id: 23,
        itemName: "Contact us",
        link: "/contact-us",
      },
      {
        id: 24,
        itemName: "FAQ",
        link: "/FAQ",
      },
      {
        id: 25,
        itemName: "Screencast",
        link: "https://youtu.be/J7L4yAhS6Rw",
      },
    ],
  },
];
