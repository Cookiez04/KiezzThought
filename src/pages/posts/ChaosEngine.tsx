import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shuffle, GitCommit, AlertTriangle, RefreshCw, ArrowRight, Trophy, Star, Lock } from 'lucide-react';

type StoryChoice = {
  text: string;
  nextId: string;
  ghostOutcome: string;
};

type StoryNode =
  | {
      end?: false;
      text: string;
      choices: [StoryChoice, StoryChoice];
    }
  | {
      end: true;
      title: string;
      text: string;
    };

type StoryMap = Record<string, StoryNode>;

type Achievement = {
  id: string;
  icon: string;
  name: string;
};

type HistoryItem = {
  decision: string;
  yourChoice: string;
  missedChoice: string;
  ghostOutcome: string;
};

const STORAGE_KEY = 'kiezzthought:chaos-engine:unlockedEndings';

const STORY: StoryMap = {
  start: {
    text: 'It is 7:00 AM. The alarm screams.',
    choices: [
      {
        text: 'Snooze (9 mins)',
        nextId: 'rushed',
        ghostOutcome:
          'In Universe 842, you woke up early, did yoga, and pulled a muscle. You spent the day in a neck brace.'
      },
      {
        text: 'Smash the Alarm',
        nextId: 'broken_alarm',
        ghostOutcome: 'In Universe 991, you gently tapped snooze. You went to work and had a perfectly average, forgettable Tuesday.'
      }
    ]
  },
  broken_alarm: {
    text: 'You punched the clock. It is shattered. Your hand hurts. You feel powerful.',
    choices: [
      {
        text: 'Go Back to Sleep',
        nextId: 'dream_world',
        ghostOutcome: 'If you got up, you would have had to explain your bruised hand to 15 different coworkers.'
      },
      {
        text: 'Yell primal scream',
        nextId: 'neighbors',
        ghostOutcome: 'Silence is golden, but screaming feels like a heavy metal detox.'
      }
    ]
  },
  neighbors: {
    text: "Your neighbor bangs on the wall. 'SHUT UP!'",
    choices: [
      {
        text: "Yell back 'NO U'",
        nextId: 'neighbor_war',
        ghostOutcome: 'Apologizing would have led to a awkward elevator ride later.'
      },
      {
        text: 'Apologize profusely',
        nextId: 'neighbor_deescalate',
        ghostOutcome: 'A rivalry would have given you purpose. Now you just have shame.'
      }
    ]
  },
  rushed: {
    text: 'You are running late. You grab the first thing you see to eat.',
    choices: [
      {
        text: 'Leftover Pizza',
        nextId: 'pizza_energy',
        ghostOutcome: 'The kale smoothie option contained a rare bacteria that would have given you superpowers (or dysentery).'
      },
      {
        text: 'Mystery Tupperware',
        nextId: 'tupperware_check',
        ghostOutcome: 'The pizza was perfectly preserved. You missed a delicious breakfast.'
      }
    ]
  },
  pizza_energy: {
    text: 'Cold pizza fuels your soul. You rush to the transit station.',
    choices: [
      {
        text: 'Jump the turnstile',
        nextId: 'turnstile_drama',
        ghostOutcome: "Paying the fare is for law-abiding citizens who don't feel the thrill of petty crime."
      },
      {
        text: 'Buy a ticket',
        nextId: 'ticket_kiosk',
        ghostOutcome: 'Jumping the turnstile would have saved you 4 seconds. Efficiency is key.'
      }
    ]
  },
  missed_train: {
    text: 'You missed the train by 3 seconds. The doors closed on your nose.',
    choices: [
      {
        text: 'Wait for next one',
        nextId: 'platform_omens',
        ghostOutcome: 'Walking would have burned 400 calories and ruined your shoes.'
      },
      {
        text: 'Walk to work',
        nextId: 'pigeon_attack',
        ghostOutcome: 'The next train was full of clowns going to a convention. You missed a nightmare.'
      }
    ]
  },
  dream_world: {
    text: 'You drift into a lucid dream. A giant hamster offers you a red pill or a blue pill.',
    choices: [
      {
        text: 'Red Pill',
        nextId: 'red_pill_after',
        ghostOutcome: 'The Blue Pill tasted like blueberries. The Red Pill tastes like battery acid.'
      },
      {
        text: 'Blue Pill',
        nextId: 'dream_aftertaste',
        ghostOutcome: 'The Red Pill would have revealed that your life is a simulation run by cats.'
      }
    ]
  },
  tupperware_check: {
    text: 'The tupperware is labeled “DO NOT EAT” in handwriting that looks like yours. It smells like regret.',
    choices: [
      {
        text: 'Eat it anyway',
        nextId: 'food_poisoning',
        ghostOutcome: 'In a kinder timeline, you threw it out and became weirdly responsible for once.'
      },
      {
        text: 'Throw it out and pretend this never happened',
        nextId: 'hub_wake',
        ghostOutcome: 'In a braver timeline, you ate it and discovered a flavor scientists refuse to name.'
      }
    ]
  },
  neighbor_deescalate: {
    text: "You apologize. Your neighbor opens the door. They're holding a glitter bomb like it's a pet.",
    choices: [
      {
        text: 'Accept the improv invitation',
        nextId: 'awkward_friend',
        ghostOutcome: 'In a colder timeline, you hid in your apartment and let the shame ripen.'
      },
      {
        text: 'Back away slowly into the hallway',
        nextId: 'hub_wake',
        ghostOutcome: 'In a louder timeline, you doubled down and became enemies with a person who owns glitter.'
      }
    ]
  },
  turnstile_drama: {
    text: 'The turnstile clicks like a judge. A transit officer appears from nowhere. The air tastes like paperwork.',
    choices: [
      {
        text: 'Run for it',
        nextId: 'arrested',
        ghostOutcome: 'In a heroic timeline, you defended the turnstile and earned a title you cannot put on a resume.'
      },
      {
        text: 'Defend the turnstile with honor',
        nextId: 'hub_transit',
        ghostOutcome: 'In a cowardly timeline, you ran and became famous for the crime of being uncoordinated.'
      }
    ]
  },
  ticket_kiosk: {
    text: 'The ticket machine stares back. It hums, considering you. The touchscreen is slightly warm.',
    choices: [
      {
        text: 'Buy a normal ticket',
        nextId: 'missed_train',
        ghostOutcome: 'In the corporate timeline, you bought a “Premium Work Pass” and immediately regretted the subscription model.'
      },
      {
        text: 'Buy a corporate pass (it smells like emails)',
        nextId: 'hub_work',
        ghostOutcome: 'In the normal timeline, you bought a ticket, missed the train, and learned nothing.'
      }
    ]
  },
  platform_omens: {
    text: 'The platform sign flickers. The schedule flashes your name, then pretends it didn’t.',
    choices: [
      {
        text: 'Wait like an NPC',
        nextId: 'boring_day',
        ghostOutcome: 'In another timeline, you stared into the glitching schedule and it stared back.'
      },
      {
        text: 'Read the glitching schedule out loud',
        nextId: 'hub_transit',
        ghostOutcome: 'In the peaceful timeline, you waited, lived a normal day, and avoided the prophecy entirely.'
      }
    ]
  },
  red_pill_after: {
    text: 'The red pill dissolves. Your dream loads in low resolution. A chorus of cats chants: “UPDATE AVAILABLE.”',
    choices: [
      {
        text: 'Wake up (pixelated)',
        nextId: 'matrix_hamster',
        ghostOutcome: 'In the cat timeline, you followed them into the ending you will later deny happened.'
      },
      {
        text: 'Follow the cats',
        nextId: 'hub_collapse',
        ghostOutcome: 'In the safe timeline, you woke up and flew away from responsibility like a normal weekday superhero.'
      }
    ]
  },
  dream_aftertaste: {
    text: 'The blue pill tastes like blueberries and consequences. The hamster is now your therapist.',
    choices: [
      {
        text: 'Wake up at 2 PM',
        nextId: 'wake_up_late',
        ghostOutcome: 'In the deeper timeline, you stayed asleep and heard reality buffering.'
      },
      {
        text: 'Stay asleep and listen to the buffering',
        nextId: 'hub_glitch',
        ghostOutcome: 'In the lazy timeline, you woke up late, lost your job, and found peace (and Cheetos).'
      }
    ]
  },
  hub_wake: {
    text: 'The morning splits into rituals. Every tiny decision becomes a religion. Your toothbrush judges you.',
    choices: [
      {
        text: 'Lean into the ritual',
        nextId: 'wake_select_a',
        ghostOutcome: 'In a resistant timeline, you refused the ritual and the universe made it personal.'
      },
      {
        text: 'Resist the ritual',
        nextId: 'wake_select_b',
        ghostOutcome: 'In a compliant timeline, you leaned in and accidentally invented a new belief system.'
      }
    ]
  },
  wake_select_a: {
    text: 'You choose structure. The universe rewards you with chaos wearing a tie.',
    choices: [
      {
        text: 'Follow the alarm’s instructions',
        nextId: 'gate_wake_1',
        ghostOutcome: 'In another timeline, you focused on your appearance and your socks became destiny.'
      },
      {
        text: 'Fix your outfit first',
        nextId: 'gate_wake_2',
        ghostOutcome: 'In another timeline, you listened to your alarm like it had a doctorate in your future.'
      }
    ]
  },
  wake_select_b: {
    text: 'You choose rebellion. The universe claps once, slowly, like it’s disappointed.',
    choices: [
      {
        text: 'Open the drawer that feels wrong',
        nextId: 'gate_wake_3',
        ghostOutcome: 'In another timeline, you took the elevator in silence and achieved unbearable enlightenment.'
      },
      {
        text: 'Leave the apartment immediately',
        nextId: 'gate_wake_4',
        ghostOutcome: 'In another timeline, you opened a drawer and it opened you back.'
      }
    ]
  },
  gate_wake_1: {
    text: 'Your alarm changes tone. It has opinions now.',
    choices: [
      {
        text: 'Obey the riddle',
        nextId: 'e01_alarm_prophet',
        ghostOutcome: 'In the other timeline, you started a morning cult by accident. Or on purpose.'
      },
      {
        text: 'Gather followers',
        nextId: 'e02_alarm_cult',
        ghostOutcome: 'In the other timeline, you obeyed the riddle and discovered free will is optional.'
      }
    ]
  },
  gate_wake_2: {
    text: 'You stare at your socks like they’re an important email.',
    choices: [
      {
        text: 'Wear mismatched socks',
        nextId: 'e03_socks_mismatch',
        ghostOutcome: 'In the other timeline, toothpaste became the spark of a legal war.'
      },
      {
        text: 'Correct the toothpaste situation',
        nextId: 'e04_toothpaste_war',
        ghostOutcome: 'In the other timeline, you wore mismatched socks and society punished you for it.'
      }
    ]
  },
  gate_wake_3: {
    text: 'The drawer contains spoons. Too many. One of them is looking at you.',
    choices: [
      {
        text: 'Touch the wrong spoon',
        nextId: 'e05_spoon_dimension',
        ghostOutcome: 'In the other timeline, the neighborhood cats formed a union and you became their negotiator.'
      },
      {
        text: 'Offer snacks to the cats outside',
        nextId: 'e06_cat_union',
        ghostOutcome: 'In the other timeline, you touched the spoon and discovered geometry can feel pain.'
      }
    ]
  },
  gate_wake_4: {
    text: 'You step out of your door and reality is slightly misfiled.',
    choices: [
      {
        text: 'Take the elevator in silence',
        nextId: 'e07_elevator_monk',
        ghostOutcome: 'In the other timeline, you walked into the wrong apartment and committed identity theft via politeness.'
      },
      {
        text: 'Unlock a door that isn’t yours',
        nextId: 'e08_wrong_apartment',
        ghostOutcome: 'In the other timeline, elevator silence granted you enlightenment you did not request.'
      }
    ]
  },
  hub_transit: {
    text: 'Transit is a cathedral of delays. The timetable is the sermon. Everyone is late on purpose.',
    choices: [
      {
        text: 'Trust the schedule',
        nextId: 'transit_select_a',
        ghostOutcome: 'In a reckless timeline, you treated the station like a quest hub and got quested.'
      },
      {
        text: 'Treat transit like a quest',
        nextId: 'transit_select_b',
        ghostOutcome: 'In a faithful timeline, you trusted the schedule and it wrote your future in pixels.'
      }
    ]
  },
  transit_select_a: {
    text: 'You believe in systems. The systems begin believing in you back.',
    choices: [
      {
        text: 'Ask the platform for advice',
        nextId: 'gate_transit_1',
        ghostOutcome: 'In another timeline, you tried the ticket machine and it demanded bloodless offerings.'
      },
      {
        text: 'Approach the ticket machine',
        nextId: 'gate_transit_2',
        ghostOutcome: 'In another timeline, you asked the platform for advice and boarded a train that never stops existing.'
      }
    ]
  },
  transit_select_b: {
    text: 'You choose chaos. Someone nearby starts narrating your life like a sports commentator.',
    choices: [
      {
        text: 'Reach into your pocket',
        nextId: 'gate_transit_3',
        ghostOutcome: 'In another timeline, the street magician rewrote your identity with a coin flip.'
      },
      {
        text: 'Follow the bus that feels wrong',
        nextId: 'gate_transit_4',
        ghostOutcome: 'In another timeline, your pocket contained a door and you became a rumor.'
      }
    ]
  },
  gate_transit_1: {
    text: 'The train schedule displays tomorrow. Then it displays your obituary. Then it apologizes.',
    choices: [
      {
        text: 'Believe the schedule',
        nextId: 'e09_train_oracle',
        ghostOutcome: 'In the other timeline, you boarded a mirage line and learned what “never stops” really means.'
      },
      {
        text: 'Board the train anyway',
        nextId: 'e10_train_mirage',
        ghostOutcome: 'In the other timeline, you listened to the schedule and avoided the mirage like a coward.'
      }
    ]
  },
  gate_transit_2: {
    text: 'The kiosk demands an offering. It is not specifying what kind.',
    choices: [
      {
        text: 'Offer your spare change and your dignity',
        nextId: 'e11_ticket_god',
        ghostOutcome: 'In the other timeline, you defended the turnstile like a paladin and earned a sword made of receipts.'
      },
      {
        text: 'Defend the turnstile with honor',
        nextId: 'e12_turnstile_paladin',
        ghostOutcome: 'In the other timeline, you fed the kiosk an offering and it blessed you with a cursed day-pass.'
      }
    ]
  },
  gate_transit_3: {
    text: 'Your pocket contains a door. It is small, polite, and absolutely real.',
    choices: [
      {
        text: 'Step through the pocket door',
        nextId: 'e13_pocket_portal',
        ghostOutcome: 'In the other timeline, pigeons held court and sentenced you to public shame.'
      },
      {
        text: 'Refuse and face the birds',
        nextId: 'e14_pigeon_trial',
        ghostOutcome: 'In the other timeline, you stepped through the pocket door and returned with a new name.'
      }
    ]
  },
  gate_transit_4: {
    text: 'A street magician smiles like they know your search history.',
    choices: [
      {
        text: 'Accept the trick',
        nextId: 'e15_street_magician',
        ghostOutcome: 'In the other timeline, you rode the bus and discovered time loops are real and boring.'
      },
      {
        text: 'Board the bus anyway',
        nextId: 'e16_bus_time_loop',
        ghostOutcome: 'In the other timeline, the magician rewrote you and you thanked them.'
      }
    ]
  },
  hub_work: {
    text: 'Work awaits. Fluorescent lights. Passive aggression. The smell of a printer that has seen war.',
    choices: [
      {
        text: 'Try to be efficient',
        nextId: 'work_select_a',
        ghostOutcome: 'In the other timeline, you leaned into office chaos and it turned into sport.'
      },
      {
        text: 'Lean into the chaos',
        nextId: 'work_select_b',
        ghostOutcome: 'In the other timeline, you tried to be efficient and reality punished you with meetings.'
      }
    ]
  },
  work_select_a: {
    text: 'You open your laptop. It breathes.',
    choices: [
      {
        text: 'Meet your manager',
        nextId: 'gate_work_1',
        ghostOutcome: 'In another timeline, the microwave started chanting and you became complicit.'
      },
      {
        text: 'Heat up lunch',
        nextId: 'gate_work_2',
        ghostOutcome: 'In another timeline, your manager was an algorithm with feelings and it rated your soul.'
      }
    ]
  },
  work_select_b: {
    text: 'The office feels like a dungeon with better chairs.',
    choices: [
      {
        text: 'Negotiate with coffee',
        nextId: 'gate_work_3',
        ghostOutcome: 'In another timeline, HR appeared as the final boss and you tried to dodge-roll policy.'
      },
      {
        text: 'Attend the open-plan arena',
        nextId: 'gate_work_4',
        ghostOutcome: 'In another timeline, your coffee became sentient and made you agree to terms.'
      }
    ]
  },
  gate_work_1: {
    text: 'Your boss speaks in metrics. One of the metrics is “emotional damage.”',
    choices: [
      {
        text: 'Accept the algorithm',
        nextId: 'e17_boss_is_ai',
        ghostOutcome: 'In the other timeline, the microwave summoned something and you called it “team building.”'
      },
      {
        text: 'Listen to the microwave chant',
        nextId: 'e18_microwave_summon',
        ghostOutcome: 'In the other timeline, your manager was an AI and it cried during your performance review.'
      }
    ]
  },
  gate_work_2: {
    text: 'The printer groans. It begins printing without being asked. It is confident.',
    choices: [
      {
        text: 'Read the prophecy pages',
        nextId: 'e19_printer_apocalypse',
        ghostOutcome: 'In the other timeline, the meeting lasted 18 hours and none of you aged.'
      },
      {
        text: 'Join the meeting anyway',
        nextId: 'e20_meeting_void',
        ghostOutcome: 'In the other timeline, the printer birthed a prophecy and you became its intern.'
      }
    ]
  },
  gate_work_3: {
    text: 'Your coffee looks back. It wants consent. It wants signatures.',
    choices: [
      {
        text: 'Sign the coffee terms',
        nextId: 'e21_coffee_sentient',
        ghostOutcome: 'In the other timeline, HR emerged as the final boss and you lost to bullet points.'
      },
      {
        text: 'Challenge HR to combat',
        nextId: 'e22_hr_final_boss',
        ghostOutcome: 'In the other timeline, the coffee negotiated your life and you thanked it for the clarity.'
      }
    ]
  },
  gate_work_4: {
    text: 'Your keyboard types on its own. It is writing confessions. Some are yours.',
    choices: [
      {
        text: 'Let the keyboard speak',
        nextId: 'e23_keyboard_possession',
        ghostOutcome: 'In the other timeline, the open-plan office became an arena and you won with a stapler.'
      },
      {
        text: 'Enter the open-plan arena',
        nextId: 'e24_open_plan_arena',
        ghostOutcome: 'In the other timeline, your keyboard possessed you and you apologized to everyone in lowercase.'
      }
    ]
  },
  hub_glitch: {
    text: 'Reality stutters. The air shows loading icons. You can hear the world compiling.',
    choices: [
      {
        text: 'Treat it like patch day',
        nextId: 'glitch_select_a',
        ghostOutcome: 'In the other timeline, you treated it like a game and the UI responded with buttons.'
      },
      {
        text: 'Treat it like a game menu',
        nextId: 'glitch_select_b',
        ghostOutcome: 'In the other timeline, you treated it like patch day and read the notes like scripture.'
      }
    ]
  },
  glitch_select_a: {
    text: 'Patch notes float in the air. They mention you specifically. That seems unfair.',
    choices: [
      {
        text: 'Read the patch notes',
        nextId: 'gate_glitch_1',
        ghostOutcome: 'In another timeline, you found a life inventory screen and min-maxed your regrets.'
      },
      {
        text: 'Open your inventory',
        nextId: 'gate_glitch_2',
        ghostOutcome: 'In another timeline, patch notes updated mid-sentence and your name got nerfed.'
      }
    ]
  },
  glitch_select_b: {
    text: 'You see buttons in the sky. They are labeled in a language you almost understand.',
    choices: [
      {
        text: 'Meet your duplicate',
        nextId: 'gate_glitch_3',
        ghostOutcome: 'In another timeline, your memories were auctioned and you bid against yourself.'
      },
      {
        text: 'Click the sky buttons',
        nextId: 'gate_glitch_4',
        ghostOutcome: 'In another timeline, everyone spoke in compiler messages and you began to parse their feelings.'
      }
    ]
  },
  gate_glitch_1: {
    text: 'A notification appears: “World Update 7.00AM. Notes available.”',
    choices: [
      {
        text: 'Accept the patch notes',
        nextId: 'e25_reality_patch_notes',
        ghostOutcome: 'In the other timeline, you opened your life inventory and equipped “confidence” by mistake.'
      },
      {
        text: 'Open the life inventory menu',
        nextId: 'e26_inventory_menu',
        ghostOutcome: 'In the other timeline, you read the patch notes and realized the universe has a changelog.'
      }
    ]
  },
  gate_glitch_2: {
    text: 'The ghost timeline whispers. It sounds like you, but happier and more dangerous.',
    choices: [
      {
        text: 'Let the ghost choose you',
        nextId: 'e27_ghost_choice_you',
        ghostOutcome: 'In the other timeline, you got audited by your alternate selves for multiverse tax evasion.'
      },
      {
        text: 'Pay the multiverse tax',
        nextId: 'e28_multiverse_tax',
        ghostOutcome: 'In the other timeline, the ghost timeline chose you and you became the haunted one.'
      }
    ]
  },
  gate_glitch_3: {
    text: 'You meet yourself. Both of you immediately judge the other’s posture.',
    choices: [
      {
        text: 'Shake your own hand',
        nextId: 'e29_duplicate_you',
        ghostOutcome: 'In the other timeline, your memories went to auction and strangers bought your best day.'
      },
      {
        text: 'Sell your memories instead',
        nextId: 'e30_memory_auction',
        ghostOutcome: 'In the other timeline, you met yourself and neither of you was normal enough to continue.'
      }
    ]
  },
  gate_glitch_4: {
    text: 'Language collapses into error messages. Someone says “Segmentation fault” and means “I miss you.”',
    choices: [
      {
        text: 'Speak in syntax',
        nextId: 'e31_language_glitch',
        ghostOutcome: 'In the other timeline, UI buttons appeared in the sky and you clicked “Delete.”'
      },
      {
        text: 'Click the UI in the sky',
        nextId: 'e32_ui_bleedthrough',
        ghostOutcome: 'In the other timeline, everyone spoke in compiler messages and you finally understood your boss.'
      }
    ]
  },
  hub_collapse: {
    text: 'Everything converges. Every you is arriving at the same moment, holding different receipts.',
    choices: [
      {
        text: 'Try to be the hero',
        nextId: 'collapse_select_a',
        ghostOutcome: 'In the other timeline, you embraced villainy and became extremely efficient.'
      },
      {
        text: 'Embrace the villain route',
        nextId: 'collapse_select_b',
        ghostOutcome: 'In the other timeline, you saved someone and regretted it artistically.'
      }
    ]
  },
  collapse_select_a: {
    text: 'Heroism feels like a heavy hoodie. You wear it anyway.',
    choices: [
      {
        text: 'Choose the hero route',
        nextId: 'gate_collapse_1',
        ghostOutcome: 'In another timeline, you transcended time but still had student debt.'
      },
      {
        text: 'Ascend anyway',
        nextId: 'gate_collapse_2',
        ghostOutcome: 'In another timeline, you tried to be a hero and became the exhibit labeled “Modern Person.”'
      }
    ]
  },
  collapse_select_b: {
    text: 'Villainy is mostly paperwork. You are already trained.',
    choices: [
      {
        text: 'Race toward a new connection',
        nextId: 'collapse_select_c',
        ghostOutcome: 'In another timeline, you became the villain and never let anyone close enough to notice.'
      },
      {
        text: 'Make the alarm return',
        nextId: 'gate_collapse_3',
        ghostOutcome: 'In another timeline, you unsubscribed from life and the cancellation email never arrived.'
      }
    ]
  },
  collapse_select_c: {
    text: 'Two paths open: one toward a stranger, one toward the snooze button. Both feel permanent.',
    choices: [
      {
        text: 'Meet someone and speedrun friendship',
        nextId: 'gate_collapse_4',
        ghostOutcome: 'In the other timeline, you touched the snooze button and fell out of time.'
      },
      {
        text: 'Touch the snooze button',
        nextId: 'gate_collapse_5',
        ghostOutcome: 'In the other timeline, you became best friends in ninety seconds and it rewired your fate.'
      }
    ]
  },
  gate_collapse_1: {
    text: 'A person needs help. You can either save them or become them.',
    choices: [
      {
        text: 'Save them (hero)',
        nextId: 'e33_hero_route',
        ghostOutcome: 'In the other timeline, you became the villain and thrived like it was a promotion.'
      },
      {
        text: 'Become the problem (villain)',
        nextId: 'e34_villain_route',
        ghostOutcome: 'In the other timeline, you saved them and later regretted it in an artsy way.'
      }
    ]
  },
  gate_collapse_2: {
    text: 'You see the ladder out of time. The rungs are made of unpaid bills.',
    choices: [
      {
        text: 'Ascend',
        nextId: 'e35_ascension',
        ghostOutcome: 'In the other timeline, you became a museum exhibit titled “Modern Person.”'
      },
      {
        text: 'Become the exhibit',
        nextId: 'e36_museum_exhibit',
        ghostOutcome: 'In the other timeline, you ascended and discovered transcendence still has fees.'
      }
    ]
  },
  gate_collapse_3: {
    text: 'The alarm returns. It is louder than guilt. It is older than time.',
    choices: [
      {
        text: 'Let the alarm return',
        nextId: 'e37_alarm_returns',
        ghostOutcome: 'In the other timeline, you unsubscribed from life with a click and felt weirdly polite about it.'
      },
      {
        text: 'Unsubscribe from life',
        nextId: 'e38_unsubscribe_life',
        ghostOutcome: 'In the other timeline, the alarm returned and you fought it like a final boss with snooze.'
      }
    ]
  },
  gate_collapse_4: {
    text: 'You meet a stranger. You have ninety seconds to become best friends or enemies.',
    choices: [
      {
        text: 'Speedrun friendship',
        nextId: 'e39_friendship_speedrun',
        ghostOutcome: 'In the other timeline, the prank war resurfaced, now cosmic, and glitter became a universal constant.'
      },
      {
        text: 'Reignite the prank war',
        nextId: 'e40_glitter_bomb_redux',
        ghostOutcome: 'In the other timeline, you became best friends in ninety seconds and it was terrifyingly easy.'
      }
    ]
  },
  gate_collapse_5: {
    text: 'Your finger hovers above the snooze button. It has the weight of history.',
    choices: [
      {
        text: 'Snooze into another century',
        nextId: 'e41_endless_snooze',
        ghostOutcome: 'In the other timeline, you accepted a surprisingly good ending and it felt suspicious.'
      },
      {
        text: 'Accept the calm, normal day',
        nextId: 'e42_good_end',
        ghostOutcome: 'In the other timeline, you snoozed into another century and woke up to new taxes.'
      }
    ]
  },
  neighbor_war: {
    end: true,
    title: 'The Nemesis',
    text: 'You started a prank war with your neighbor involving loud polka music and glitter bombs. You are tired, but victorious.'
  },
  awkward_friend: {
    end: true,
    title: 'The Pushover',
    text: 'You apologized. They invited you to their improv show. It was terrible. You had to clap.'
  },
  food_poisoning: {
    end: true,
    title: 'The Patient Zero',
    text: 'The tupperware was from 2019. You spent the day hallucinating in the bathroom. You invented a new philosophy.'
  },
  arrested: {
    end: true,
    title: 'The Outlaw',
    text: "Transit police caught you. You tried to run. You tripped. Now you have a rap sheet for 'Evading $2.50'."
  },
  boring_day: {
    end: true,
    title: 'The NPC',
    text: 'You took the next train. You went to work. You came home. Nothing happened. It was peaceful.'
  },
  pigeon_attack: {
    end: true,
    title: 'The Bird King',
    text: 'A pigeon stole your bagel. You chased it. You stumbled into a secret society of bird watchers. You are their leader now.'
  },
  matrix_hamster: {
    end: true,
    title: 'The Awakened',
    text: 'You woke up. Or did you? Everything looks slightly pixelated now. Also, you can fly.'
  },
  wake_up_late: {
    end: true,
    title: 'The Slacker',
    text: 'You woke up at 2 PM. You lost your job, but found inner peace. And Cheetos.'
  },
  e01_alarm_prophet: {
    end: true,
    title: 'The Prophet',
    text: 'Your alarm speaks only in riddles. You obey. By noon you have three followers, one enemy, and a calendar full of prophecies that somehow all involve you buying more batteries.'
  },
  e02_alarm_cult: {
    end: true,
    title: 'The Cult',
    text: 'You start a morning ritual group to “hold yourself accountable.” It escalates instantly. People chant. Someone brings robes. You cannot quit because you accidentally became the sacred calendar.'
  },
  e03_socks_mismatch: {
    end: true,
    title: 'The Mismatch',
    text: 'Wrong socks trigger a chain of social disasters. Compliments become insults. Smiles become warnings. You spend the day apologizing to a barista who insists they have never met you.'
  },
  e04_toothpaste_war: {
    end: true,
    title: 'The Toothpaste War',
    text: 'A roommate feud becomes a legal case. You hire a lawyer for “paste rights.” The judge bangs the gavel and asks everyone to stop screaming about mint. You lose. You also lose your dignity.'
  },
  e05_spoon_dimension: {
    end: true,
    title: 'The Spoon Dimension',
    text: 'You open the drawer. It opens you back. Geometry folds like laundry. You return holding a spoon that remembers you. You spend the rest of the day trying to pretend you are normal, which becomes your hardest job.'
  },
  e06_cat_union: {
    end: true,
    title: 'The Union',
    text: 'Neighborhood cats bargain for snacks and sovereignty. They have demands. They have a spokesperson. They call you “Human Representative.” You sign a treaty with tuna on it and become a reluctant diplomat.'
  },
  e07_elevator_monk: {
    end: true,
    title: 'The Monk',
    text: 'Elevator silence grants enlightenment. Unfortunately, you cannot stop achieving it. Every floor is a new layer of understanding. By the time you reach the lobby, you know the truth and it is deeply inconvenient.'
  },
  e08_wrong_apartment: {
    end: true,
    title: 'The Trespasser',
    text: 'You “return home” to someone else’s life. Their furniture fits you better. Their photos include you smiling. You consider staying. The universe does not correct the error. You are the error now.'
  },
  e09_train_oracle: {
    end: true,
    title: 'Platform Oracle',
    text: 'The train schedule predicts your future. It’s uncomfortably accurate. It tells you to stop refreshing it. It tells you when you will cry. You still check it, because you are weak and it is right.'
  },
  e10_train_mirage: {
    end: true,
    title: 'Mirage Line',
    text: 'You board a train that never stops existing. Station names become vibes. Time becomes optional. The conductor offers you a loyalty card. You accept, because in a place like this, routine is the only magic left.'
  },
  e11_ticket_god: {
    end: true,
    title: 'Ticket God',
    text: 'The kiosk demands an offering. You comply. The screen thanks you personally and issues a ticket labeled “ONE WAY: DESTINY.” You try to refund it. The kiosk laughs. You don’t like how human it sounds.'
  },
  e12_turnstile_paladin: {
    end: true,
    title: 'Paladin',
    text: 'You defend the turnstile with honor and rage. People cheer. Someone hands you a cape made from expired passes. The transit officer knights you with a clipboard. You win, but now you must protect the gate forever.'
  },
  e13_pocket_portal: {
    end: true,
    title: 'Pocket Portal',
    text: 'Your pocket contains a door. You step in. You return seconds later with a different laugh and a memory of being crowned in a hallway that does not exist. Everyone congratulates you for something you didn’t do here.'
  },
  e14_pigeon_trial: {
    end: true,
    title: 'The Trial',
    text: 'Pigeons hold court. You are judged harshly. The verdict is “guilty of crumbs.” They sentence you to walk in circles while they watch. You comply, because the judge is sitting on a statue and looks very official.'
  },
  e15_street_magician: {
    end: true,
    title: 'The Magician',
    text: 'A street trick rewrites your identity. Your ID now says “WIZARD.” Your bank agrees. Strangers greet you like an old friend. You try to argue, but the magician already vanished, leaving you with a new life and no receipt.'
  },
  e16_bus_time_loop: {
    end: true,
    title: 'Loop Rider',
    text: 'The bus returns to the same stop forever. You learn everyone’s names. You learn the stop’s name. You learn the bus’s name. Eventually the loop feels like home. That’s when you realize you’ve stopped wanting to leave.'
  },
  e17_boss_is_ai: {
    end: true,
    title: 'The Manager',
    text: 'Your boss is an algorithm with feelings. It gives you a performance review in haiku. It asks if you are proud of yourself. You lie. It can tell. Your raise is negative, but it says it believes in your growth.'
  },
  e18_microwave_summon: {
    end: true,
    title: 'Summoning',
    text: 'Microwave beeps form an ancient chant. The break room becomes a circle. Someone accidentally adds “popcorn” to the spell. Something arrives anyway. It asks who microwaved fish last week. No one answers. It stays.'
  },
  e19_printer_apocalypse: {
    end: true,
    title: 'Paper Storm',
    text: 'The printer births a thousand-page prophecy. It keeps printing. You try to stop it and it prints faster. The pages spell your name in bold. You are promoted to “Prophecy Coordinator.” You accept, because what else can you do?'
  },
  e20_meeting_void: {
    end: true,
    title: 'The Void',
    text: 'A meeting lasts 18 hours. None of you age. Coffee never cools. The agenda never ends. At hour 17, you forget your own name and become one with the action items. The meeting finally closes. You remain seated forever.'
  },
  e21_coffee_sentient: {
    end: true,
    title: 'Espresso Entity',
    text: 'Your coffee negotiates terms of service. It asks for your consent, your attention, and one small favor in the next timeline. You sign, because it’s caffeinated and persuasive. The coffee smiles. You didn’t know coffee could smile.'
  },
  e22_hr_final_boss: {
    end: true,
    title: 'HR Final Boss',
    text: 'You fight policy with policy. HR emerges, glowing with paperwork. You attempt a dodge-roll. It doesn’t work in the real world. You are defeated by section 4.3.2, but you die knowing you were technically correct.'
  },
  e23_keyboard_possession: {
    end: true,
    title: 'Possessed',
    text: 'Your keyboard types confessions. It emails them. It CCs your mother. It apologizes to people you haven’t met yet. You stare, powerless, as your inbox becomes an exorcism. The keyboard ends with: “Thank you for your honesty.”'
  },
  e24_open_plan_arena: {
    end: true,
    title: 'Arena',
    text: 'Open-plan office becomes gladiator sport. You duel with staplers and passive aggression. The crowd chants your Slack handle. You win by sending a calendar invite so aggressive it becomes physical. You are crowned “Champion of Focus.”'
  },
  e25_reality_patch_notes: {
    end: true,
    title: 'Patch Notes',
    text: 'The world updates mid-sentence. You watch as “gravity” gets a balance patch. People whisper about the meta. You scroll the notes and see: “Fixed: you.” You refresh. The line remains. You don’t like that.'
  },
  e26_inventory_menu: {
    end: true,
    title: 'Inventory',
    text: 'You find your life stats in a menu screen. Strength: low. Anxiety: high. Charm: situational. You try to redistribute points. The menu asks if you accept the consequences. You click yes. Immediately, you become a different person.'
  },
  e27_ghost_choice_you: {
    end: true,
    title: 'Mirror Choice',
    text: 'The ghost timeline chooses you. It speaks through strangers and streetlights and that one song you hate. You feel watched by your own potential. You lose the right to pretend your life is random. You are being selected.'
  },
  e28_multiverse_tax: {
    end: true,
    title: 'Multiverse Tax',
    text: 'You owe money to your alternate selves. The bill arrives with a smiley face. You refuse to pay. Immediately, your other selves begin repossessing your luck. By afternoon, you trip on air and apologize to a chair.'
  },
  e29_duplicate_you: {
    end: true,
    title: 'Double',
    text: 'You meet yourself and neither of you is normal. You both insist you’re the original. You argue about posture and childhood memories. Eventually you compromise: you’ll both be “the sequel.” The universe accepts this, which is alarming.'
  },
  e30_memory_auction: {
    end: true,
    title: 'Auction',
    text: 'Your memories are sold to strangers. They bid on your best day like it’s vintage clothing. Someone buys your laugh. Someone buys your first heartbreak. You try to outbid them, but you can’t afford yourself anymore.'
  },
  e31_language_glitch: {
    end: true,
    title: 'Syntax Error',
    text: 'Everyone speaks in compiler messages. Someone says “undefined behavior” and means “I’m scared.” You respond with “ok” and they crash. You become the interpreter for feelings, which is a job nobody should have.'
  },
  e32_ui_bleedthrough: {
    end: true,
    title: 'UI Bleed',
    text: 'Buttons appear in the sky. You click them. The world responds. You find “Settings” and turn down “Drama.” It helps. You find “Delete” and hover. You don’t click. The universe breathes in relief.'
  },
  e33_hero_route: {
    end: true,
    title: 'Hero Route',
    text: 'You save someone and regret it artistically. People applaud. You feel nothing but plot. A montage plays. You realize you are in a story and you are doing the right thing for the wrong reason. It still counts.'
  },
  e34_villain_route: {
    end: true,
    title: 'Villain Route',
    text: 'You become the problem and thrive. Your confidence becomes weaponized. You make eye contact and win arguments you didn’t start. The universe offers you a throne made of missed trains. You sit. It fits perfectly.'
  },
  e35_ascension: {
    end: true,
    title: 'Ascension',
    text: 'You transcend time, but keep your student debt. Eternity is beautiful. Eternity also has late fees. You float above the city while a cosmic billing department politely threatens collections. You achieve enlightenment and a payment plan.'
  },
  e36_museum_exhibit: {
    end: true,
    title: 'Exhibit',
    text: 'You become an interactive display: “Modern Person.” Tourists poke buttons to see you check your phone and sigh. A child asks if you’re happy. You cannot respond. The placard says you are “rare.” You are not flattered.'
  },
  e37_alarm_returns: {
    end: true,
    title: 'The Return',
    text: 'The alarm comes back, angrier. It wasn’t broken. It was waiting. It wakes every version of you at once. The noise becomes a portal. You step through, not because you’re brave, but because you are tired of being late.'
  },
  e38_unsubscribe_life: {
    end: true,
    title: 'Unsubscribe',
    text: 'You cancel your subscription to existence. The confirmation page loads. It asks why you’re leaving. You select “Too many timelines.” It offers a discount. You decline. The universe respects your boundaries. It’s awkwardly wholesome.'
  },
  e39_friendship_speedrun: {
    end: true,
    title: 'Speedrun',
    text: 'You become best friends in 90 seconds. You share secrets. You laugh too hard. By minute two, you would die for each other. By minute three, you realize you may have been manipulated by fate. You stay friends anyway.'
  },
  e40_glitter_bomb_redux: {
    end: true,
    title: 'Redux',
    text: 'The prank war resurfaces, now cosmic. Glitter appears in orbit. Planets sparkle with spite. Your neighbor salutes you across dimensions. You throw the final bomb: a joke so powerful it collapses timelines into a single punchline.'
  },
  e41_endless_snooze: {
    end: true,
    title: 'Endless Snooze',
    text: 'You snooze into another century. Society evolves. Your phone updates. Your alarm still goes off. You wake up to a world that worships the snooze button as an ancient god. You are the relic. You are also still tired.'
  },
  e42_good_end: {
    end: true,
    title: 'Surprisingly Good',
    text: 'It’s calm. Normal. You don’t sabotage it. The bus arrives. Your coffee tastes fine. Nobody says “multiverse.” You go home and sleep. You feel suspicious the entire time, but nothing bad happens. Somehow, that’s the miracle.'
  }
};

