const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const algosdkPlugin = require('./src/docusaurus-plugin/algosdk/index');
const bufferPlugin = require('./src/docusaurus-plugin/buffer/index');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'MyAlgo Connect',
  tagline: 'MyAlgoConnect Developer Documentation. This documentation explains how to connect Dapps to the Algorand blockchain through MyAlgo Connect.',
  url: 'https://connect.myalgo.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Rand Labs', // Usually your GitHub org/user name.
  projectName: 'MyAlgo Connect', // Usually your repo name.
  themeConfig: {
    metadata: [
      {
        property: 'og:image',
        content: 'https://connect.myalgo.com/img/connect-icon.png',
      },
      {name: 'twitter:card', content: 'summary_large_image'},
      {
        name: 'twitter:image',
        content: 'https://connect.myalgo.com/img/connect-icon.png',
      },
      {name: 'twitter:site', content: '@randlabs'},
    ],
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
    docs: {
      sidebar: {
        hideable: false
      }
    },
    image: 'img/connect-icon.svg',
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
          editUrl: 'https://github.com/randlabs/myalgo-connect-homepage/edit/master',
        },
        googleAnalytics: {
          trackingID: 'UA-131115436-8',
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
