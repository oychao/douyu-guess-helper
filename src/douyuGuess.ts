import iDataObject from './interfaces';

import parseGameUpdateBox from './parseGameUpdateBox';

const title: string = document.location.href.split('/').pop();

export default function(): void {
  const guessBox = document.querySelector('.guess-game-box-body');

  const elementGuess = Array.from(
    guessBox.querySelectorAll('.guess-game-update-box')
  );

  const dataObject: iDataObject = {};

  elementGuess.forEach((gameUpdateBox, idx) =>
    parseGameUpdateBox(dataObject, `${title}-${idx}`, gameUpdateBox)
  );
}
