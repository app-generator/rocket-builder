
/**
 * Limits the frequency of calling a function
 *
 * @param {number} delay - delay between calls in milliseconds
 * @param {function} fn - function to be throttled
 */
export default function throttled(delay, fn) {
  let lastCall = 0;

  return function (...args) {
    const now = new Date().getTime();

    if (now - lastCall < delay) {
      return;
    }

    lastCall = now;

    return fn(...args);
  };
}
