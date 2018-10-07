import iDataObject from './interfaces';

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
  dataObject[key] = [];
  const observer: MutationObserver = new MutationObserver(() => {
    try {
      const curTime = Math.floor((Date.now() - now) / 5e2);
      const winIcon = gameUpdateBox.querySelector('.guessSuccessIcon');
      const leftWin = gameUpdateBox
        .querySelector('.item-left')
        .contains(winIcon);
      if (winIcon) {
        if (leftWin) {
          dataObject[key].push([curTime, 0]);
          console.log('left win');
        } else {
          dataObject[key].push([curTime, 1]);
          console.log('right win');
        }
        observer.disconnect();
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
        dataObject[key].push([
          curTime,
          curWinOdds,
          curLosOdds,
          curWinAmount,
          curLosAmount
        ]);
        lastData = curData;
        console.log([
          curTime,
          curWinOdds,
          curLosOdds,
          curWinAmount,
          curLosAmount
        ]);
      }
    } catch {
      now = Date.now();
    }
  });

  observer.observe(gameUpdateBox, { childList: true });
  return [];
}
