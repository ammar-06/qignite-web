export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  tag: string;
}

export const services: Service[] = [
  {
    id: 'ai-qa-automation',
    icon: 'brain',
    tag: 'Core Service',
    title: 'AI-Powered QA Automation',
    description:
      'Leverage intelligent testing systems that learn, adapt, and evolve with your codebase — dramatically reducing manual effort while increasing coverage and accuracy.',
    features: [
      'Self-healing test scripts',
      'Intelligent bug pattern recognition',
      'Automated regression suites',
      'Visual regression testing',
      'AI-generated test cases',
    ],
  },
  {
    id: 'healthcare-qa',
    icon: 'heart-pulse',
    tag: 'Specialized',
    title: 'Healthcare Platform QA',
    description:
      'Specialized quality assurance for healthcare systems and digital pathology platforms, ensuring compliance, reliability, and patient data integrity across international markets.',
    features: [
      'HIPAA compliance validation',
      'Digital pathology platform testing',
      'EHR system integration testing',
      'Clinical workflow validation',
      'Regulatory compliance checks',
    ],
  },
  {
    id: 'ai-customer-support',
    icon: 'bot',
    tag: 'AI Service',
    title: 'AI-Assisted Customer Support',
    description:
      'Deploy intelligent support agents that resolve issues faster, reduce ticket volume, and deliver consistent, accurate responses — available around the clock.',
    features: [
      'LLM-powered support bots',
      'Intelligent ticket routing',
      'Knowledge base automation',
      'Multi-channel support integration',
      'Sentiment analysis & escalation',
    ],
  },
  {
    id: 'enterprise-qa',
    icon: 'layers',
    tag: 'Enterprise',
    title: 'Enterprise QA Engineering',
    description:
      'End-to-end quality engineering for enterprise platforms. From strategy to execution, we embed quality into every phase of your software development lifecycle.',
    features: [
      'QA strategy & process design',
      'CI/CD pipeline integration',
      'Performance & load testing',
      'Security & penetration testing',
      'QA team augmentation',
    ],
  },
];