import { Box, Typography } from '@mui/material'
import gsap from 'gsap'
import { Component } from 'react'
import { redirect } from 'react-router'

interface ErrorBoundaryState {
  error: Error | null
  errorCount: number
  errorLimit: number
  errorTimeout?: number
  lastError?: number
  timeout: number
}

export interface ErrorBoundaryProps {
  children: React.ReactNode
  timeout?: number
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: null,
      timeout: props.timeout || 5,
      errorCount: 0,
      errorLimit: 3,
    }
  }

  componentDidCatch(error: Error) {
    const { errorCount, errorLimit, lastError, timeout } = this.state
    const shouldIncrement = lastError && Date.now() - lastError < 1000 * (timeout + 1)
    if (shouldIncrement && errorCount + 1 >= errorLimit) {
      this.setState({ error, errorCount: errorCount + 1 })
      return
    }
    this.setState({
      error,
      errorCount: shouldIncrement ? errorCount + 1 : 0,
      lastError: Date.now(),
    })
    gsap.delayedCall(timeout, () => {
      this.setState({ error: null })
      redirect('/')
    })
  }

  render() {
    const { errorCount, errorLimit, error } = this.state
    if (error) {
      return (
        <Box>
          <Typography variant="h1">Oh Snap!</Typography>
          <Typography variant="body1">
            Looks like you've discovered an Error!
          </Typography>
          {errorCount < errorLimit ? (
            <Typography variant="body1">Taking you back home...</Typography>
          ) : (
            <Typography variant="body1">
              Oh this one's BAD, please try visiting another time!
            </Typography>
          )}
        </Box>
      )
    }

    return <>{this.props.children}</>
  }
}
