import { FlairSelectionRenderer } from "@/components/wizard/components/flairSelectionRenderer/FlairSelectionRenderer";
import { ColorSelectionRenderer } from "@/components/wizard/components/colorSelectionRenderer/ColorSelectionRenderer";
import { WizardProps } from "@/components/wizard/wizard";

const wizards: WizardProps[] = [
  {
    id: 'settings',
    title: 'Settings',
    next: 'purpose',
    defaultStep: 'flair',
    stepData: [
      {
        id: 'flair',
        next: 'color',
        title: 'Select your level of flair',
        selectionRenderer: FlairSelectionRenderer,
        selections: [
          { id: 1, label: '1 piece' },
          { id: 15, label: '15 pieces' },
          { id: 37, label: '37 pieces' },
        ],
      },
      {
        id: 'color',
        title: 'Choose a color scheme and a favorite color',
        selectionRenderer: ColorSelectionRenderer
      },
    ],
  },
  {
    id: 'purpose',
    title: 'State your purpose',
    next: 'complete',
    defaultStep: 'about',
    stepData: [
      {
        id: 'about',
        title: 'Why are you here?',
        selections: [
          { id: 'professional', label: 'Who is Chris Moody?', next: 'professional' },
          { id: 'storytime', label: 'Tell me a story', next: 'storytime' },
          { id: 'resume', label: 'Show me the resume!', next: 'resume' },
        ],
      },
    ],
  },
  {
    id: 'storytime',
    title: 'Story Time!',
    next: 'purpose',
    defaultStep: 'story-selection',
    stepData: [
      {
        id: 'story-selection',
        title: 'What kind of story are you looking for?',
        selections: [
          { id: 'project-story', label: 'Project', next: 'beta' },
          { id: 'work-story', label: 'Work', next: 'work' },
          { id: 'fun-story', label: 'Fun', next: 'fun' },
        ],
      },
    ],
  },
  {
    id: 'fun',
    next: 'purpose',
    defaultStep: '0',
    title: 'Flair',
    stepData: [
      {
        id: '0',
        next: '1',
        title: 'A long time ago I was working on an app at a digital agency in NYC.'
      },
      {
        id: '1',
        next: '2',
        title: 'I had built the user interface based on PSDs provided by the creative team, and it was ready for review.'
      },
      {
        id: '2',
        next: '3',
        title: 'The Art director came over to my desk, and he gave confirming grunts as I went over the layout.'
      },
      {
        id: '3',
        next: '4',
        title: 'When I was done, he said “This looks awesome, great work! One thing though, could we add some flair to the buttons?”'
      },
      {
        id: '4',
        next: '5',
        title: '“Sure,” I replied. “What did you have in mind?”'
      },
      {
        id: '5',
        next: '6',
        title: '“You know! Pop! Pizazz!” He paused briefly while he searched for new a word, “Flair!”'
      },
      {
        id: '6',
        next: '7',
        title: 'Realizing that further conversation would be counter-productive, I smiled and said “You got it!”'
      },
      {
        id: '7',
        title: 'And then I added some Flair!'
      }
    ],
  },
  {
    id: 'work',
    next: 'purpose',
    defaultStep: '0',
    title: 'Make it bad',
    stepData: [
      {
        id: '0',
        next: '1',
        title: 'A long time ago I was working at a digital agency in NYC (do they all start like this?)'
      },
      {
        id: '1',
        next: '2',
        title: 'One of the pharmaceutical client accounts had recently gained new leadership in the form of a transplant from a big American beer brand'
      },
      {
        id: '2',
        next: '3',
        title: 'This guy was used to seeing flashy and exciting things, and was unwilling to accept that pharma had to be boring'
      },
      {
        id: '3',
        next: '4',
        title: 'The project was a simple set of banner ads, but the engineering manager warned me that this account was pushing the creative concepts to the limit. She was not confident that we ci=ould deliver what they wanted.'
      },
      {
        id: '4',
        next: '5',
        title: 'I understood the assignment, and decided that the best way to animate the design was to leverage WebGL to simulate smoke in the form of a particle emitter.'
      },
      {
        id: '5',
        next: '6',
        title: 'I was pleasantly surprised at what you could do within 40kb size limit'
      },
      {
        id: '6',
        next: '7',
        title: 'Everyone in our tech department loved it, except the engineering manager. She was terrified that people outside of the department would see it and then expect projects in the future to be up to par.'
      },
      {
        id: '7',
        next: '8',
        title: <span>“I need you to make it bad,” she said to me in hushed tones. I couldn&rsquo;t believe what I was hearing, but she was serious.</span>
      },
      {
        id: '8',
        title: 'I kept the particle emitter but stripped out WebGL and replaced the particles with img tags. It was gross, and then it got approved by a client who never got to see the greatness that was 😭'
      }
    ]
  },
  {
    id: 'beta',
    next: 'purpose',
    title: 'Beta the game',
    defaultStep: '0',
    stepData: [
      {
        id: '0',
        next: '1',
        title: 'During my startup phase, my partners and I created an ed-tech game centered around a cute little robot named Beta.'
      },
      {
        id: '1',
        next: '2',
        title: 'We created a runtime scripting language that Beta uses to manipulate his world and objects in it. We dubbed it CodePop!'
      },
      {
        id: '2',
        next: '3',
        title: 'CodePop sported an event model, conditional statements, loops, and simple custom functions.'
      },
      {
        id: '3',
        next: '4',
        title: 'We ran classes, camps and conference events where we showed attendees how to protoype a simple game on paper and then bring it to life using Beta!'
      },
      {
        id: '4',
        next: '5',
        title: 'Most of the kids we taught had never coded before, but left the event having successfully designed and programmed their own video games.'
      },
      {
        id: '5',
        next: '6',
        title: 'The genuine joy of discovery coupled with the undeniable educational benefits of critical and creative thinking made Beta a one of a kind experience.'
      },
      {
        id: '6',
        next: '7',
        title: 'All students received a BetaNet account with which they could continue to play and iterate on their games, make new ones, or experience what other creators were coming up with.'
      },
      {
        id: '7',
        title: 'Beta was a hit! 🎉'
      }
    ]
  },
  {
    id: 'professional',
    next: 'purpose',
    defaultStep: '0',
    title: 'About me',
    stepData: [
      {
        id: '0',
        next: '1',
        title: 'My name is Christopher, but please, call me Chris. Only my Mom feels the need to invoke all three syllables. You can if you want, but less is more, right?'
      },
      {
        id: '1',
        next: '2',
        title: <>My last name is Moody, and yeah I&rsquo;ve probably heard your joke already but go ahead and add it to the board.</>
      },
      {
        id: '2',
        next: '3',
        title: <>I&rsquo;m an engineer of the full-stack variety, specializing in javascript, user interfaces, and data visualization. And math. I get excited over a little geometry</>
      },
      {
        id: '3',
        next: '4',
        title: 'I have had a full and robust set of experiences working in the advertising, finance, and biological science industries across startups, agencies, and large corporations.'
      },
      {
        id: '4',
        next: '5',
        title: <>I&rsquo;ve seen projects with no budget and no time, projects with too much budget and too much time and everything in between</>
      },
      {
        id: '5',
        next: '6',
        title: 'I build websites, mobile and desktop applications, games, and advertisements.'
      },
      {
        id: '6',
        next: '7',
        title: 'Some of my favorite projects involve socket servers that enable real-time communication between networked devices, paving the way for remote-controlled media, or a live leaderboard connected to multiple game screens.'
      },
      {
        id: '7',
        next: '8',
        title: 'My favorite tools are Typescript, React, Vite, and MUI. I am proficient with all levels of javascript, ES5+. I am also familiar with a slew of other animation and visualization libraries such as gsap, highcharts, AG Grid, and D3 to name a few.'
      },
      {
        id: '8',
        title: <>My first language was Java before I dove heavily into AS3 in the early 2000s. Transitioning to full time javascript in ES5&rsquo;s heyday was a bit of a departure from the typed languages I was accustomed to, but there is fun to be had with closures as well! Typescript is my happy place these days.</>
      }
    ]
  }
]

export default wizards