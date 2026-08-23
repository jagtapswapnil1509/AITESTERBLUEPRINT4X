import React, { useState } from 'react';
import { X, Copy, Check, Mail, Sparkles, Send } from 'lucide-react';
import { JobApplication } from '../types/job';
import { EMAIL_TEMPLATES, EmailTemplate } from '../data/emailTemplates';

interface EmailAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Partial<JobApplication>;
}

export const EmailAssistantModal: React.FC<EmailAssistantModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(EMAIL_TEMPLATES[0].id);
  const [selectedContactName, setSelectedContactName] = useState<string>(
    application.contacts && application.contacts.length > 0 ? application.contacts[0].name : ''
  );
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  if (!isOpen) return null;

  const currentTemplate =
    EMAIL_TEMPLATES.find((t) => t.id === selectedTemplateId) || EMAIL_TEMPLATES[0];

  const subject = currentTemplate.generateSubject(application);
  const body = currentTemplate.generateBody(application, selectedContactName);

  const handleCopySubject = async () => {
    await navigator.clipboard.writeText(subject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyBody = async () => {
    await navigator.clipboard.writeText(body);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const targetEmail =
    application.contacts?.find((c) => c.name === selectedContactName)?.email ||
    application.contacts?.[0]?.email ||
    '';

  const mailtoUrl = `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="email-assistant-modal"
        className="bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Follow-up & Email Generator
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {application.company || 'Job Application'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ready-to-send personalized templates for recruiters and hiring managers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Template Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Choose Template Goal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {EMAIL_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTemplateId === t.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-semibold text-xs truncate text-white">{t.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {t.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contact selector if contacts present */}
          {application.contacts && application.contacts.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-300">
                Recipient Contact:
              </span>
              <select
                value={selectedContactName}
                onChange={(e) => setSelectedContactName(e.target.value)}
                className="py-1 px-2.5 rounded-lg border border-slate-750 bg-slate-950 text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">General Hiring Team</option>
                {application.contacts.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} {c.role ? `(${c.role})` : ''} {c.email ? `- ${c.email}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Email Subject Line
              </label>
              <button
                type="button"
                onClick={handleCopySubject}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors"
              >
                {copiedSubject ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Subject
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 select-all">
              {subject}
            </div>
          </div>

          {/* Body Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Email Body Draft
              </label>
              <button
                type="button"
                onClick={handleCopyBody}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors"
              >
                {copiedBody ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Email Body
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              value={body}
              rows={10}
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none select-all resize-y"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Customize bracketed items like <code className="text-indigo-400">[Your Name]</code> before sending.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyBody}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Full Draft
            </button>
            {targetEmail && (
              <a
                href={mailtoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-750 flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-4 h-4 text-indigo-400" />
                Open in Email Client
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
