import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import WizardController from './components/wizard/wizardController'
import { useDynamicTheme } from './theme'
import wizards from './data/wizards'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './App.css'
import { useAppSelector } from './redux/hooks'
import { selectThemeColor, selectThemeFlair } from './redux/slices/theme/theme.selector'

function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  )
}

function Main() {
  const color = useAppSelector(selectThemeColor)
  const flair = useAppSelector(selectThemeFlair)
  const theme = useDynamicTheme({ palette: { primary: { main: color } } }, flair)
  return (
    <ThemeProvider theme={theme} noSsr>
      <CssBaseline enableColorScheme />
      <WizardController defaultWizard="settings" wizards={wizards} />
    </ThemeProvider>
  )
}
export default App
/* 
TODO Flair theming
TODO Flair and pinback interaction
TODO settings modal
TODO revisiting a wizard should start it over
TODO deep linking
*/