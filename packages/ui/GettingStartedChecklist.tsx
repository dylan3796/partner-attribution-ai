'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Circle, ChevronDown, ChevronUp, X, Zap, Users, FileText, BarChart3, Link2 } from 'lucide-react';

type ChecklistStep = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  completed: boolean;
};

type Props = {
  totalPartners: number;
  totalDeals: number;
  hasCrmConnected: boolean;
};

export default function GettingStartedChecklist({ totalPartners, totalDeals, hasCrmConnected }: Props) {
  const [dismissed, setDismissed] = useState(true); // default hidden until mounted
  const [collapsed, setCollapsed] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);

  useEffect(() => {
    setDismissed(!!localStorage.getItem('covant_checklist_dismissed'));
    setCollapsed(!!localStorage.getItem('covant_checklist_collapsed'));
    setHasConfig(!!localStorage.getItem('covant_setup_complete') || !!localStorage.getItem('covant_setup_config'));
  }, []);

  const steps: ChecklistStep[] = [
    {
      id: 'setup',
      label: 'Configure your program',
      description: 'Set attribution model, commission rules, and interaction types.',
      href: '/setup',
      icon: <Zap size={16} />,
      completed: hasConfig,
    },
    {
      id: 'crm',
      label: 'Connect your CRM',
      description: 'Sync deals and contacts from Salesforce or HubSpot.',
      href: '/dashboard/integrations',
      icon: <Link2 size={16} />,
      completed: hasCrmConnected,
    },
    {
      id: 'partner',
      label: 'Invite your first partner',
      description: 'Send an invite link so partners can access their portal.',
      href: '/dashboard/partners',
      icon: <Users size={16} />,
      completed: totalPartners > 0,
    },
    {
      id: 'deal',
      label: 'Register a deal',
      description: 'Create a deal or have a partner register one through the portal.',
      href: '/dashboard/deals',
      icon: <FileText size={16} />,
      completed: totalDeals > 0,
    },
    {
      id: 'attribution',
      label: 'Review attribution results',
      description: 'See how revenue is attributed across your partner network.',
      href: '/dashboard/deals',
      icon: <BarChart3 size={16} />,
      completed: totalDeals > 0 && totalPartners > 0,
    },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const allDone = completedCount === steps.length;

  // Don't show if dismissed or all complete
  if (dismissed || allDone) return null;

  const progressPct = Math.round((completedCount / steps.length) * 100);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('covant_checklist_dismissed', 'true');
  };

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (next) {
      localStorage.setItem('covant_checklist_collapsed', 'true');
    } else {
      localStorage.removeItem('covant_checklist_collapsed');
    }
  };

  return (
    <div style={{
      background: '#080808',
      border: '1px solid #1a1a1a',
      borderRadius: 12,
      marginBottom: 24,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          cursor: 'pointer',
        }}
        onClick={handleToggle}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(99,102,241,.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} style={{ color: '#818cf8' }} />
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: '.9rem', color: '#fff' }}>
              Getting Started
            </span>
            <span style={{ color: '#555', fontSize: '.8rem', marginLeft: 8 }}>
              {completedCount}/{steps.length} complete
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Progress bar */}
          <div style={{
            width: 80, height: 4, borderRadius: 2,
            background: '#1a1a1a',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressPct}%`,
              height: '100%',
              borderRadius: 2,
              background: completedCount > 0
                ? 'linear-gradient(90deg, #6366f1, #818cf8)'
                : '#333',
              transition: 'width .3s ease',
            }} />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#333', padding: 4, display: 'flex',
            }}
            title="Dismiss checklist"
          >
            <X size={14} />
          </button>
          {collapsed ? <ChevronDown size={16} style={{ color: '#555' }} /> : <ChevronUp size={16} style={{ color: '#555' }} />}
        </div>
      </div>

      {/* Steps */}
      {!collapsed && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {steps.map((step, i) => {
              // Find first incomplete step
              const firstIncomplete = steps.findIndex(s => !s.completed);
              const isCurrent = i === firstIncomplete;

              return (
                <Link
                  key={step.id}
                  href={step.completed ? '#' : step.href}
                  onClick={step.completed ? (e) => e.preventDefault() : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    background: isCurrent ? 'rgba(99,102,241,.06)' : 'transparent',
                    border: isCurrent ? '1px solid rgba(99,102,241,.15)' : '1px solid transparent',
                    transition: 'background .15s ease',
                  }}
                >
                  <div style={{ marginTop: 1, flexShrink: 0 }}>
                    {step.completed ? (
                      <CheckCircle size={18} style={{ color: '#22c55e' }} />
                    ) : (
                      <Circle
                        size={18}
                        style={{ color: isCurrent ? '#818cf8' : '#333' }}
                        strokeWidth={isCurrent ? 2 : 1.5}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '.875rem',
                      fontWeight: step.completed ? 400 : 500,
                      color: step.completed ? '#555' : '#e5e5e5',
                      textDecoration: step.completed ? 'line-through' : 'none',
                    }}>
                      {step.label}
                    </div>
                    {isCurrent && (
                      <div style={{
                        fontSize: '.8rem',
                        color: '#666',
                        marginTop: 2,
                        lineHeight: 1.4,
                      }}>
                        {step.description}
                      </div>
                    )}
                  </div>
                  {isCurrent && (
                    <div style={{
                      flexShrink: 0,
                      fontSize: '.75rem',
                      fontWeight: 600,
                      color: '#818cf8',
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'rgba(99,102,241,.1)',
                      alignSelf: 'center',
                    }}>
                      Start →
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
