export type CharacterPose =
  | 'idle'
  | 'walk'
  | 'bend'
  | 'kneel'
  | 'reach_high'
  | 'look_up'
  | 'sit'
  | 'offer_sweet';

export type InteractionState =
  | 'idle'
  | 'approaching'
  | 'interacting'
  | 'playing_animation'
  | 'completing_event'
  | 'returning_control';

export interface MemoryItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  actionPrompt: string;
  shortPrompt: string;
  cinematicDialogue: string;
  completedPrompt?: string;
  position: [number, number, number]; // x, y, z in world
  characterTargetPos: [number, number, number];
  characterTargetHeading: number;
  cameraTarget: [number, number, number];
  cameraOffset: [number, number, number];
  pose: CharacterPose;
  type:
    | 'diya'
    | 'kandil'
    | 'rangoli'
    | 'lantern'
    | 'chakri'
    | 'rocket'
    | 'anar'
    | 'phuljhadi'
    | 'temple'
    | 'mithai'
    | 'sit';
  unlocked: boolean;
  photoUrl?: string;
  photoCaption?: string;
}

export type GameState =
  | 'title'
  | 'loading'
  | 'mode_select'
  | 'playing'
  | 'cinematic'
  | 'finale';
export type CameraMode = 'follow' | 'orbit' | 'cinematic' | 'first_person';
export type TourMode = 'walk' | 'tour';

export interface PlayerInput {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
  lookAtTarget?: boolean;
}
