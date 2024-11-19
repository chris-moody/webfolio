import * as d3 from 'd3'
import balance from '@/assets/pins/balance.png'
import batman from '@/assets/pins/batman.png'
import xmen from '@/assets/pins/xmen.png'
import jake from '@/assets/pins/jake.png'
import nocryinginbaseball from '@/assets/pins/nocryinginbaseball.png'
import rollsafe from '@/assets/pins/rollsafe.png'
import palmtree from '@/assets/pins/palmtree.png'
import mario from '@/assets/pins/mario.png'
import xenomorph from '@/assets/pins/xenomorph.png'
import vote from '@/assets/pins/vote.png'
import butterbot from '@/assets/pins/butterbot.png'
import ssf2t from '@/assets/pins/ssf2t.png'
import resistanceisfutile from '@/assets/pins/resistanceisfutile.png'
import inigo from '@/assets/pins/inigo.png'
import greenranger from '@/assets/pins/greenranger.png'
import breakingbad from '@/assets/pins/breakingbad.png'
import ecko from '@/assets/pins/ecko.png'
import scouts from '@/assets/pins/scouts.png'
import luffy from '@/assets/pins/luffy.png'
import radioshack from '@/assets/pins/radioshack.png'
import thumbsup from '@/assets/pins/thumbsup.png'
import uchiha from '@/assets/pins/uchiha.png'
import kingofthehill from '@/assets/pins/kingofthehill.png'
import highground from '@/assets/pins/highground.png'
import imdoingmypart from '@/assets/pins/imdoingmypart.png'
import lukevsvader from '@/assets/pins/lukevsvader.png'
import triforce from '@/assets/pins/triforce.png'
import blockbuster from '@/assets/pins/blockbuster.png'
import byefelisha from '@/assets/pins/byefelisha.png'
import gonewiththewind from '@/assets/pins/gonewiththewind.png'
import protoman from '@/assets/pins/protoman.png'
import rebel from '@/assets/pins/rebel.png'
import wutang from '@/assets/pins/wutang.png'
import hanshotfirst from '@/assets/pins/hanshotfirst.png'
import garfield from '@/assets/pins/garfield.png'
import stevenuniverse from '@/assets/pins/stevenuniverse.png'
import kansas from '@/assets/pins/kansas.png'
import { useEffect, useState } from 'react'

export type PinData = {
  name: string
  background?: string
  group?: number
  r?: number
  x?: number
  y?: number
}
export const getPinData = () => [
  { name: 'kansas', background: kansas },
  { name: 'garfield', background: garfield },
  { name: 'hanshotfirst', background: hanshotfirst },
  { name: 'wutang', background: wutang },
  { name: 'rebel', background: rebel },
  { name: 'protoman', background: protoman },
  { name: 'gonewiththewind', background: gonewiththewind },
  { name: 'byefelisha', background: byefelisha },
  { name: 'blockbuster', background: blockbuster },
  { name: 'triforce', background: triforce },
  { name: 'lukevsvader', background: lukevsvader },
  { name: 'imdoingmypart', background: imdoingmypart },
  { name: 'stevenuniverse', background: stevenuniverse },
  { name: 'highground', background: highground },
  { name: 'kingofthehill', background: kingofthehill },
  { name: 'uchiha', background: uchiha },
  { name: 'thumbsup', background: thumbsup },
  { name: 'radioshack', background: radioshack },
  { name: 'luffy', background: luffy },
  { name: 'scouts', background: scouts },
  { name: 'ecko', background: ecko },
  { name: 'breakingbad', background: breakingbad },
  { name: 'greenranger', background: greenranger },
  { name: 'inigo', background: inigo },
  { name: 'resistanceisfutile', background: resistanceisfutile },
  { name: 'ssf2t', background: ssf2t },
  { name: 'butterbot', background: butterbot },
  { name: 'vote', background: vote },
  { name: 'xenomorph', background: xenomorph },
  { name: 'mario', background: mario },
  { name: 'palmtree', background: palmtree },
  { name: 'rollsafe', background: rollsafe },
  { name: 'nocryinginbaseball', background: nocryinginbaseball },
  { name: 'jake', background: jake },
  { name: 'xmen', background: xmen },
  { name: 'batman', background: batman },
  { name: 'balance', background: balance },
]

export const usePinPack = (width = 800, height = 200) => {
  const pinData = getPinData().map((d) => ({
    ...d,
    r: Math.min(150, Math.max(50, d.name.length * 5)),
  })) as d3.SimulationNodeDatum[]

  const [pins, setPins] = useState<d3.SimulationNodeDatum[]>(pinData)

  useEffect(() => {
    const ticked = () => {
      setPins(simulation.nodes())
    }

    const simulation = d3
      .forceSimulation(pins)
      .force('charge', d3.forceManyBody().strength(3))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide().radius((d) => (d as PinData).r || 1)
      )
      .on('tick', ticked)

    return () => {
      simulation.stop()
    }
  }, [height, pins, width])

  return pins
}
