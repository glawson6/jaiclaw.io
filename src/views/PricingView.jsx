import PricingCard from '../components/PricingCard.jsx';
import { GITHUB_URL } from '../config/constants.js';
import '../styles/pricing.css';

const pricingTiers = [
  {
    title: 'Community',
    price: 'Free',
    description: 'Open-source with all features included. Perfect for startups and individual developers.',
    features: [
      'All framework features',
      '136 Maven modules',
      '7 messaging channels',
      '11 LLM providers',
      '38+ built-in tools',
      '59 bundled skills',
      'GOAP multi-agent planning',
      'Community support via GitHub Issues',
      'Apache 2.0 License',
    ],
    cta: 'Get Started',
    ctaLink: GITHUB_URL,
    featured: false,
  },
  {
    title: 'Professional',
    price: 'Contact Us',
    description: 'Priority support and expert guidance for teams building production AI assistants.',
    features: [
      'Everything in Community',
      'Priority email support',
      'Architecture review sessions',
      'Custom integration guidance',
      'Team training workshops',
      'Quarterly roadmap input',
      'Private Slack channel',
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    featured: true,
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    description: 'Dedicated engineering support for large-scale deployments and custom requirements.',
    features: [
      'Everything in Professional',
      'Dedicated support engineer',
      'Custom feature development',
      'SLA with guaranteed response times',
      'On-premises deployment support',
      'Security audit assistance',
      'Custom channel/provider development',
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    featured: false,
  },
];

export default function PricingView() {
  return (
    <div className="pricing-page">
      <div className="intro">
        <h2>Pricing</h2>
        <p>
          JaiClaw is open-source and free to use. Professional and enterprise support
          options are available for teams that need dedicated assistance.
        </p>
      </div>

      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <PricingCard
            key={tier.title}
            title={tier.title}
            price={tier.price}
            description={tier.description}
            features={tier.features}
            cta={tier.cta}
            ctaLink={tier.ctaLink}
            featured={tier.featured}
          />
        ))}
      </div>
    </div>
  );
}
