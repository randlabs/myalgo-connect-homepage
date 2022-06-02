/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // tutorialSidebar:  [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  sidebar: [
    {
      type: 'doc',
      id: 'introduction',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/quickstart','getting-started/myalgo-connect-api','getting-started/choosing-network','getting-started/important-considerations'
      ],
    },
    {
      type: 'category',
      label: 'Interactive Examples',
      collapsed: false,
      items: [
      'interactive-examples/connect','interactive-examples/PaymentTransaction', 'interactive-examples/GroupedTransaction', 
      'interactive-examples/ASATransacation', 'interactive-examples/ApplOptIn', 'interactive-examples/ApplCloseOut', 
      'interactive-examples/PaymentWithTeal', 'interactive-examples/ApplCreateTransaction', 'interactive-examples/ApplDeleteTransaction', 
      'interactive-examples/ApplUpdateTransaction', 'interactive-examples/PaymentTransactionOverrideSigner',
      'interactive-examples/TealSign'
      ],
    },
  ],
};
