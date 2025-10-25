import { hitInstallOnce } from './metricsClient';

declare global {
  interface Window {
    MAKE_LUCKY?: { hitInstallOnce: () => void };
  }
}

window.MAKE_LUCKY = {
  hitInstallOnce,
};