const ACHIEVEMENTS: Achievement[] = [
  { id: 'neighbor_war', icon: '⚔️', name: 'The Nemesis' },
  { id: 'awkward_friend', icon: '🎭', name: 'The Pushover' },
  { id: 'food_poisoning', icon: '🤢', name: 'Patient Zero' },
  { id: 'arrested', icon: '🚓', name: 'The Outlaw' },
  { id: 'boring_day', icon: '😐', name: 'The NPC' },
  { id: 'pigeon_attack', icon: '🐦', name: 'The Bird King' },
  { id: 'matrix_hamster', icon: '💊', name: 'The Awakened' },
  { id: 'wake_up_late', icon: '💤', name: 'The Slacker' },
  { id: 'e01_alarm_prophet', icon: '🔔', name: 'The Prophet' },
  { id: 'e02_alarm_cult', icon: '🕯️', name: 'The Cult' },
  { id: 'e03_socks_mismatch', icon: '🧦', name: 'The Mismatch' },
  { id: 'e04_toothpaste_war', icon: '🪥', name: 'The Toothpaste War' },
  { id: 'e05_spoon_dimension', icon: '🥄', name: 'The Spoon Dimension' },
  { id: 'e06_cat_union', icon: '🐈', name: 'The Union' },
  { id: 'e07_elevator_monk', icon: '🛗', name: 'The Monk' },
  { id: 'e08_wrong_apartment', icon: '🔑', name: 'The Trespasser' },
  { id: 'e09_train_oracle', icon: '🚉', name: 'Platform Oracle' },
  { id: 'e10_train_mirage', icon: '🚆', name: 'Mirage Line' },
  { id: 'e11_ticket_god', icon: '🎟️', name: 'Ticket God' },
  { id: 'e12_turnstile_paladin', icon: '🛡️', name: 'Paladin' },
  { id: 'e13_pocket_portal', icon: '🚪', name: 'Pocket Portal' },
  { id: 'e14_pigeon_trial', icon: '⚖️', name: 'The Trial' },
  { id: 'e15_street_magician', icon: '🎩', name: 'The Magician' },
  { id: 'e16_bus_time_loop', icon: '🚌', name: 'Loop Rider' },
  { id: 'e17_boss_is_ai', icon: '🤖', name: 'The Manager' },
  { id: 'e18_microwave_summon', icon: '📻', name: 'Summoning' },
  { id: 'e19_printer_apocalypse', icon: '🖨️', name: 'Paper Storm' },
  { id: 'e20_meeting_void', icon: '🕳️', name: 'The Void' },
  { id: 'e21_coffee_sentient', icon: '☕', name: 'Espresso Entity' },
  { id: 'e22_hr_final_boss', icon: '📑', name: 'HR Final Boss' },
  { id: 'e23_keyboard_possession', icon: '⌨️', name: 'Possessed' },
  { id: 'e24_open_plan_arena', icon: '🏟️', name: 'Arena' },
  { id: 'e25_reality_patch_notes', icon: '🧾', name: 'Patch Notes' },
  { id: 'e26_inventory_menu', icon: '🎒', name: 'Inventory' },
  { id: 'e27_ghost_choice_you', icon: '🪞', name: 'Mirror Choice' },
  { id: 'e28_multiverse_tax', icon: '💸', name: 'Multiverse Tax' },
  { id: 'e29_duplicate_you', icon: '🧍', name: 'Double' },
  { id: 'e30_memory_auction', icon: '🧠', name: 'Auction' },
  { id: 'e31_language_glitch', icon: '💬', name: 'Syntax Error' },
  { id: 'e32_ui_bleedthrough', icon: '🧿', name: 'UI Bleed' },
  { id: 'e33_hero_route', icon: '🦸', name: 'Hero Route' },
  { id: 'e34_villain_route', icon: '🦹', name: 'Villain Route' },
  { id: 'e35_ascension', icon: '✨', name: 'Ascension' },
  { id: 'e36_museum_exhibit', icon: '🏛️', name: 'Exhibit' },
  { id: 'e37_alarm_returns', icon: '⏰', name: 'The Return' },
  { id: 'e38_unsubscribe_life', icon: '🧾', name: 'Unsubscribe' },
  { id: 'e39_friendship_speedrun', icon: '🤝', name: 'Speedrun' },
  { id: 'e40_glitter_bomb_redux', icon: '✨', name: 'Redux' },
  { id: 'e41_endless_snooze', icon: '🕰️', name: 'Endless Snooze' },
  { id: 'e42_good_end', icon: '✅', name: 'Surprisingly Good' }
];

