import iDataObject from './interfaces';

import storageUtil from './storageUtil';

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
  dataObject: iDataObject,
  mark: string,
  gameUpdateBox: Element
): object {
  let lastData: string;
  let now: number = Date.now();
  const key: string = `${mark}-${now}`;
  dataObject[key] = {
    data: [],
    winner: -1
  };
  const observer: MutationObserver = new MutationObserver(() => {
    try {
      const curTime = Math.floor((Date.now() - now) / 5e2);
      const winIcon = gameUpdateBox.querySelector('.guessSuccessIcon');
      const leftWin = gameUpdateBox
        .querySelector('.item-left')
        .contains(winIcon);
      if (winIcon) {
        if (leftWin) {
          dataObject[key].winner = 0;
          if ((<any>window).__DOUYU_GUESS_HELPER_DEBUG__) {
            console.log('left win');
          }
        } else {
          dataObject[key].winner = 1;
          if ((<any>window).__DOUYU_GUESS_HELPER_DEBUG__) {
            console.log('right win');
          }
        }
        dataObject[key].data.pop();
        observer.disconnect();
        storageUtil.write(dataObject);
        return;
      }

      const curWinOdds = convertToNumber(
        gameUpdateBox.querySelector('.item-left .peilv').textContent.slice(2)
      );
      const curLosOdds = convertToNumber(
        gameUpdateBox.querySelector('.item-right .peilv').textContent.slice(2)
      );

      const curWinAmount = convertToNumber(
        gameUpdateBox.querySelector('.bidNum-left').textContent
      );
      const curLosAmount = convertToNumber(
        gameUpdateBox.querySelector('.bidNum-right').textContent
      );
      const curData = `${curWinOdds} ${curLosOdds} ${curWinAmount} ${curLosAmount}`;
      if (curData !== lastData) {
        dataObject[key].data.push([
          curTime,
          curWinOdds,
          curLosOdds,
          curWinAmount,
          curLosAmount
        ]);
        lastData = curData;
        if ((<any>window).__DOUYU_GUESS_HELPER_DEBUG__) {
          console.log([
            curTime,
            curWinOdds,
            curLosOdds,
            curWinAmount,
            curLosAmount
          ]);
        }
      }
    } catch {
      now = Date.now();
    }
  });

  observer.observe(gameUpdateBox, { childList: true });
  return [];
}
