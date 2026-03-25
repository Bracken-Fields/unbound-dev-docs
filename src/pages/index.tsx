import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

function Hero() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #020331 0%, #0a0d3a 60%, #020331 100%)',
      padding: '80px 40px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(29, 148, 154, 0.2)',
    }}>
      <div style={{
        display: 'inline-block',
        background: 'rgba(29, 148, 154, 0.15)',
        border: '1px solid rgba(29, 148, 154, 0.4)',
        color: '#1D949A',
        padding: '4px 14px',
        borderRadius: '20px',
        fontSize: '0.78rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '20px',
      }}>
        SDK v1 · JavaScript
      </div>

      <h1 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: '3rem',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '16px',
        lineHeight: 1.15,
      }}>
        Build CX Without Limits
      </h1>

      <p style={{
        fontSize: '1.15rem',
        color: 'rgba(255,255,255,0.65)',
        maxWidth: '560px',
        margin: '0 auto 40px',
        lineHeight: 1.6,
      }}>
        The Unbound JavaScript SDK gives you one unified interface to messaging,
        voice, video, AI, and data — from Node.js or the browser.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          to="/getting-started"
          style={{
            background: '#1D949A',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            textDecoration: 'none',
          }}
        >
          Get Started →
        </Link>
        <Link
          to="/api-reference/overview"
          style={{
            background: 'rgba(29,148,154,0.1)',
            border: '1px solid rgba(29,148,154,0.35)',
            color: '#1D949A',
            padding: '12px 28px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            textDecoration: 'none',
          }}
        >
          API Reference
        </Link>
      </div>

      <div style={{ marginTop: '40px' }}>
        <code style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(29,148,154,0.2)',
          borderRadius: '8px',
          padding: '10px 20px',
          color: '#1D949A',
          fontSize: '0.95rem',
          fontFamily: 'monospace',
        }}>
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
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'rgba(29,148,154,0.04)',
        border: '1px solid rgba(29,148,154,0.18)',
        borderRadius: '12px',
        padding: '24px',
        transition: 'border-color 0.2s',
        height: '100%',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#1D949A')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(29,148,154,0.18)')}
      >
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{icon}</div>
        <h3 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.05rem',
          fontWeight: 700,
          marginBottom: '8px',
          color: 'var(--ifm-heading-color)',
        }}>{title}</h3>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--ifm-color-secondary)',
          margin: 0,
          lineHeight: 1.55,
        }}>{description}</p>
      </div>
    </Link>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Developer Docs" description="Unbound JavaScript SDK documentation">
      <Hero />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.6rem',
          fontWeight: 700,
          marginBottom: '8px',
          textAlign: 'center',
        }}>Everything you need</h2>
        <p style={{ textAlign: 'center', color: 'var(--ifm-color-secondary)', marginBottom: '36px' }}>
          One SDK. Full platform access.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '60px',
        }}>
          <Card icon="📱" title="Messaging" description="Send SMS, MMS, and email. Manage templates and campaigns." to="/api-reference/messaging" />
          <Card icon="📞" title="Voice" description="Make calls, run conferences, record and transcribe." to="/api-reference/voice" />
          <Card icon="📹" title="Video" description="Create rooms, manage participants, pull analytics." to="/api-reference/video" />
          <Card icon="🤖" title="AI" description="Generative chat, text-to-speech, real-time STT streaming." to="/api-reference/ai" />
          <Card icon="💾" title="Objects" description="CRM-style data — CRUD, queries, relationships." to="/api-reference/objects" />
          <Card icon="🔄" title="Workflows" description="Build automation flows programmatically." to="/api-reference/workflows" />
          <Card icon="📁" title="Storage" description="Upload, retrieve, and manage files." to="/api-reference/storage" />
          <Card icon="⚡" title="Subscriptions" description="Realtime event streams via WebSocket." to="/api-reference/subscriptions" />
        </div>

        <div style={{
          background: 'rgba(29,148,154,0.06)',
          border: '1px solid rgba(29,148,154,0.2)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, marginBottom: '8px' }}>
            Start building in 2 minutes
          </h2>
          <p style={{ color: 'var(--ifm-color-secondary)', marginBottom: '24px' }}>
            Install the SDK and send your first message.
          </p>
          <Link to="/getting-started" style={{
            background: '#1D949A',
            color: '#fff',
            padding: '12px 32px',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1rem',
          }}>
            Getting Started Guide →
          </Link>
        </div>
      </main>
    </Layout>
  );
}
