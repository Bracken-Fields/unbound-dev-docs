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
            'api-reference/faxes',
            'api-reference/voice',
            'api-reference/video',
          ],
        },
        {
          type: 'category',
          label: 'AI',
          collapsed: false,
          items: [
            'api-reference/ai',
            'api-reference/knowledge-base',
          ],
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
            'api-reference/verification',
            'api-reference/external-oauth',
            'api-reference/record-types',
            'api-reference/layouts',
            'api-reference/google-calendar',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'CLI Reference',
      collapsed: false,
      items: [
        'cli/overview',
        {
          type: 'category',
          label: 'Commands',
          collapsed: false,
          items: [
            'cli/commands/contacts',
            'cli/commands/messaging',
            'cli/commands/voice',
            'cli/commands/video',
            'cli/commands/ai',
            'cli/commands/objects',
            'cli/commands/tasks',
            'cli/commands/workflows',
            'cli/commands/platform',
            'cli/commands/admin',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      items: [
        'reference/types',
        'reference/errors',
        'reference/limits',
        'reference/changelog',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/cli-quickstart',
        'guides/send-sms',
        'guides/make-call',
        'guides/stt-streaming',
        'guides/build-workflow',
        'guides/query-with-uoql',
        'guides/webhooks',
        'guides/task-router-quickstart',
        'guides/integrate-auth',
      ],
    },
  ],
};

export default sidebars;
