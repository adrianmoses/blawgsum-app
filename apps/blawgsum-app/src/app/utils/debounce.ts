

export default function debounce(fn: Function, delayMs: number) {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delayMs);
  }
}
