export interface EventItem {
  title: string;
  /** Display date string, e.g. "March 9, 2026" */
  date: string;
  time?: string;
  image: string;
  href?: string;
  newTab?: boolean;
  /** Used only on the homepage to trigger a modal */
  modalId?: string;
  /** ISO date (YYYY-MM-DD) used for past/upcoming comparison */
  isoDate: string;
  /** How the image fills the card — defaults to 'cover'; use 'contain' for banner-style images */
  objectFit?: 'cover' | 'contain';
}

export const allEvents: EventItem[] = [
  {
    title: 'Harmony Schools Simulation Workshop',
    date: 'March 9, 2026',
    time: '8:00 am - 4:00 pm',
    image: '/images/logos/logo-color.png',
    modalId: 'harmony-simulations-modal',
    isoDate: '2026-03-09',
  },
  {
    title: 'Community Conversation on Educating Character',
    date: 'March 10, 2026',
    time: '5:00 pm - 9:00 pm',
    image: '/images/logos/logo-color.png',
    href: 'https://infohub.austincc.edu/blog/2026/02/19/youre-invited-community-conversation-on-freedom-virtue-and-community/',
    newTab: true,
    isoDate: '2026-03-10',
  },
  {
    title: 'CTXLF - From Idea to Action',
    date: 'March 11, 2026',
    time: '3:30 pm - 7:30 pm',
    image: '/images/ctxlf-logo.webp',
    href: 'https://ctxlearningfestival.com/festival-calendar/business-in-a-box-from-idea-to-action',
    newTab: true,
    isoDate: '2026-03-11',
  },
  {
    title: 'CTXLF - Strategic Communication Workshop',
    date: 'March 12, 2026',
    time: '2:30 pm - 4:30 pm',
    image: '/images/ctxlf-logo.webp',
    href: 'https://ctxlearningfestival.com/festival-calendar/strategic-communication-workshop',
    newTab: true,
    isoDate: '2026-03-12',
  },
  {
    title: 'CTXLF - Great Questions Community Seminar',
    date: 'March 12, 2026',
    time: '6:00 pm - 9:00 pm',
    image: '/images/ctxlf-logo.webp',
    href: 'https://ctxlearningfestival.com/festival-calendar/great-questions-community-seminar',
    newTab: true,
    isoDate: '2026-03-12',
  },
  {
    title: 'ACM/IEEE Austin: March Tech Talks & Community Showcase',
    date: 'March 25, 2026',
    time: '6:00 pm - 8:00 pm',
    image: 'https://secure.meetupstatic.com/photos/event/4/2/0/d/highres_530236909.jpeg',
    href: 'https://www.meetup.com/acm-austin/events/313448439/',
    newTab: true,
    isoDate: '2026-03-25',
  },
  {
    title: 'Strategic Communication Workshop – ACC Highland',
    date: 'March 24, 2026',
    time: '4:00 pm - 6:00 pm',
    image: '/images/strategic-comm-workshop-spring-2026.png',
    href: 'https://forms.gle/FnAQByAaGNyjwvLx6',
    newTab: true,
    isoDate: '2026-03-24',
  },
  {
    title: '"Depolarizing Within" Workshop',
    date: 'March 26, 2026',
    time: '4:30 pm - 6:30 pm',
    image: '/images/depolarizing-workshop-spring-2026.png',
    href: 'https://forms.gle/hWj4z9utML1xGNm2A',
    newTab: true,
    isoDate: '2026-03-26',
  },
  {
    title: 'Red/Blue Workshop',
    date: 'April 9, 2026',
    time: '4:30 pm - 6:30 pm',
    image: '/images/red-blue-workshop-spring-2026.png',
    href: 'https://forms.gle/CEwYcWwUxd5CCp8H7',
    newTab: true,
    isoDate: '2026-04-09',
  },
  {
    title: 'Central Texas Law Summit',
    date: 'March 27, 2026',
    time: '10:00 am - 4:30 pm',
    image: '/images/ctls.webp',
    objectFit: 'contain',
    href: 'https://www.eventbrite.com/e/central-texas-law-summit-tickets-1981875039594',
    newTab: true,
    isoDate: '2026-03-27',
  },
  {
    title: 'Strategic Communication Workshop – ACC Round Rock',
    date: 'April 14, 2026',
    time: '1:00 pm - 3:00 pm',
    image: '/images/strategic-comm-workshop-spring-2026.png',
    href: 'https://forms.gle/FnAQByAaGNyjwvLx6',
    newTab: true,
    isoDate: '2026-04-14',
  },
];

const now = new Date();

const byDate = (a: EventItem, b: EventItem) => a.isoDate.localeCompare(b.isoDate);

/** Events where the event day has not yet ended, sorted soonest first */
export const upcomingEvents = allEvents
  .filter((e) => new Date(e.isoDate + 'T23:59:59') >= now)
  .sort(byDate);

/** Events where the event day has already passed, sorted most recent first */
export const pastEvents = allEvents
  .filter((e) => new Date(e.isoDate + 'T23:59:59') < now)
  .sort((a, b) => b.isoDate.localeCompare(a.isoDate));
