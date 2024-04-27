import {
  fetchEmailsBene
 } from '@/app/lib/actions';

import Cookies from 'js-cookie';

const beneId = Cookies.get('beneId') || 'be_123456';

export const mails2 = fetchEmailsBene(beneId);
 
export const mails = [
  {
    id: 'first-onboarding',
    name: '#1 : Get started',
    email: 'onboarding@superpe.in',
    subject: 'First step to get your onboarding started',
    text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
    date: '2024-04-20T09:00:00',
    read: false,
    labels: ['#1', 'onboarding', 'important']
  },
  {
    id: 'second-integration',
    name: '#2 : Integrate with store',
    email: 'onboarding@superpe.in',
    subject: 'Integrate with your shopify right away',
    text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
    date: '2024-04-20T09:00:00',
    read: false,
    labels: ['#2', 'integration', 'important']
  },
  {
    id: 'third-golive',
    name: '#3 : All set for payments',
    email: 'onboarding@superpe.in',
    subject: "That's it! Let's accept your first payment",
    text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.\n\nPlease come prepared with any questions or insights you may have. Looking forward to our meeting!\n\nBest regards, William",
    date: '2024-04-20T09:00:00',
    read: false,
    labels: ['#3', 'go live', 'important']
  },
  {
    id: '3e7c3f6d-bdf5-46ae-8d90-171300f27ae2',
    name: 'Rishabh Jain',
    email: 'rj@superpe.in',
    subject: "I'm glad to see you here",
    text: "Hey there! \n\n I'm Rishabh, founder of SuperPe. \n We are super excited to have you onboard & welcome you to the SuperPe family. We'll do everything possible to make sure you have a great experience with us.\n\nThanks,\nRJ\nFounder ✦ SuperPe",
    date: '2023-04-10T11:45:00',
    read: true,
    labels: ['personal']
  }
];

export type Mail = (typeof mails)[number];

export const accounts = [
  {
    label: 'Shopify',
    email: 'Shopify Docs',
    icon: (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' fill='#fff'>
        <path d='M388.3 104.1a4.7 4.7 0 0 0 -4.4-4c-2 0-37.2-.8-37.2-.8s-21.6-20.8-29.6-28.8V503.2L442.8 472S388.7 106.5 388.3 104.1zM288.7 70.5a116.7 116.7 0 0 0 -7.2-17.6C271 32.9 255.4 22 237 22a15 15 0 0 0 -4 .4c-.4-.8-1.2-1.2-1.6-2C223.4 11.6 213 7.6 200.6 8c-24 .8-48 18-67.3 48.8-13.6 21.6-24 48.8-26.8 70.1-27.6 8.4-46.8 14.4-47.2 14.8-14 4.4-14.4 4.8-16 18-1.2 10-38 291.8-38 291.8L307.9 504V65.7a41.7 41.7 0 0 0 -4.4 .4S297.9 67.7 288.7 70.5zM233.4 87.7c-16 4.8-33.6 10.4-50.8 15.6 4.8-18.8 14.4-37.6 25.6-50 4.4-4.4 10.4-9.6 17.2-12.8C232.2 54.9 233.8 74.5 233.4 87.7zM200.6 24.4A27.5 27.5 0 0 1 215 28c-6.4 3.2-12.8 8.4-18.8 14.4-15.2 16.4-26.8 42-31.6 66.5-14.4 4.4-28.8 8.8-42 12.8C131.3 83.3 163.8 25.2 200.6 24.4zM154.2 244.6c1.6 25.6 69.3 31.2 73.3 91.7 2.8 47.6-25.2 80.1-65.7 82.5-48.8 3.2-75.7-25.6-75.7-25.6l10.4-44s26.8 20.4 48.4 18.8c14-.8 19.2-12.4 18.8-20.4-2-33.6-57.2-31.6-60.8-86.9-3.2-46.4 27.2-93.3 94.5-97.7 26-1.6 39.2 4.8 39.2 4.8L221.4 225.4s-17.2-8-37.6-6.4C154.2 221 153.8 239.8 154.2 244.6zM249.4 82.9c0-12-1.6-29.2-7.2-43.6 18.4 3.6 27.2 24 31.2 36.4Q262.6 78.7 249.4 82.9z' />
      </svg>
    )
  },
  {
    label: 'Website',
    email: 'Web Docs',
    icon: (
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='#fff'>
        <path
          className='fa-secondary'
          opacity='.4'
          d='M96 96a32 32 0 1 0 0 64 32 32 0 1 0 0-64zM448 480c35.3 0 64-28.7 64-64V224L0 224V416c0 35.3 28.7 64 64 64l384 0z'
        />
        <path
          className='fa-primary'
          d='M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V224H0V96zm64 32a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm120-24c-13.3 0-24 10.7-24 24s10.7 24 24 24H424c13.3 0 24-10.7 24-24s-10.7-24-24-24H184z'
        />
      </svg>
    )
  }
];

export type Account = (typeof accounts)[number];

export const contacts = [
  {
    name: 'Emma Johnson',
    email: 'emma.johnson@example.com'
  },
  {
    name: 'Liam Wilson',
    email: 'liam.wilson@example.com'
  },
  {
    name: 'Olivia Davis',
    email: 'olivia.davis@example.com'
  },
  {
    name: 'Noah Martinez',
    email: 'noah.martinez@example.com'
  },
  {
    name: 'Ava Taylor',
    email: 'ava.taylor@example.com'
  },
  {
    name: 'Lucas Brown',
    email: 'lucas.brown@example.com'
  },
  {
    name: 'Sophia Smith',
    email: 'sophia.smith@example.com'
  },
  {
    name: 'Ethan Wilson',
    email: 'ethan.wilson@example.com'
  },
  {
    name: 'Isabella Jackson',
    email: 'isabella.jackson@example.com'
  },
  {
    name: 'Mia Clark',
    email: 'mia.clark@example.com'
  },
  {
    name: 'Mason Lee',
    email: 'mason.lee@example.com'
  },
  {
    name: 'Layla Harris',
    email: 'layla.harris@example.com'
  },
  {
    name: 'William Anderson',
    email: 'william.anderson@example.com'
  },
  {
    name: 'Ella White',
    email: 'ella.white@example.com'
  },
  {
    name: 'James Thomas',
    email: 'james.thomas@example.com'
  },
  {
    name: 'Harper Lewis',
    email: 'harper.lewis@example.com'
  },
  {
    name: 'Benjamin Moore',
    email: 'benjamin.moore@example.com'
  },
  {
    name: 'Aria Hall',
    email: 'aria.hall@example.com'
  },
  {
    name: 'Henry Turner',
    email: 'henry.turner@example.com'
  },
  {
    name: 'Scarlett Adams',
    email: 'scarlett.adams@example.com'
  }
];

export type Contact = (typeof contacts)[number];