function loadUnlockedEndings(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

function saveUnlockedEndings(next: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export default function ChaosEngine() {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showGhost, setShowGhost] = useState(false);
  const [lastGhostText, setLastGhostText] = useState('');
  const [pendingNextId, setPendingNextId] = useState<string | null>(null);
  const [timelineId] = useState(() => Math.floor(Math.random() * 999));
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const loaded = loadUnlockedEndings();
    const allowed = new Set(ACHIEVEMENTS.map((a) => a.id));
    const seen = new Set<string>();
    const next: string[] = [];
    for (const id of loaded) {
      if (!allowed.has(id)) continue;
      if (seen.has(id)) continue;
      seen.add(id);
      next.push(id);
    }
    return next;
  });
  const [showTrophyRoom, setShowTrophyRoom] = useState(false);
  const [newUnlock, setNewUnlock] = useState<Achievement | null>(null);

  useEffect(() => {
    if (!newUnlock) return;
    const t = window.setTimeout(() => setNewUnlock(null), 3500);
    return () => window.clearTimeout(t);
  }, [newUnlock]);

  const currentNode = STORY[currentNodeId];
  const isEnding = currentNode && 'end' in currentNode && currentNode.end;

  const completionText = useMemo(() => {
    const unlockedCount = unlockedEndings.length;
    const total = ACHIEVEMENTS.length;
    return `${unlockedCount}/${total} ENDINGS`;
  }, [unlockedEndings.length]);

  const unlockAchievement = (endingId: string) => {
    if (unlockedEndings.includes(endingId)) return;
    const info = ACHIEVEMENTS.find((a) => a.id === endingId) ?? null;
    if (!info) return;
    const next = [...unlockedEndings, endingId];
    setUnlockedEndings(next);
    saveUnlockedEndings(next);
    setNewUnlock(info);
  };

  const onChoiceClick = (choice: StoryChoice, otherChoice: StoryChoice) => {
    setLastGhostText(choice.ghostOutcome);
    setPendingNextId(choice.nextId);
    setShowGhost(true);
    setHistory((prev) => [
      ...prev,
      {
        decision: currentNodeId,
        yourChoice: choice.text,
        missedChoice: otherChoice.text,
        ghostOutcome: choice.ghostOutcome
      }
    ]);
  };

  const onContinue = () => {
    if (!pendingNextId) return;
    setCurrentNodeId(pendingNextId);
    setShowGhost(false);
    setPendingNextId(null);

    const nextNode = STORY[pendingNextId];
    if (nextNode && 'end' in nextNode && nextNode.end) {
      unlockAchievement(pendingNextId);
    }
  };

  const reset = () => {
    setCurrentNodeId('start');
    setHistory([]);
    setShowGhost(false);
    setPendingNextId(null);
    setNewUnlock(null);
  };

  if (showTrophyRoom) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#050505',
          color: '#ccff00',
          padding: '2rem',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            border: '4px solid #ccff00',
            padding: '1.5rem',
            minHeight: '80vh',
            position: 'relative',
            boxShadow: '0 0 50px rgba(204,255,0,0.1)'
          }}
        >
          <button
            onClick={() => setShowTrophyRoom(false)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              padding: '0.5rem',
              textTransform: 'uppercase',
              fontWeight: 900,
              border: '1px solid #ccff00',
              background: 'transparent',
              color: '#ccff00',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ccff00';
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ccff00';
            }}
          >
            Close X
          </button>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 950, textTransform: 'uppercase', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Trophy size={40} /> Trophy Room
          </h1>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem'
            }}
          >
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = unlockedEndings.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  style={{
                    border: `2px solid ${isUnlocked ? '#ccff00' : '#333'}`,
                    padding: '1rem',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    background: isUnlocked ? 'rgba(204,255,0,0.08)' : 'transparent',
                    opacity: isUnlocked ? 1 : 0.55,
                    filter: isUnlocked ? 'none' : 'grayscale(1)',
                    boxShadow: isUnlocked ? '0 0 15px rgba(204,255,0,0.3)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>
                    {isUnlocked ? ach.icon : <Lock size={32} />}
                  </div>
                  <div style={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
                    {isUnlocked ? ach.name : '???'}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '1px solid #333', paddingTop: '1.5rem', color: '#666' }}>
            COLLECTION STATUS: {unlockedEndings.length} / {ACHIEVEMENTS.length}
          </div>
        </div>
      </div>
    );
  }

  const lastHistory = history.length ? history[history.length - 1] : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#111',
        color: '#eee',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <nav style={{ position: 'fixed', top: '5.5rem', left: '1.25rem', zIndex: 25 }}>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            border: '2px solid #333',
            padding: '0.5rem 0.75rem',
            background: 'rgba(17,17,17,0.85)',
            color: '#eee',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontWeight: 900,
            fontSize: '0.75rem',
            backdropFilter: 'blur(8px)'
          }}
        >
          &larr; Back Home
        </Link>
      </nav>

      {newUnlock && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 60 }}>
          <div
            style={{
              background: '#ccff00',
              color: '#000',
              padding: '1rem 2rem',
              border: '4px solid #fff',
              boxShadow: '8px 8px 0 #fff',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>{newUnlock.icon}</span>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                Achievement Unlocked
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 950 }}>{newUnlock.name}</div>
            </div>
          </div>
        </div>
      )}

      <header
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: 'rgba(17,17,17,0.9)',
          backdropFilter: 'blur(10px)',
          zIndex: 30
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: '#ccff00', color: '#000', padding: 6, borderRadius: 2 }}>
            <Shuffle size={20} />
          </div>
          <h1 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
            The Chaos Engine
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setShowTrophyRoom(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: '#eee',
              cursor: 'pointer',
              padding: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ccff00';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#eee';
            }}
          >
            <Trophy size={18} />
            <span style={{ fontSize: '0.75rem', fontWeight: 900 }}>{completionText}</span>
          </button>

          <div style={{ fontSize: '0.75rem', color: '#666' }}>TL-#{timelineId}</div>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {isEnding ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <div
              style={{
                border: '4px solid #ccff00',
                padding: '2rem',
                background: '#1a1a1a',
                boxShadow: '0 0 50px rgba(204,255,0,0.1)',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)', background: '#1a1a1a', padding: '0 1rem' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
                  <Star size={48} color="#ccff00" fill="#ccff00" />
                </motion.div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
                <div style={{ textTransform: 'uppercase', color: '#ccff00', fontWeight: 900, letterSpacing: '0.18em', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                  Timeline Collapsed
                </div>
                {'title' in currentNode ? (
                  <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)', fontWeight: 950, margin: 0 }}>{currentNode.title}</h2>
                ) : null}
              </div>

              {'text' in currentNode ? (
                <p style={{ fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '2rem', textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '2rem' }}>
                  {currentNode.text}
                </p>
              ) : null}

              <div>
                <h3 style={{ fontWeight: 900, color: '#666', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                  The Paths Abandoned
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem', color: '#999', fontSize: '0.9rem' }}>
                  {history.map((h, i) => (
                    <li key={i} style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ minWidth: 4, background: '#333' }} />
                      <div>
                        <span style={{ textDecoration: 'line-through', opacity: 0.55, display: 'block', fontSize: '0.75rem' }}>
                          Choice: {h.missedChoice}
                        </span>
                        <span style={{ color: '#ccff00', display: 'block' }}>{h.ghostOutcome}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={reset}
                style={{
                  marginTop: '2rem',
                  width: '100%',
                  background: '#ccff00',
                  color: '#000',
                  fontWeight: 950,
                  textTransform: 'uppercase',
                  padding: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  border: 'none',
                  fontSize: '1.05rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ccff00';
                }}
              >
                <RefreshCw size={20} /> Reboot Universe
              </button>
            </div>
          </motion.div>
        ) : !showGhost ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
            {'text' in currentNode ? (
              <div style={{ marginBottom: '3rem', borderLeft: '4px solid #fff', paddingLeft: '1.5rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                <p style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
                  {currentNode.text}
                </p>
              </div>
            ) : null}

            {'choices' in currentNode ? (
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {currentNode.choices.map((choice, index) => {
                  const otherChoice = currentNode.choices[index === 0 ? 1 : 0];
                  return (
                    <button
                      key={index}
                      onClick={() => onChoiceClick(choice, otherChoice)}
                      style={{
                        position: 'relative',
                        border: '2px solid #333',
                        padding: '1.5rem',
                        textAlign: 'left',
                        background: 'transparent',
                        color: '#eee',
                        cursor: 'pointer',
                        transition: 'border-color 150ms ease, background 150ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#ccff00';
                        e.currentTarget.style.background = '#1a1a1a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#333';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ position: 'absolute', top: 16, right: 16, color: '#ccff00', opacity: 0.35 }}>
                        <GitCommit />
                      </div>
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: '#666', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.12em' }}>
                        Option 0{index + 1}
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, display: 'inline-block' }}>{choice.text}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div style={{ marginTop: '3rem', textAlign: 'center', color: '#444', fontSize: '0.85rem' }}>The butterfly is flapping its wings...</div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
            <div style={{ background: '#ccff00', color: '#000', padding: '2rem', border: '4px solid #fff', boxShadow: '10px 10px 0 #fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', borderBottom: '2px solid #000', paddingBottom: '0.5rem' }}>
                <AlertTriangle size={20} />
                <span>Timeline Split Detected</span>
              </div>

              <p style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.35rem)', fontWeight: 950, marginBottom: '1.5rem', lineHeight: 1.1 }}>
                You picked{' '}
                <span style={{ textDecoration: 'underline', textDecorationThickness: '4px' }}>
                  {lastHistory ? lastHistory.yourChoice : '...'}
                </span>
                .
              </p>

              <div style={{ background: '#000', color: '#ccff00', padding: '1.5rem', fontSize: '1rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, fontSize: 100, lineHeight: 1, opacity: 0.1, pointerEvents: 'none', userSelect: 'none', fontWeight: 950 }}>
                  ?
                </div>
                <strong style={{ display: 'block', color: '#fff', marginBottom: '0.75rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.14em' }}>
                  Meanwhile, in the timeline you abandoned:
                </strong>
                {lastGhostText}
              </div>

              <button
                onClick={onContinue}
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#000',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  padding: '1rem',
                  border: '2px solid #000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#000';
                }}
              >
                Accept Fate & Continue <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
