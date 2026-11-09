import { MemoryItem, InteractionState } from '../types/game';

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'diya',
    title: 'THE FIRST DIYA',
    subtitle: 'One small flame',
    description:
      'Every Diwali starts with one small flame. Ours started the day you walked into my life, and look how bright it got.',
    actionPrompt: 'Light the first diya',
    shortPrompt: 'Light Diya',
    cinematicDialogue: 'A little light, a little happiness.',
    completedPrompt: 'The diya burns bright',
    position: [-3.8, 0.4, 6],
    characterTargetPos: [-3.0, 0, 6.0],
    characterTargetHeading: -Math.PI / 2, // Facing West toward doorway ledge
    cameraTarget: [-3.4, 0.8, 6.0],
    cameraOffset: [2.2, 1.4, -1.8],
    pose: 'bend',
    type: 'diya',
    unlocked: false,
    photoUrl: '/assets/aistudio/file_0000000081d882078ae16a2e9c29c523.png',
    photoCaption: 'Yellow mirror-work and royal black sherwani, glowing on Diwali night',
  },
  {
    id: 'rangoli',
    title: 'OUR RANGOLI',
    subtitle: 'Colors of us',
    description:
      'Every swirl was made sitting on our knees laughing as we messed up the border. But just like us, imperfect and full of color.',
    actionPrompt: 'Hold to draw it',
    shortPrompt: 'Draw Rangoli',
    cinematicDialogue: 'Colors of joy, drawn together with laughter.',
    completedPrompt: 'Our rangoli is complete',
    position: [0, 0.025, 1.0],
    characterTargetPos: [0, 0, -1.2],
    characterTargetHeading: 0, // Facing North toward rangoli center
    cameraTarget: [0, 0.3, 1.0],
    cameraOffset: [0, 3.2, -3.2], // Elevated 45-degree angle giving an expansive view of the 4.6m rangoli plaza
    pose: 'kneel',
    type: 'rangoli',
    unlocked: false,
    photoUrl: '/assets/aistudio/IMG_20260114_155204_0605.jpg',
    photoCaption: 'Festive outfits and bright peace signs under the warm sun',
  },
  {
    id: 'sit',
    title: 'SITTING TOGETHER',
    subtitle: 'Under a thousand lights',
    description:
      'Taking a quiet breath away from the noise. Sitting close to you, watching the golden lights reflect in your eyes.',
    actionPrompt: 'Sit together on the bench',
    shortPrompt: 'Sit Together',
    cinematicDialogue: 'Just you and me, under a thousand lights.',
    completedPrompt: 'Resting together',
    position: [-3.2, 0, 2.4],
    characterTargetPos: [-3.2, 0, 2.4],
    characterTargetHeading: Math.PI / 2, // Facing East toward street
    cameraTarget: [-3.0, 0.9, 2.4],
    cameraOffset: [2.6, 1.3, -1.2],
    pose: 'sit',
    type: 'sit',
    unlocked: false,
    photoUrl: '/assets/aistudio/20260228001404989.jpg',
    photoCaption: 'Resting close on your shoulder, peaceful warmth together',
  },
  {
    id: 'kandils',
    title: 'THE KANDILS',
    subtitle: 'Lanterns over our lane',
    description:
      'We hung these kandils together and argued about which one was crooked. Every one of them glows a little brighter because of you.',
    actionPrompt: 'Light the kandils',
    shortPrompt: 'Light Kandils',
    cinematicDialogue: 'Every lantern carries our wish into the night.',
    completedPrompt: 'The kandils are glowing',
    position: [0, 0, -4.0],
    characterTargetPos: [0, 0, -3.2],
    characterTargetHeading: 0,
    cameraTarget: [0, 2.8, -4.5],
    cameraOffset: [1.8, 1.5, -2.2],
    pose: 'look_up',
    type: 'kandil',
    unlocked: false,
    photoUrl: '/assets/aistudio/Snapchat-537623757.jpg',
    photoCaption: 'Night lights and deep glowing colors illuminating our smiles',
  },
  {
    id: 'sky_lantern',
    title: 'THE SKY LANTERN',
    subtitle: 'Our wish, flying',
    description:
      'We wrote our wish on a lantern and let it go. I won\'t tell you what it was, but you are in every word of it.',
    actionPrompt: 'Let it fly',
    shortPrompt: 'Release Sky Lantern',
    cinematicDialogue: 'Floating gently toward the stars.',
    completedPrompt: 'Our wish is in the stars',
    position: [3.2, 0, 9.0],
    characterTargetPos: [2.2, 0, 8.8],
    characterTargetHeading: Math.PI / 3,
    cameraTarget: [3.2, 2.4, 9.0],
    cameraOffset: [-2.6, 1.6, -2.2],
    pose: 'look_up',
    type: 'lantern',
    unlocked: false,
    photoUrl: '/assets/aistudio/Snapchat-1070186186.jpg',
    photoCaption: 'Gentle butterfly whispers, carrying our wishes to the stars',
  },
  {
    id: 'chakri',
    title: 'THE CHAKRI',
    subtitle: 'Round and round',
    description:
      'Life with you is a bit like this chakri: loud, bright, a little dizzy, and impossible to stop smiling at.',
    actionPrompt: 'Spin the chakri',
    shortPrompt: 'Spin Chakri',
    cinematicDialogue: 'Dizzy, bright, and impossible to stop smiling.',
    completedPrompt: 'Spinning with light',
    position: [-2.2, 0.05, 12.0],
    characterTargetPos: [-1.2, 0, 11.0],
    characterTargetHeading: -Math.PI / 3,
    cameraTarget: [-2.2, 0.1, 12.0],
    cameraOffset: [2.0, 2.4, -2.0], // Elevated angle looking down at the spinning circular trail of sparks
    pose: 'bend',
    type: 'chakri',
    unlocked: false,
    photoUrl: '/assets/aistudio/Snapchat-1917563654.jpg',
    photoCaption: 'Dizzy laughs, funny faces, and spinning with carefree joy',
  },
  {
    id: 'rocket',
    title: 'THE ROCKET',
    subtitle: 'Up to the stars',
    description:
      'One rocket, one wish, and the whole sky lit up. Some wishes come true when you are standing next to the right person.',
    actionPrompt: 'Launch the rocket',
    shortPrompt: 'Launch Rocket',
    cinematicDialogue: 'Lighting up the whole sky for you.',
    completedPrompt: 'Lighting up the night sky',
    position: [0, 0, 15.5],
    characterTargetPos: [-0.8, 0, 14.5],
    characterTargetHeading: 0,
    cameraTarget: [0, 12.0, 22.0], // Camera tilted upward towards starry sky
    cameraOffset: [1.8, 1.4, -3.5], // Wide angle capturing characters looking up in foreground
    pose: 'look_up',
    type: 'rocket',
    unlocked: false,
    photoUrl: '/assets/aistudio/Snapchat-2055378884.jpg',
    photoCaption: 'Under the night sky and stars, holding onto this moment',
  },
  {
    id: 'anar',
    title: 'THE ANAR',
    subtitle: 'A fountain of light',
    description:
      'You still step back three times before lighting an anar, and I still love standing right behind you, laughing.',
    actionPrompt: 'Light the anar',
    shortPrompt: 'Light Anar',
    cinematicDialogue: 'A sparkling fountain illuminating your face.',
    completedPrompt: 'Fountain of golden sparks',
    position: [2.5, 0, 13.5],
    characterTargetPos: [1.4, 0, 12.4],
    characterTargetHeading: Math.PI / 4,
    cameraTarget: [2.5, 2.2, 13.5], // Captures the full vertical height of the 4.5m fountain
    cameraOffset: [-2.8, 2.0, -2.8],
    pose: 'bend',
    type: 'anar',
    unlocked: false,
    photoUrl: '/assets/aistudio/IMG_20260114_160653.jpg',
    photoCaption: 'Eyes shining brighter than any golden fountain of sparks',
  },
  {
    id: 'phuljhadi',
    title: 'PHULJHADI',
    subtitle: 'Little sparks',
    description:
      'Writing each other\'s names in the air before the sparkler burns out. Every tiny golden spark reminds me of your smile.',
    actionPrompt: 'Wave sparklers',
    shortPrompt: 'Wave Sparklers',
    cinematicDialogue: 'Writing our names in golden sparks.',
    completedPrompt: 'Glowing sparklers',
    position: [0, 0, -8.0],
    characterTargetPos: [0, 0, -8.0],
    characterTargetHeading: 0,
    cameraTarget: [0, 1.1, -8.0],
    cameraOffset: [1.8, 1.4, -2.4],
    pose: 'reach_high',
    type: 'phuljhadi',
    unlocked: false,
    photoUrl: '/assets/aistudio/20261001010756412.jpg',
    photoCaption: 'Pure goofy joy and unstoppable giggles with sparklers',
  },
  {
    id: 'temple',
    title: 'THE TEMPLE BELL',
    subtitle: 'A quiet blessing',
    description:
      'A quiet pause at the mandir together. Close your eyes for a second. Every prayer I whispered at this bell was asking for a lifetime of Diwalis with you.',
    actionPrompt: 'Ring the temple bell',
    shortPrompt: 'Ring Temple Bell',
    cinematicDialogue: 'A quiet prayer whispered for our future.',
    completedPrompt: 'Blessed together',
    position: [3.8, 0, -1.0],
    characterTargetPos: [2.8, 0, -1.0],
    characterTargetHeading: Math.PI / 2,
    cameraTarget: [3.4, 1.6, -1.0],
    cameraOffset: [-2.2, 1.4, -1.6],
    pose: 'reach_high',
    type: 'temple',
    unlocked: false,
    photoUrl: '/assets/aistudio/Snapchat-316921561_8ae488ff.jpg',
    photoCaption: 'A quiet blessing before Lord Ganesha, praying for a lifetime of Diwalis together',
  },
  {
    id: 'mithai',
    title: 'MITHAI GHAR',
    subtitle: 'Sweeter together',
    description:
      'A box of freshly made kaju katli and hot jalebis. But in this entire glowing town, nothing is sweeter than you, Sushii.',
    actionPrompt: 'Share a sweet',
    shortPrompt: 'Share Sweets',
    cinematicDialogue: 'Nothing in this entire town is sweeter than you.',
    completedPrompt: 'Sweet moments together',
    position: [-3.5, 0, -5.0],
    characterTargetPos: [-2.6, 0, -5.0],
    characterTargetHeading: -Math.PI / 2,
    cameraTarget: [-3.0, 1.2, -5.0],
    cameraOffset: [2.2, 1.4, -1.6],
    pose: 'offer_sweet',
    type: 'mithai',
    unlocked: false,
    photoUrl: '/assets/aistudio/IMG20260424134939.jpg',
    photoCaption: 'Hot canteen noodles and sweet treats, sweeter than anything else',
  },
];

