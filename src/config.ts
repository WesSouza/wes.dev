// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Wes Souza';
export const SITE_DESCRIPTION =
  'I’m a Staff Software Engineer working at Unqork in New York. Read more about me on the website.';

export const SITE_DOMAIN = 'wes.dev';

export const SITE_GO_LINKS = [
  // Listed Articles
  {
    type: 'article',
    href: 'https://dev.to/wes/the-next-twitter-20ij',
    goSlug: 'next-twitter',
    title: 'The Next Twitter',
    subtitle: 'DEV Community, November 2022',
    showOnResume: false,
  },
  {
    type: 'article',
    href: 'https://dev.to/wes/trpc-move-fast-and-break-nothing-usereactnyc-3g08',
    goSlug: 'trpc-talk',
    title: 'tRPC: Move Fast and Break Nothing',
    subtitle: 'useReactNYC, August 2022',
    showOnResume: true,
  },
  {
    type: 'article',
    href: 'https://dev.to/wes/simple-react-state-management-29g',
    goSlug: 'immer-state',
    title: 'Simple React State Management',
    subtitle: 'DEV Community, June 2020',
    showOnResume: true,
  },
  {
    type: 'article',
    href: 'https://dev.to/wes/opening-a-pr-a-primer-4kgc',
    goSlug: 'pull-request',
    title: 'Pull Requests: A Primer',
    subtitle: 'DEV Community, February 2020',
    showOnResume: true,
  },
  {
    type: 'article',
    href: 'https://dev.to/wes/why-i-became-and-still-am-a-web-developer-1k3',
    goSlug: 'web-developer',
    title: 'Why I Became, and still am, a Web Developer',
    subtitle: 'DEV Community, May 2019',
    showOnResume: true,
  },
  {
    type: 'article',
    href: 'https://dev.to/wes/bringing-components-to-legacy-code-2m00',
    goSlug: 'components-talk',
    title: 'Bringing Components to Legacy Code',
    subtitle: 'ReactNYC, September 2017',
    showOnResume: true,
  },
  {
    type: 'article',
    href: 'https://dev.to/wes/keeping-control-of-the-front-end-ag7',
    goSlug: 'front-end',
    title: 'Keeping Control of the Front-end',
    subtitle: 'DEV Community, February 2016',
    showOnResume: true,
  },
  {
    type: 'article',
    href: 'https://dev.to/wes/cool-things-make-people-happy-3pci',
    goSlug: 'cool-things',
    title: 'Small Things to Make Others Happy',
    subtitle: 'DEV Community, March 2015',
    showOnResume: true,
  },

  // Projects
  {
    type: 'project',
    href: 'https://mastodon-flock.vercel.app',
    goSlug: 'mastodon-flock',
    title: 'Mastodon Flock',
    description:
      'Web app that allows you to find your Twitter follows on Mastodon and other Fediverse compatible website, designed with a retro Windows 95 look.',
    showOnResume: true,
  },

  // Projects
  {
    type: 'project',
    href: 'https://watchmirror.app',
    goSlug: 'watch-mirror',
    title: 'Watch Mirror',
    description:
      'Pair of Apple Watch app and Figma plugin that allow you to live preview designs and prototypes on the Apple Watch.',
    showOnResume: true,
  },

  // Other "go" redirects
  {
    type: 'link',
    href: 'https://mastodon.social/@wessouza',
    goSlug: 'mastodon',
  },
];
