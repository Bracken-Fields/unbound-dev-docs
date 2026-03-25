import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Unbound Developer Docs',
  tagline: 'Build powerful CX experiences with the Unbound SDK',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://dev.unbound.cx',
  baseUrl: '/',

  organizationName: 'cameronjweeks',
  projectName: 'unbound-dev-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/unbound-og.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Unbound',
        src: 'img/logo-color.png',
        srcDark: 'img/logo-white.png',
        href: '/',
        width: 120,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/api-reference/overview',
          position: 'left',
          label: 'API Reference',
        },
        {
          href: 'https://unbound.cx',
          label: 'unbound.cx',
          position: 'right',
        },
        {
          href: 'https://github.com/cameronjweeks/marketing_unbound_cx',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/getting-started' },
            { label: 'API Reference', to: '/api-reference/overview' },
            { label: 'SDK', to: '/sdk/installation' },
          ],
        },
        {
          title: 'Platform',
          items: [
            { label: 'unbound.cx', href: 'https://unbound.cx' },
            { label: 'Support', href: 'mailto:support@unbound.cx' },
            { label: 'Status', href: 'https://status.unbound.cx' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Unbound. CX Without Limits.`,
    },
    prism: {
      theme: prismThemes.oneDark,
      darkTheme: prismThemes.oneDark,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;
