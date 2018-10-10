import douyuGuessHelper from './douyuGuess';

const loopInvoke = function() {
  setTimeout(() => {
    try {
      douyuGuessHelper();
    } catch (error) {
      loopInvoke();
      console.log(error);
    }
  }, 1e3);
};
loopInvoke();
