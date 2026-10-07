import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  // Content pages: Tailwind only, no MUI/Emotion on first load.
  layout('routes/site/layout.tsx', [
    index('routes/site/home.tsx'),
    route('resume', 'routes/site/resume.tsx'),
    route('lab', 'routes/site/lab.tsx'),
    route('lab/tape', 'routes/site/lab.tape.tsx'),
    route('*', 'routes/site/not-found.tsx'),
  ]),
  // The guided tour: the original MUI/GSAP experience, opt-in from the home page.
  route('tour', 'routes/tour/layout.tsx', [
    index('routes/tour/start.tsx'),
    route(':wizardId', 'routes/tour/wizard.tsx', [
      index('routes/tour/step.tsx', { id: 'tour-step-index' }),
      route(':stepId', 'routes/tour/step.tsx'),
    ]),
  ]),
] satisfies RouteConfig
