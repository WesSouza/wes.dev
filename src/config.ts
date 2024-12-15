export const SITE_TITLE = 'Wes Souza';
export const SITE_DESCRIPTION =
  'I’m a Staff Software Engineer working at Unqork in New York. Read more on my website.';

export const SITE_DOMAIN = 'wes.dev';

export const SRC_PATH = import.meta.dirname;

export const WES95_ACKNOWLEDGEMENTS_PATH = `/acknowledgements.txt`;
export const WES95_PATH = '/C/Wes95';
export const WES95_FONTS_PATH = `${WES95_PATH}/Fonts`;
export const WES95_MEDIA_PATH = `${WES95_PATH}/Media`;
export const WES95_SYSTEM_PATH = `${WES95_PATH}/System32`;

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
    showOnResume: false,
  },
  {
    type: 'article',
    href: 'https://dev.to/wes/cool-things-make-people-happy-3pci',
    goSlug: 'cool-things',
    title: 'Small Things to Make Others Happy',
    subtitle: 'DEV Community, March 2015',
    showOnResume: false,
  },

  // Projects
  {
    type: 'project',
    href: 'https://wes.dev/enhanced-youtube',
    goSlug: 'enhanced-youtube',
    title: 'Enhanced YouTube',
    description:
      "Safari Extension for visionOS that replaces the playback controls on youtube.com with a better user interface closer to Vision Pro's design language.",
    showOnResume: true,
  },
  {
    type: 'project',
    href: 'https://mastodon-flock.vercel.app',
    goSlug: 'mastodon-flock',
    title: 'Mastodon Flock',
    description:
      'Web app that allowed people to find their Twitter follows on Mastodon and other Fediverse compatible websites, designed with a retro Windows 95 look.',
    showOnResume: true,
  },
  {
    type: 'project',
    href: 'https://watchmirror.app',
    goSlug: 'watch-mirror',
    title: 'Watch Mirror',
    description:
      'Pair of Apple Watch app and Figma plugin that allows designers to preview designs and prototypes live on Apple Watch.',
    showOnResume: true,
  },

  // Other "go" redirects
  {
    type: 'link',
    href: 'https://mastodon.social/@wessouza',
    goSlug: 'mastodon',
  },
];
