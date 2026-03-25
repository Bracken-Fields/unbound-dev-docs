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
        'api-reference/messaging',
        'api-reference/voice',
        'api-reference/video',
        'api-reference/ai',
        'api-reference/objects',
        'api-reference/workflows',
        'api-reference/storage',
        'api-reference/subscriptions',
        'api-reference/phone-numbers',
        'api-reference/engagement-metrics',
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
      ],
    },
  ],
};

export default sidebars;
