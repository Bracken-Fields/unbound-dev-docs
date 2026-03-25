import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'getting-started',
      label: '🚀 Getting Started',
    },
    {
      type: 'category',
      label: 'Concepts',
      collapsed: false,
      items: ['concepts/concepts-overview'],
    },
    {
      type: 'category',
      label: 'SDK',
      collapsed: false,
      items: [
        'sdk/installation',
        'sdk/authentication',
        'sdk/configuration',
        'sdk/error-handling',
        'sdk/transports',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'api-reference/overview',
        {
          type: 'category',
          label: 'Communication',
          collapsed: false,
          items: [
            'api-reference/messaging',
            'api-reference/voice',
            'api-reference/video',
          ],
        },
        {
          type: 'category',
          label: 'AI',
          collapsed: false,
          items: ['api-reference/ai'],
        },
        {
          type: 'category',
          label: 'Contact Center',
          collapsed: false,
          items: [
            'api-reference/task-router',
            'api-reference/engagement-metrics',
          ],
        },
        {
          type: 'category',
          label: 'Data & Automation',
          collapsed: false,
          items: [
            'api-reference/objects',
            'api-reference/uoql',
            'api-reference/workflows',
            'api-reference/notes',
            'api-reference/storage',
          ],
        },
        {
          type: 'category',
          label: 'Platform',
          collapsed: false,
          items: [
            'api-reference/subscriptions',
            'api-reference/phone-numbers',
            'api-reference/sip-endpoints',
            'api-reference/portals',
            'api-reference/lookup',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/send-sms',
        'guides/make-call',
        'guides/stt-streaming',
        'guides/build-workflow',
        'guides/webhooks',
        'guides/task-router-quickstart',
      ],
    },
  ],
};

export default sidebars;
