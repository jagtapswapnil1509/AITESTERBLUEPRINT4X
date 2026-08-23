import { JobApplication } from '../types/job';

export interface EmailTemplate {
  id: string;
  category: 'followup' | 'interview' | 'offer' | 'inquiry' | 'rejection';
  title: string;
  description: string;
  generateSubject: (app: Partial<JobApplication>) => string;
  generateBody: (app: Partial<JobApplication>, contactName?: string) => string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'app-followup-1week',
    category: 'followup',
    title: '1-Week Application Follow-Up',
    description: 'Polite check-in sent ~5 to 7 business days after submitting your application.',
    generateSubject: (app) => `Following up on ${app.role || 'Position'} Application - [Your Name]`,
    generateBody: (app, contactName) => {
      const greeting = contactName ? `Hi ${contactName},` : `Dear Hiring Team at ${app.company || 'the company'},`;
      return `${greeting}

I hope you are having a wonderful week.

I recently submitted my application for the ${app.role || 'open position'} role at ${app.company || 'your team'} and wanted to reiterate my strong enthusiasm for this opportunity.

Given my background and passion for ${app.company ? app.company + "'s mission" : 'your mission'}, I believe I could make an immediate, meaningful impact on the team. I have attached my resume for your convenience.

Could you kindly share if there are any updates regarding the hiring timeline for this role? I would welcome the opportunity to discuss how my skills align with your team's goals.

Thank you very much for your time and consideration.

Best regards,
[Your Full Name]
[Your Phone Number]
[Your LinkedIn Profile]
[Your Portfolio / GitHub URL]`;
    },
  },
  {
    id: 'post-interview-thankyou',
    category: 'interview',
    title: 'Post-Interview Thank You (Send within 24h)',
    description: 'Express gratitude, highlight key topics discussed, and reaffirm interest.',
    generateSubject: (app) => `Thank you - ${app.role || 'Role'} Interview - [Your Name]`,
    generateBody: (app, contactName) => {
      const greeting = contactName ? `Hi ${contactName},` : `Dear Interview Team,`;
      return `${greeting}

Thank you so much for taking the time to speak with me today about the ${app.role || 'open position'} opportunity at ${app.company || 'your organization'}.

I really enjoyed our conversation, especially learning more about [mention a specific topic or project discussed, e.g., the team's upcoming roadmap / engineering culture]. Our discussion further confirmed my excitement about joining ${app.company || 'your team'}.

Please let me know if there is any additional information or work samples I can provide as you evaluate candidates.

I look forward to hearing about the next steps in the process.

Warm regards,
[Your Full Name]
[Your Phone Number]
[Your LinkedIn Profile]`;
    },
  },
  {
    id: 'status-inquiry-after-interview',
    category: 'inquiry',
    title: 'Post-Interview Status Check-In',
    description: 'Sent when the promised timeline has passed with no update.',
    generateSubject: (app) => `Checking in: ${app.role || 'Role'} Interview Status - [Your Name]`,
    generateBody: (app, contactName) => {
      const greeting = contactName ? `Hi ${contactName},` : `Hi Hiring Team,`;
      return `${greeting}

I hope you are having a productive week!

I am checking in to see if there is any update regarding the ${app.role || 'position'} role at ${app.company || 'your company'} following our interview on [Date of interview].

I remain very interested in the position and would love to know if any further details or references are required from my side.

Thank you again for your time and guidance throughout the process.

Best regards,
[Your Full Name]
[Your Phone Number]
[Your Email]`;
    },
  },
  {
    id: 'rejection-feedback-request',
    category: 'rejection',
    title: 'Graceful Response & Feedback Request',
    description: 'Maintain a positive professional relationship and ask for constructive insights.',
    generateSubject: (app) => `Thank you for the update - ${app.role || 'Role'} - [Your Name]`,
    generateBody: (app, contactName) => {
      const greeting = contactName ? `Hi ${contactName},` : `Dear Hiring Team,`;
      return `${greeting}

Thank you for letting me know about the outcome for the ${app.role || 'position'} at ${app.company || 'your company'}. While I am disappointed not to move forward, I truly appreciated the opportunity to meet the team and learn more about ${app.company || 'your organization'}.

If you have a brief moment, I would deeply appreciate any feedback on how I might improve my profile or skills for future opportunities.

I would love to stay in touch for future openings that may align with my background. Wishing you and the team continued success!

Best regards,
[Your Full Name]
[Your LinkedIn Profile]`;
    },
  },
  {
    id: 'offer-negotiation',
    category: 'offer',
    title: 'Offer Appreciation & Clarification / Counter',
    description: 'Acknowledge an offer professionally while proposing discussion points.',
    generateSubject: (app) => `Offer for ${app.role || 'Role'} - [Your Name]`,
    generateBody: (app, contactName) => {
      const greeting = contactName ? `Hi ${contactName},` : `Dear Hiring Team,`;
      return `${greeting}

Thank you so much for extending the offer for the ${app.role || 'open position'} at ${app.company || 'your company'}! I am genuinely thrilled about the prospect of joining the team.

I have reviewed the details in the offer package. Given my background in [your key skill] and the market standard for this level of responsibility, I was hoping to discuss the starting compensation / [specific benefit, e.g., base salary / equity / remote flexibility].

Would you be open to a brief call this week to discuss if we can adjust the base compensation to [Proposed Amount] or structure this to bridge the gap?

I am eager to make this work and look forward to speaking with you.

Best regards,
[Your Full Name]
[Your Phone Number]`;
    },
  },
];
