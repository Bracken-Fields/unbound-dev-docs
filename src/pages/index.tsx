import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

function Hero() {
  return (
    <div className="hero-banner">
      <div className="hero-badge">SDK v1 · JavaScript · MIT License</div>
      <h1 className="hero-title">
        Build CX<br /><span>Without Limits</span>
      </h1>
      <p className="hero-subtitle">
        One JavaScript SDK. Full access to messaging, voice, video, AI,
        workflows, and data — from Node.js or the browser.
      </p>
      <div className="hero-actions">
        <Link to="/getting-started" className="btn-primary">
          Get Started →
        </Link>
        <Link to="/api-reference/overview" className="btn-secondary">
          API Reference
        </Link>
      </div>
      <div className="hero-install">
        <code style={{ fontFamily: 'inherit', fontSize: 'inherit', background: 'none', border: 'none', padding: 0, color: 'inherit' }}>
          npm install @unboundcx/sdk
        </code>
      </div>
    </div>
  );
}

type CardProps = {
  icon: string;
  title: string;
  description: string;
  to: string;
};

function Card({ icon, title, description, to }: CardProps) {
  return (
    <Link to={to} className="feature-card">
      <span className="card-icon">{icon}</span>
      <div className="card-title">{title}</div>
      <p className="card-desc">{description}</p>
    </Link>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Developer Docs" description="Unbound JavaScript SDK documentation — messaging, voice, video, AI, workflows, and more.">
      <Hero />
      <main className="features-section">
        <div className="features-heading">
          <h2>Everything in one SDK</h2>
          <p>Every Unbound capability — one unified interface.</p>
        </div>

        <div className="cards-grid">
          <Card icon="📱" title="Messaging" description="Send SMS, MMS, and email. Manage inboxes, templates, and campaigns." to="/api-reference/messaging" />
          <Card icon="📞" title="Voice" description="Make calls, run conferences, record, transcribe, and control in real time." to="/api-reference/voice" />
          <Card icon="📹" title="Video" description="Create rooms, manage participants, post-meeting analytics." to="/api-reference/video" />
          <Card icon="🤖" title="AI" description="Generative chat, TTS, real-time STT streaming, and data extraction." to="/api-reference/ai" />
          <Card icon="🔀" title="Task Router" description="Route contacts to agents with skills, priorities, and queue management." to="/api-reference/task-router" />
          <Card icon="💾" title="Objects" description="CRM-style data — flexible CRUD, queries, relationships, and schema management." to="/api-reference/objects" />
          <Card icon="🔄" title="Workflows" description="Visual automation flows built and run programmatically." to="/api-reference/workflows" />
          <Card icon="📁" title="Storage" description="Multi-region file storage with access control and progress tracking." to="/api-reference/storage" />
          <Card icon="⚡" title="Subscriptions" description="Real-time event streams via WebSocket for live UI updates." to="/api-reference/subscriptions" />
          <Card icon="☎️" title="Phone Numbers" description="Search, order, configure, and port numbers including full 10DLC." to="/api-reference/phone-numbers" />
          <Card icon="🏛️" title="Portals" description="Branded customer portals on your own domain." to="/api-reference/portals" />
          <Card icon="📊" title="Metrics" description="Real-time queue and agent performance dashboards." to="/api-reference/engagement-metrics" />
        </div>

        <div className="cta-banner">
          <h2>Start building in minutes</h2>
          <p>Install the SDK, authenticate, and send your first message.</p>
          <Link to="/getting-started" className="btn-primary">
            Getting Started →
          </Link>
        </div>
      </main>
    </Layout>
  );
}
