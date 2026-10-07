import { FlairSelectionRenderer } from '@/components/wizard/components/wizardStep/components/flairSelectionRenderer/FlairSelectionRenderer'
import { ColorSelectionRenderer } from '@/components/wizard/components/wizardStep/components/colorSelectionRenderer/ColorSelectionRenderer'
import { WizardConfig } from '@/components/wizard/Wizard'
import { TourResume } from '@/components/resume/ResumeView'
import { Link, Stack } from '@mui/material'
import { Youtube } from '@/components/video/Youtube'
import { TypeWriter } from '@/components/typeWriter/TypeWriter'

import {
  betaClassroom,
  betaLaptop,
  betaLevelDesign,
  meAtMagens,
} from '@/data/media'
import { Picture } from '@/components/image/Picture'
import { WizardStepConfig } from '@/components/wizard/components/wizardStep/WizardStep'
import {
  FlairText,
  SocketFlow,
  TechMarquees,
  WaterText,
} from '@/data/tour.lazy'
import { tourPath } from '@/data/tour.manifest'
import { LinkSelectionRenderer } from '@/components/wizard/components/wizardStep/components/LinkSelectionRenderer'

const wizards: Record<string, WizardConfig> = {
  home: {
    id: 'home',
    header: 'Welcome!',
    next: 'purpose',
    prev: '',
    defaultStep: 'flair',
    stepData: [
      {
        id: 'flair',
        title: 'Pick your flair',
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
        title: 'Choose your colors',
        header: 'Choose a color scheme and a favorite color',
        selectionRenderer: ColorSelectionRenderer,
      },
    ],
  },
  purpose: {
    id: 'purpose',
    header: 'State Your Purpose',
    prev: 'home',
    defaultStep: 'why',
    showNav: false,
    stepData: [
      {
        id: 'why',
        title: 'Why are you here?',
        header: 'Why are you here?',
        selectionRenderer: LinkSelectionRenderer,
        selections: [
          {
            id: 'about',
            label: 'Who is Chris Moody?',
            next: tourPath('about'),
          },
          {
            id: 'storytime',
            label: 'Tell me a story',
            next: tourPath('storytime'),
          },
          {
            id: 'resume',
            label: 'Show me the resume!',
            next: tourPath('resume'),
          },
        ],
      },
    ],
  },
  storytime: {
    id: 'storytime',
    prev: 'purpose',
    header: 'Story Time!',
    defaultStep: 'story-selection',
    showNav: false,
    stepData: [
      {
        id: 'story-selection',
        title: 'Pick a story',
        header: 'What kind of story are you looking for?',
        selectionRenderer: LinkSelectionRenderer,
        selections: [
          { id: 'fun-story', label: 'Fun', next: tourPath('fun') },
          { id: 'work-story', label: 'Work', next: tourPath('work') },
          { id: 'project-story', label: 'Project', next: tourPath('beta') },
        ],
      },
    ],
  },

  about: {
    id: 'about',
    next: 'purpose',
    defaultStep: '0',
    header: 'About Me',
    stepData: [
      {
        id: '0',
        title: 'My name',
        next: '1',
        header: (
          <>
            My name is Christopher, but please, call me Chris. Only my Mom feels
            the need to invoke all three syllables. You can if you want, but
            less is more, right?
          </>
        ),
        headerNext: 'Next',
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
        title: 'What I build',
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
        headerNext: 'Next',
        media: <SocketFlow />,
      },
      {
        id: '2',
        title: 'Where I’ve worked',
        next: '3',
        header: (
          <>
            I have had a full and robust set of experiences working in the
            advertising, finance, and biological science industries across
            startups, agencies, and large corporations. I&rsquo;ve pushed
            through last minute scope changes, squashed montrous bugs, and
            migrated legacy platforms to new technology stacks. Nothing scares
            me.
          </>
        ),
        headerNext: 'Next',
        media: <WaterText value="I AM FEARLESS" />,
      },
      {
        id: '3',
        title: 'Languages and tools',
        next: '4',
        header: (
          <>
            My first language was Java before I dove heavily into AS3 in the
            early 2000s. Transitioning to full time javascript in ES5&rsquo;s
            heyday was a bit of a departure from the typed languages I was
            accustomed to, but there was fun to be had with closures as well!
            Typescript is my happy place these days, and some of my favorite
            tools are React, Vite, and MUI. I am also familiar with a slew of
            other animation and visualization libraries such as gsap,
            highcharts, AG Grid, and D3 to name a few.
          </>
        ),
        headerNext: 'Next',
        unwrappedMedia: <TechMarquees />,
      },
      {
        id: '4',
        title: 'Outside of work',
        header: (
          <>
            Outside of work I am a husband and father of 3 awesome kids. I used
            to play more video games than I do now, and anime is my favorite
            type of media to watch. I enjoy traveling but most of it has been to
            the caribbean. I think I really just might actually belong there.
          </>
        ),
        headerNext: 'End',
        media: (
          <Picture
            priority
            {...meAtMagens}
            style={{ maxWidth: '600px', height: '100%', objectFit: 'contain' }}
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
    bodyComponent: TourResume,
  },
  fun: {
    id: 'fun',
    next: 'storytime',
    defaultStep: '0',
    header: 'Add Some Flair',
    stepData: [
      {
        id: '0',
        title: 'The review',
        next: '1',
        header: (
          <>
            A long time ago I was working on an app at a digital agency in NYC.
            I had built the user interface based on PSDs provided by the
            creative team, and it was ready for review. The producer and art
            director(AD) came over to my desk, and the AD gave confirming grunts
            as I went over the programmed project screens.
          </>
        ),
        headerNext: 'Next',
      },
      {
        id: '1',
        title: 'The request',
        next: '2',
        header: (
          <>
            When I was done, he said, &ldquo;This looks awesome, great work! One
            thing though, could we add some <em>flair</em> to the
            buttons?&rdquo;
            <br /> &ldquo;Sure,&rdquo; I replied as I noticed the producer
            rolling her eyes. &ldquo;What did you have in mind?&rdquo;
            <br /> &ldquo;You know, uh Pop! Pizzazz!&rdquo; He drummed his
            fingers his lips for a brief pause while he searched for new a word,
            &ldquo;Flair!&rdquo;
          </>
        ),
        headerNext: 'Next',
      },
      {
        id: '2',
        title: 'The flair',
        next: '3',
        header: (
          <>
            Realizing that further conversation would be counter-productive, I
            delivered my warmest smile and said &ldquo;You got it!&rdquo; The
            look the producer gave me as they left said that she knew I was up
            to something. A little while later I invited them back over, and I
            offered the mouse to the AD so that he could click the new button.
            It was something like this:
          </>
        ),
        headerNext: 'Next',
        unwrappedMedia: (
          <Stack className="content" height="50%" justifyContent="center">
            <FlairText text=">>Click Me!<<" />
          </Stack>
        ),
      },
      {
        id: '3',
        title: 'The reveal',
        headerNext: 'End',
        header: (
          <>
            The art director was not pleased. It turns out that 16-time WWE
            Heavyweight Champion Ric Flair was{' '}
            <strong>
              <em>not</em>
            </strong>{' '}
            the kind of flair he was looking for 🙃. The producer couldn&rsquo;t
            contain her laughter, and once everyone's emotions flared down we
            all had a wonderful conversation about shimmers, shines, and glows.
          </>
        ),
      },
    ],
  },
  work: {
    id: 'work',
    next: 'storytime',
    defaultStep: '0',
    header: 'Make it Bad',
    stepData: [
      {
        id: '0',
        title: 'A new client',
        next: '1',
        header: (
          <>
            One of our pharmaceutical clients had recently gained new leadership
            in the form of a transplant from a big American beer brand. This guy
            was used to seeing flashy and exciting things, and was unwilling to
            accept the idea that pharma branding had to be&nbsp;boring.
          </>
        ),
        headerNext: 'Next',
      },
      {
        id: '1',
        title: 'The pressure',
        next: '2',
        header: (
          <>
            Major pressure was placed on the design team to keep the concept
            exciting, which in turn meant that it was even more important that
            the final product delivered that same energy. Even if it was just a
            banner campaign! Before offering me the project, the engineering
            manager warned me that this account was pushing the creative
            concepts to the limit. She was not confident that we could deliver
            what they wanted given the tight&nbsp;time frame.
          </>
        ),
        headerNext: 'Next',
      },
      {
        id: '2',
        title: 'The constraints',
        next: '3',
        header: (
          <>
            Her fears were well-founded. Between high quality background images,
            a live text requirement with a non-web safe font, and the ridiculous
            40kb size limit, there wasn't going to be any room to load in a
            fancy framework that could animate smoke. But once I had the designs
            I understood the assignment, and decided that the best way to bring
            life to the concept was to leverage WebGL to create a particle
            emitter.
          </>
        ),
        headerNext: 'Next',
      },
      {
        id: '3',
        title: 'The emitter',
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
        headerNext: 'Next',
      },
      {
        id: '4',
        title: 'Make it bad',
        header: (
          <>
            “I need you to make it bad,” she said to me in hushed tones. I
            couldn&rsquo;t believe what I was hearing, but she was serious. So I
            stripped out the WebGL code and refactored the emitter to use img
            tags instead. I had to cut down the pool size to almost a quarter of
            what it was to get half the frame rate. <br />
            <br />
            It was gross, and then it received approval from a client who never
            had the opportunity to see the greatness that almost was 😭
          </>
        ),
        headerNext: 'End',
      },
    ],
  },
  beta: {
    id: 'beta',
    next: 'storytime',
    header: 'Beta the Game',
    defaultStep: '0',
    stepData: [
      {
        id: '0',
        title: 'Beta and CodePop',
        next: '1',
        header:
          'I ran a small video game company between 2011 and 2017. My partners and I had a blast designing, animating and coding an ed-tech game centered around a cute little robot named Beta. Beta could manipulate his world and objects in it via a runtime scripting language we called CodePop!',
        headerNext: 'Next',
        media: (
          <Youtube
            height="100%"
            margin="0 auto"
            videoId="rYybYqu00hk"
            videoTitle="Callbacks and Collisions 1: Adding a callback"
          />
        ),
      },
      {
        id: '1',
        title: 'Paper prototypes',
        next: '2',
        header:
          'CodePop sported an event model, conditional statements, loops, and simple custom functions. We ran classes, camps and conference events where we showed attendees how to protoype a simple game on paper and then bring it to life using Beta!',
        headerNext: 'Next',
        media: (
          <Picture
            priority
            {...betaLevelDesign}
            style={{ maxWidth: '600px', height: '100%', objectFit: 'contain' }}
            alt="Paper prototype"
          />
        ),
      },
      {
        id: '2',
        title: 'In the classroom',
        next: '3',
        header:
          'Most of our students had never coded before, but left the events having successfully designed and programmed their own video games. The genuine joy of discovery coupled with the undeniable educational benefits of critical and creative thinking made Beta a one of a kind experience.',
        headerNext: 'Next',
        media: (
          <Picture
            priority
            {...betaClassroom}
            style={{ maxWidth: '650px', height: '100%', objectFit: 'contain' }}
            alt="Beta classroom"
          />
        ),
      },
      {
        id: '3',
        title: 'BetaNet',
        next: '4',
        header:
          'All students received a BetaNet account with which they could continue to play and iterate on their games, make new ones, or experience what other creators were coming up with.',
        headerNext: 'Next',
        media: (
          <Picture
            priority
            {...betaLaptop}
            style={{
              maxWidth: '650px',
              height: '100%',
              objectFit: 'contain',
              margin: '0 auto',
            }}
            alt="Beta the game"
          />
        ),
      },
      {
        id: '4',
        title: 'Watch it',
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
        headerNext: 'End',
        media: (
          <Youtube
            height="100%"
            margin="0 auto"
            videoId="fqbfMO7PFts"
            videoTitle="Beta the game trailer"
          />
        ),
      },
    ],
  },
}

export const useWizard = (id: string = 'home'): WizardConfig | undefined => {
  return wizards[id]
}

export const useWizardStep = (id: string = 'home', stepId: string) => {
  return (
    useWizard(id)?.stepData?.find((step) => {
      return step.id === stepId
    }) || ({} as WizardStepConfig)
  )
}

export default wizards
