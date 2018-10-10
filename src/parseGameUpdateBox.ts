// import * as tf from '@tensorflow/tfjs';

// const test = tf.sequential();

function convertToNumber(str: string): number {
  let result: number = NaN;
  if (str.includes('万')) {
    result = +str.replace('万', '') * 1e4;
  } else {
    result = +str;
  }
  return result;
}

export default function(
  key: string,
  meta: object,
  gameUpdateBox: Element
): object {
  let lastData: string;
  let now: number = Date.now();
  const observer: MutationObserver = new MutationObserver(() => {
    try {
      const winIcon = gameUpdateBox.querySelector('.guessSuccessIcon');
      const leftWin = gameUpdateBox
        .querySelector('.item-left')
        .contains(winIcon);
      if (winIcon) {
        chrome.runtime.sendMessage({
          key,
          type: 'end',
          payload: {
            result: leftWin ? 0 : 1
          }
        });
        observer.disconnect();
        return;
      }

      const curWinOdds: number = convertToNumber(
        gameUpdateBox.querySelector('.item-left .peilv').textContent.slice(2)
      );
      const curLosOdds: number = convertToNumber(
        gameUpdateBox.querySelector('.item-right .peilv').textContent.slice(2)
      );

      const curWinAmount: number = convertToNumber(
        gameUpdateBox.querySelector('.bidNum-left').textContent
      );
      const curLosAmount: number = convertToNumber(
        gameUpdateBox.querySelector('.bidNum-right').textContent
      );
      const curData: string = `${curWinOdds} ${curLosOdds} ${curWinAmount} ${curLosAmount}`;
      if (curData !== lastData) {
        lastData = curData;
        chrome.runtime.sendMessage({
          key,
          type: 'data',
          payload: {
            meta,
            data: [
              Date.now(),
              curWinOdds,
              curLosOdds,
              curWinAmount,
              curLosAmount
            ]
          }
        });
      }
    } catch {
      now = Date.now();
    }
  });

  observer.observe(gameUpdateBox, { childList: true });
  return [];
}
