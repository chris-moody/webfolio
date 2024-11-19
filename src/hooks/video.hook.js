import { useCallback, useEffect, useRef, useState, memo } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { useTracker } from './gtm.hooks'

export const useVideoJS = ({ title, ...videoJsOptions }) => {
  const videoNode = useRef(null)
  const player = useRef(null)
  const { trackVideoStart, trackVideoPlay, trackVideoPause, trackVideoProgress, trackVideoEnd } = useTracker()
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {


    const onPlay = () => {
      if (hasPlayed) trackVideoPlay(title)
      else {
        trackVideoStart(title)
        setHasPlayed(true)
      }
    }

    const onPause = () => {
      trackVideoPause(title)
    }

    const onProgress = (e) => {
      trackVideoProgress(title, e)
    }

    const onEnd = () => {
      trackVideoEnd(title)
    }

    if (videoNode) {
      player.current = videojs(videoNode.current, videoJsOptions)
      player.current.on('play', onPlay)
      player.current.on('pause', onPause)
      player.current.on('progress', onProgress)
      player.current.on('ended', onEnd)
    }

    return () => {
      if (player && player.current) {
        player.current.dispose()
      }
    }
  }, [])

  const Video = useCallback(
    ({ children, ...props }) => {
      return (
        <div data-vjs-player>
          <video ref={videoNode} className="video-js" {...props}>
            {children}
          </video>
        </div>
      )
    },
    []
  )
  return { Video, player: player.current }
}