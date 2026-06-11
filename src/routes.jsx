// IMPORTANT: When adding a new route, also add a corresponding `location =` line
// in nginx.conf and deployment/helm/jaiclaw-io/templates/configmap.yaml
// so the route is included in the nginx allowlist and returns 200 instead of 404.
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './views/MainLayout.jsx';
import HomeView from './views/HomeView.jsx';
import FeaturesView from './views/FeaturesView.jsx';
import DocumentationView from './views/DocumentationView.jsx';
import ExamplesView from './views/ExamplesView.jsx';
import PricingView from './views/PricingView.jsx';
import ContactView from './views/ContactView.jsx';
import ResourcesView from './views/ResourcesView.jsx';
import WhyJaiClawView from './views/WhyJaiClawView.jsx';
import EnterpriseView from './views/EnterpriseView.jsx';

export const routes = [
  {
    element: <MainLayout />,
    handle: {
      title: 'JaiClaw'
    },
    children: [
      { path: '/', element: <HomeView />, handle: { title: 'Home' } },
      { path: '/home', element: <HomeView />, handle: { title: 'Home' } },
      { path: '/features', element: <FeaturesView />, handle: { title: 'Features' } },
      { path: '/why', element: <WhyJaiClawView />, handle: { title: 'Why JaiClaw' } },
      { path: '/enterprise', element: <EnterpriseView />, handle: { title: 'Enterprise' } },
      { path: '/docs', element: <DocumentationView />, handle: { title: 'Documentation' } },
      { path: '/resources', element: <ResourcesView />, handle: { title: 'Resources' } },
      { path: '/examples', element: <ExamplesView />, handle: { title: 'Examples' } },
      { path: '/pricing', element: <PricingView />, handle: { title: 'Pricing' } },
      { path: '/contact', element: <ContactView />, handle: { title: 'Contact' } },
    ],
  },
];

export default createBrowserRouter(routes);
