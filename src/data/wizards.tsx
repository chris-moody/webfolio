import { FlairSelectionRenderer } from '@/components/wizard/components/wizardStep/components/flairSelectionRenderer/FlairSelectionRenderer'
import { ColorSelectionRenderer } from '@/components/wizard/components/wizardStep/components/colorSelectionRenderer/ColorSelectionRenderer'
import { WizardConfig } from '@/components/wizard/Wizard'
import { ResumeRenderer } from '@/components/wizard/components/resumeRenderer/ResumeRenderer'
import { Text3d } from '@/components/text3d/Text3d'
import { Link } from '@mui/material'
import { Image } from '@/components/image/Image'
import { Youtube } from '@/components/video/Youtube'
import { TypeWriter } from '@/components/typeWriter/TypeWriter'
import { TechMarquees } from '@/containers/techMarquees/TechMarquees'

import betaClass from '@/assets/beta/beta_classroom.jpg'
import betaLaptop from '@/assets/beta/beta_laptop.png'
import betaLevel from '@/assets/beta/beta_paper_level_design.png'
import meAtMagens from '@/assets/aboutme/me_at_magens.jpg'
import { WizardStepConfig } from '@/components/wizard/components/wizardStep/WizardStep'

const wizards: Record<string, WizardConfig> = {
  settings: {
    id: 'settings',
    header: 'Welcome!',
    next: 'purpose',
    prev: '',
    defaultStep: 'flair',
    stepData: [
      {
        id: 'flair',
        next: 'color',
        header: 'First, we need to talk about your Flair',
        body: (
          <>
            You{' '}
            <strong>
              <em>do</em>
            </strong>{' '}
            want to express yourself, don&rsquo;t you?
          </>
        ),
        selectionRenderer: FlairSelectionRenderer,
        selections: [
          { id: '1', label: '1 piece' },
          { id: '15', label: '15 pieces' },
          { id: '37', label: '37 pieces' },
        ],
      },
      {
        id: 'color',
        header: 'Choose a color scheme and a favorite color',
        selectionRenderer: ColorSelectionRenderer,
      },
    ],
  },
  purpose: {
    id: 'purpose',
    header: 'State your purpose',
    prev: 'settings',
    defaultStep: 'why',
    stepData: [
      {
        id: 'why',
        header: 'Why are you here?',
        selections: [
          {
            id: 'about',
            label: 'Who is Chris Moody?',
            next: 'about',
          },
          { id: 'storytime', label: 'Tell me a story', next: 'storytime' },
          { id: 'resume', label: 'Show me the resume!', next: 'resume' },
        ],
      },
    ],
  },
  storytime: {
    id: 'storytime',
    prev: 'purpose',
    header: 'Story Time!',
    defaultStep: 'story-selection',
    stepData: [
      {
        id: 'story-selection',
        header: 'What kind of story are you looking for?',
        selections: [
          { id: 'fun-story', label: 'Fun', next: 'fun' },
          { id: 'work-story', label: 'Work', next: 'work' },
          { id: 'project-story', label: 'Project', next: 'beta' },
        ],
      },
    ],
  },

  about: {
    id: 'about',
    next: 'purpose',
    defaultStep: '0',
    header: 'About me',
    stepData: [
      {
        id: '0',
        next: '1',
        header: (
          <>
            My name is Christopher, but please, call me Chris. Only my Mom feels
            the need to invoke all three syllables. You can if you want, but
            less is more, right?
          </>
        ),
        media: (
          <>
            <TypeWriter
              variant="h3"
              prefix="CHRIS"
              text="TOPHER"
              sx={{ display: 'block' }}
              duration={3}
            />
            <TypeWriter
              variant="h3"
              prefix="M"
              text="OODY"
              sx={{ display: 'block' }}
              duration={2}
            />
          </>
        ),
      },
      {
        id: '1',
        next: '2',
        header: (
          <>
            I&rsquo;m an engineer of the full-stack variety, specializing in
            applications targeting web, mobile and desktop. Some of my favorite
            projects have involved socket server implementations that enable
            real-time communication between networked devices, paving the way
            for remote-controlled media, or a live leaderboard connected to
            multiple game screens.
          </>
        ),
        media: <>interactive remote media animation</>,
      },
      {
        id: '2',
        next: '3',
        header: (
          <>
            I have had a full and robust set of experiences working in the
            advertising, finance, and biological science industries across
            startups, agencies, and large corporations. I&rsquo;ve seen projects
            with no budget and no time, projects with too much budget and too
            much time and everything in between. Nothing scares me.
          </>
        ),
        media: <>FEARLESS PIXI DISPLACEMENT FILTER</>,
      },
      {
        id: '3',
        next: '4',
        header: (
          <>
            My first language was Java before I dove heavily into AS3 in the
            early 2000s. Transitioning to full time javascript in ES5&rsquo;s
            heyday was a bit of a departure from the typed languages I was
            accustomed to, but there is fun to be had with closures as well!
            Typescript is my happy place these days, and some of my favorite
            tools are React, Vite, and MUI. I am also familiar with a slew of
            other animation and visualization libraries such as gsap,
            highcharts, AG Grid, and D3 to name a few.
          </>
        ),
        unwrappedMedia: <TechMarquees />,
      },
      {
        id: '4',
        header: (
          <>
            Outside of work I am a husband and father of 3 awesome kids. I used
            to play more video games than I do now, and anime is my favorite
            type of media to watch. I enjoy traveling but most of it has been
            to the caribbean. I think I really just might actually belong there.
          </>
        ),
        media: (
          <Image
            style={{ maxWidth: '600px' }}
            src={meAtMagens}
            alt="Chris Moody at Magen's Bay"
          />
        ),
      },
    ],
  },
  resume: {
    id: 'resume',
    next: 'purpose',
    header: 'Resume',
    bodyComponent: ResumeRenderer,
  },
  fun: {
    id: 'fun',
    next: 'storytime',
    defaultStep: '0',
    header: 'Flair',
    stepData: [
      {
        id: '0',
        next: '1',
        header:
          'A long time ago I was working on an app at a digital agency in NYC.',
      },
      {
        id: '1',
        next: '2',
        header:
          'I had built the user interface based on PSDs provided by the creative team, and it was ready for review.',
      },
      {
        id: '2',
        next: '3',
        header:
          'The Art director came over to my desk, and he gave confirming grunts as I went over the layout.',
      },
      {
        id: '3',
        next: '4',
        header:
          'When I was done, he said “This looks awesome, great work! One thing though, could we add some flair to the buttons?”',
      },
      {
        id: '4',
        next: '5',
        header: '“Sure,” I replied. “What did you have in mind?”',
      },
      {
        id: '5',
        next: '6',
        header:
          '“You know! Pop! Pizazz!” He paused briefly while he searched for new a word, “Flair!”',
      },
      {
        id: '6',
        next: '7',
        header:
          'Realizing that further conversation would be counter-productive, I smiled and said “You got it!”',
      },
      {
        id: '7',
        header: (
          <>
            And then I added some{' '}
            <Text3d variant="h1" fontFamily="Rammetto One">
              Flair!
            </Text3d>
          </>
        ),
      },
    ],
  },
  work: {
    id: 'work',
    next: 'storytime',
    defaultStep: '0',
    header: 'Make it bad',
    stepData: [
      {
        id: '0',
        next: '1',
        header: (
          <>
            This one time at a digital agency in NYC, our team landed a
            pharmaceutical client that had recently gained new leadership in the
            form of a transplant from a big American beer brand. This guy was
            used to seeing flashy and exciting things, and was unwilling to
            accept that pharma had to be boring.
          </>
        ),
      },
      {
        id: '1',
        next: '2',
        header: (
          <>
            Major pressure was placed on the creative team to keep the concept
            exciting, which in turn meant that it was even more important that
            the final product delivered that same energy. Even if they were just
            banner advertisments! The engineering manager warned me that this
            account was pushing the creative concepts to the limit. She was not
            confident that we could deliver what they wanted given the tight
            timeframe.
          </>
        ),
      },
      {
        id: '2',
        next: '3',
        header: (
          <>
            Her fears were not unfounded. Between high quality background
            images, a live text requirement with a non-websafe font, and the
            ridiculous 40kb size limit, there wasn't going to be any room to
            load in a fancy framework that could animate smoke. But once I had
            the designs I understood the assignment, and decided that the best
            way to animate the design was to leverage WebGL to create a particle
            emitter.
          </>
        ),
      },
      {
        id: '3',
        next: '4',
        header: (
          <>
            The end result was super smooth, even while generating a TON of
            particles. Everyone in our tech department loved it, but the
            engineering manager was freaking out. She was terrified that people
            outside of the department would see it and then expect projects in
            the future to be up to par.
          </>
        ),
      },
      {
        id: '4',
        header: (
          <>
            “I need you to make it bad,” she said to me in hushed tones. I
            couldn&rsquo;t believe what I was hearing, but she was serious. I
            refactored the particle emitter to emit img tags and stipped out the
            WebGL code. I had to cut down the particle limit to almost a quarter
            of what it was to get half the framerate. <br />
            <br />
            It was gross, and then it got approved by a client who never got to
            see the greatness that was 😭
          </>
        ),
      },
    ],
  },
  beta: {
    id: 'beta',
    next: 'storytime',
    header: 'Beta the game',
    defaultStep: '0',
    stepData: [
      {
        id: '0',
        next: '1',
        header:
          'I ran a small video game company between 2011 and 2017. My partners and I had a blast designing, animating and coding an ed-tech game centered around a cute little robot named Beta. Beta could manipulate his world and objects in it via a runtime scripting language we called CodePop!',
        media: (
          <Youtube
            videoId="rYybYqu00hk"
            videoTitle="Callbacks and Collisions 1: Adding a callback"
          />
        ),
      },
      {
        id: '1',
        next: '2',
        header:
          'CodePop sported an event model, conditional statements, loops, and simple custom functions. We ran classes, camps and conference events where we showed attendees how to protoype a simple game on paper and then bring it to life using Beta!',
        media: (
          <Image
            style={{ maxWidth: '600px' }}
            src={betaLevel}
            alt="Paper prototype"
          />
        ),
      },
      {
        id: '2',
        next: '3',
        header:
          'Most of our students had never coded before, but left the events having successfully designed and programmed their own video games. The genuine joy of discovery coupled with the undeniable educational benefits of critical and creative thinking made Beta a one of a kind experience.',
        media: (
          <Image
            style={{ maxWidth: '650px' }}
            src={betaClass}
            alt="Beta classroom"
          />
        ),
      },
      {
        id: '3',
        next: '4',
        header:
          'All students received a BetaNet account with which they could continue to play and iterate on their games, make new ones, or experience what other creators were coming up with.',
        media: (
          <Image
            style={{ maxWidth: '650px' }}
            src={betaLaptop}
            alt="Beta the game"
          />
        ),
      },
      {
        id: '4',
        header: (
          <>
            While the BetaNet is no longer online, some of our{' '}
            <Link
              target="_blank"
              href="https://www.youtube.com/watch?v=rYybYqu00hk&list=PLrO16qybUOmdy_lwF8v8HwIEHFhKG9kpI&index=1&ab_channel=BetaTheRobot"
            >
              tutorial videos
            </Link>{' '}
            and{' '}
            <Link
              target="_blank"
              href="https://beta-the-game.fandom.com/wiki/Special:AllPages"
            >
              the Beta Wiki
            </Link>{' '}
            still are, check &rsquo;em out!
          </>
        ),
        media: (
          <Youtube videoId="fqbfMO7PFts" videoTitle="Beta the game trailer" />
        ),
      },
    ],
  },
}

export const useWizard = (id: string = 'settings') => {
  return wizards[id]
}

export const useWizardStep = (id: string, stepId: string) => {
  return (
    useWizard(id).stepData?.find((step) => {
      return step.id === stepId
    }) || ({} as WizardStepConfig)
  )
}

export default wizards
