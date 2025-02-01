import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Wizard from './components/wizard/Wizard'
import WizardStep from './components/wizard/components/wizardStep/WizardStep'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Wizard />,
      },
      {
        path: ':wizardId',
        element: <Wizard />,
        children: [
          {
            index: true,
            element: <WizardStep />,
          },
          {
            path: ':stepId',
            element: <WizardStep />,
          },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
