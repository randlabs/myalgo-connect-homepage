const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const algosdkPlugin = require('./src/docusaurus-plugin/algosdk/index');
const bufferPlugin = require('./src/docusaurus-plugin/buffer/index');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'MyAlgo Connect',
  tagline: 'MyAlgo Connect’s Developer Documentation. This documentation explains how to connect dapps to the Algorand blockchain through MyAlgo Connect.',
  url: 'https://connect.myalgo.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Rand Labs', // Usually your GitHub org/user name.
  projectName: 'MyAlgo Connect', // Usually your repo name.
  themeConfig: {
    metadatas: [
      {
        property: 'og:image',
        content: 'https://connect.myalgo.com/img/connect-icon.svg',
      },
      {name: 'twitter:card', content: 'summary_large_image'},
      {
        name: 'twitter:image',
        content: 'https://connect.myalgo.com/img/connect-icon.svg',
      },
      {name: 'twitter:site', content: '@randlabs'},
    ],
    googleAnalytics: {
      trackingID: 'UA-131115436-8',
    },
    hideableSidebar: false,
    colorMode: {
      // "light" | "dark"
      defaultMode: 'light',

      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: true,
    },
    navbar: {
      title: '',
      hideOnScroll: true,
      logo: {
        alt: 'MyAlgo Connect',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'introduction',
          position: 'right',
          label: 'Documentation',
          className: 'custom-item-in-nav',
        },
        {
          to: 'community',
          label: 'Community',
          position: 'right',
          className: 'custom-item-in-nav',
        },
        {
          href: 'https://github.com/randlabs/myalgo-connect/releases',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    image: 'img/connect-icon.svg',
    // footer: {
    //   style: 'dark',
    //   links: [
    //     {
    //       title: 'Docs',
    //       items: [
    //         {
    //           label: 'Tutorial',
    //           to: '/docs/introduction',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Community',
    //       items: [
    //         {
    //           label: 'Stack Overflow',
    //           href: 'https://stackoverflow.com/questions/tagged/docusaurus',
    //         },
    //         {
    //           label: 'Discord',
    //           href: 'https://discordapp.com/invite/docusaurus',
    //         },
    //         {
    //           label: 'Twitter',
    //           href: 'https://twitter.com/docusaurus',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'More',
    //       items: [
    //         {
    //           label: 'Blog',
    //           to: '/blog',
    //         },
    //         {
    //           label: 'GitHub',
    //           href: 'https://github.com/randlabs/myalgo-connect-homepage',
    //         },
    //       ],
    //     },
    //   ],
    //   copyright: `Copyright © ${new Date().getFullYear()} MyAlgo Connect, Powered by Rand Labs`,
    // },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/randlabs/myalgo-connect-homepage/edit/master',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    algosdkPlugin,
    bufferPlugin,
    'docusaurus-plugin-sass'
  ]
};
