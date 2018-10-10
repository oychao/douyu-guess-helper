import iDataObject from './interfaces';

import storageUtil from './storageUtil';
import parseGameUpdateBox from './parseGameUpdateBox';

const title: string = document.location.href.split('/').pop();

function startRecording(dataObject: iDataObject, guessBox: Element): void {
  const elementGuess = Array.from(
    guessBox.querySelectorAll('.guess-game-update-box')
  );
  elementGuess.forEach((gameUpdateBox, idx) =>
    parseGameUpdateBox(dataObject, `${title}-${idx}`, gameUpdateBox)
  );
}

let inited: boolean = false;

export default function(debug: boolean = false): void {
  (<any>window).__DOUYU_GUESS_HELPER_DEBUG__ = debug;

  if (inited) {
    return;
  }

  inited = true;

  const guessBox: HTMLElement = document.querySelector('.guess-game-box-body');

  const dataObject: iDataObject = storageUtil.read();

  const config: object = { attributes: true, childList: true, subtree: true };

  const observer = new MutationObserver(
    (mutationsList: Array<MutationRecord>): void => {
      for (const mutation of mutationsList) {
        const addedNodes: Array<any> = Array.from(mutation.addedNodes);
        if (
          mutation.type == 'childList' &&
          mutation.addedNodes.length &&
          addedNodes[0].classList.contains('hasGuessBox')
        ) {
          startRecording(dataObject, guessBox);
        }
      }
    }
  );

  observer.observe(guessBox, config);

  startRecording(dataObject, guessBox);
}
