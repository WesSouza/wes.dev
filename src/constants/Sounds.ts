export enum Sounds {
  chimes = 'chimes',
  chord = 'chord',
  ding = 'ding',
  tada = 'tada',
  theMicrosoftSound = 'theMicrosoftSound',
}

export const SoundsSrcs = {
  [Sounds.chimes]: require('../assets/CHIMES.mp3'),
  [Sounds.chord]: require('../assets/CHORD.mp3'),
  [Sounds.ding]: require('../assets/DING.mp3'),
  [Sounds.tada]: require('../assets/TADA.mp3'),
  [Sounds.theMicrosoftSound]: require('../assets/TheMicrosoftSound.mp3'),
};
