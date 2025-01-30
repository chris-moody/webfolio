import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Route, Routes } from 'react-router'
import Wizard from './components/wizard/Wizard'
import WizardStep from './components/wizard/components/wizardStep/WizardStep'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Wizard />} />
          <Route path=":wizardId" element={<Wizard />}>
            <Route index element={<WizardStep />} />
            <Route path=":stepId" element={<WizardStep />} />
          </Route>
        </Route>
      </Routes>
    </StrictMode>
  </BrowserRouter>
)
