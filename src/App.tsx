import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import WizardController from './components/wizard/wizardController'
import { useDynamicTheme } from './theme'
import wizards from './data/wizards'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './App.css'
import { useAppSelector } from './redux/hooks'
import { selectThemeColor } from './redux/slices/theme/theme.selector'

function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  )
}

function Main() {
  const color = useAppSelector(selectThemeColor)
  const theme = useDynamicTheme({ palette: { primary: { main: color } } })
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WizardController defaultWizard="settings" wizards={wizards} />
    </ThemeProvider>
  )
}
export default App
