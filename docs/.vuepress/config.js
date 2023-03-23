const { resolve } = require('path')
const themeConfig = require('squarecrypto-vuepress-devkit-theme/config')

const title = 'Nostr Dev Kit Documentation'
const baseUrl = 'https://ndkit.com'
const githubUrl = 'https://github.com/NostrDevKit'
const themeColor = '#ffffff'

const docsSidebar = [
  {
    title: 'Documentation',
    collapsable: false,
    children: [
      {
        title: 'Introduction',
        path: '/introduction/',
        collapsable: true,
        children: [
          ['/introduction/use_cases', 'Use Cases'],
        ]
      },
      '/examples',
    ]
  },
  {
    title: 'API Reference',
    collapsable: false,
    children: [
      {
        title: "Rust",
        collapsable: true,
        children: [
          ['https://docs.rs/nostr-sdk/latest/nostr_sdk/', 'nostr-sdk'],
          ['https://docs.rs/nostr-sdk/latest/nostr/', 'nostr'],
        ]
      },
      ['https://github.com/arik-so/SwiftLightning/tree/master/Documentation', 'Swift']
    ],
  }
]

const tutorialSidebar = [
  {
    title: 'Tutorials',
    collapsable: false,
    children: [
      '/tutorials/hello-nostr',
      '/tutorials/coinstr-cli'
    ],
  }
]

const blogSidebar = [
  {
    title: 'Blog',
    collapsable: false,
    children: [
      ['/blog/', 'Articles'],
      ['/blog/tags/', 'Tags'],
      ['/blog/author/', 'Authors']
    ]
  }
]

module.exports = {
  title,
  description: 'NDK is the fastest way to build with the Nostr protocol',
  theme: resolve(__dirname, '../../node_modules/squarecrypto-vuepress-devkit-theme'),
  ...themeConfig({
    baseUrl,
    title,
    themeColor,
    tags: ['Bitcoin', 'Nostr', 'Lightning', 'NDK', 'Nostr Dev Kit', 'Documentation']
  }),
  themeConfig: {
    domain: baseUrl,
    logo: '/img/logo.svg',
    displayAllHeaders: false,
    repo: 'NostrDevKit/ndkit.com',
    docsDir: 'docs',
    docsBranch: 'main',
    search: true,
    editLinks: true,
    sidebarDepth: 0,
    nav: [
      {
        text: 'Docs',
        link: '/introduction/'
      },
      {
        text: 'Tutorials',
        link: '/tutorials/'
      },
      {
        text: 'Blog',
        link: '/blog/'
      },
      {
        text: 'GitHub',
        link: githubUrl,
        rel: 'noopener noreferrer'
      }
    ],
    sidebar: {
      '/_blog/': blogSidebar,
      '/blog/': blogSidebar,
      '/tutorials/': tutorialSidebar,
      '/': docsSidebar,
    },
    footer: {
      links: [
        {
          title: 'Docs',
          children: [
            {
              text: 'Introduction',
              link: '/introduction/'
            },
            {
              text: 'Examples',
              link: '/examples/'
            }
          ]
        },
        {
          title: 'Community',
          children: [
            {
              text: 'GitHub',
              link: githubUrl,
              rel: 'noopener noreferrer'
            },
            {
              text: 'Nostr',
              link: "https://snort.social/p/npub1ndkltu98tr2eupgv5y367cck7kgj96d56vzmz40mxa25v68evv0qv6ffdn",
              rel: 'noopener noreferrer'
            },
            {
              text: 'Code of Conduct',
              link: "/code_of_conduct",
              rel: 'noopener noreferrer'
            },
          ]
        },
        {
          title: 'More',
          children: [
            {
              text: 'Blog',
              link: '/blog/'
            }
          ]
        }
      ],
      copyright: 'Copyright © 2022 NDK Developers'
    }
  }
}
