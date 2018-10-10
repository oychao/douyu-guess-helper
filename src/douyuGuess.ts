import parseGameUpdateBox from './parseGameUpdateBox';

const path: string = document.location.href.split('/').pop();

function startRecording(guessBox: Element): void {
  const guessGameBox = Array.from(guessBox.querySelectorAll('.guess-game-box'));
  const guessGameUpdateBox = Array.from(
    guessBox.querySelectorAll('.guess-game-update-box')
  );

  const now = new Date();

  guessGameUpdateBox.forEach((gameUpdateBox, idx) => {
    const key = `${path}_${guessGameBox[idx].getAttribute('data-qid')}`;
    const question: string = gameUpdateBox.querySelector('.box-left')
      .textContent;
    const left: string = gameUpdateBox.querySelector('.item-left .title')
      .textContent;
    const right: string = gameUpdateBox.querySelector('.item-right .title')
      .textContent;

    const meta = {
      path,
      question,
      index: idx,
      timestamp: `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate() +
        1}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`,
      content: {
        left,
        right
      }
    };
    chrome.runtime.sendMessage({
      key,
      type: 'new',
      payload: {
        meta,
        data: [Date.now(), 0, 0, 0, 0]
      }
    });
    parseGameUpdateBox(key, meta, gameUpdateBox);
  });
}

export default function(debug: boolean = false): void {
  (<any>window).__DOUYU_GUESS_HELPER_DEBUG__ = debug;

  const guessBox: HTMLElement = document.querySelector('.guess-game-box-body');

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
          startRecording(guessBox);
        }
      }
    }
  );

  observer.observe(guessBox, config);

  startRecording(guessBox);
}