export function calculateDistance(
  pos1: [number, number, number],
  pos2: [number, number, number]
): number {
  const dx = pos1[0] - pos2[0];
  const dy = pos1[1] - pos2[1];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function findNearbyMemory(
  playerPos: [number, number, number],
  memories: MemoryItem[],
  interactionRadius = 3.2
): MemoryItem | null {
  let closest: MemoryItem | null = null;
  let minDistance = interactionRadius;

  for (const memory of memories) {
    const dist = calculateDistance(playerPos, memory.position);
    if (dist <= minDistance) {
      minDistance = dist;
      closest = memory;
    }
  }

  return closest;
}

export function getCompletedMemoriesCount(memories: MemoryItem[]): number {
  return memories.filter((m) => m.unlocked).length;
}

export function isAllMemoriesCompleted(memories: MemoryItem[]): boolean {
  return memories.length > 0 && memories.every((m) => m.unlocked);
}

export function clampPlayerPosition(
  x: number,
  z: number,
  minX = -4.5,
  maxX = 4.5,
  minZ = -14,
  maxZ = 18
): [number, number] {
  return [Math.max(minX, Math.min(maxX, x)), Math.max(minZ, Math.min(maxZ, z))];
}

export function getNextInteractionState(current: InteractionState): InteractionState {
  switch (current) {
    case 'idle':
      return 'approaching';
    case 'approaching':
      return 'playing_animation';
    case 'playing_animation':
      return 'completing_event';
    case 'completing_event':
      return 'returning_control';
    case 'returning_control':
      return 'idle';
    default:
      return 'idle';
  }
}
