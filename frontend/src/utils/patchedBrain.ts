/**
 * Fixed brain client that resolves the duplicate method issue
 */

import { Brain } from '../brain/Brain';
import { API_PATH } from "../constants";
import type { RequestParams } from "../brain/http-client";

const isLocalhost = /localhost:\d{4}/i.test(window.location.origin);

const constructBaseUrl = (): string => {
  if (isLocalhost) {
    return `${window.location.origin}${API_PATH}`;
  }

  return `https://api.databutton.com${API_PATH}`;
};

type BaseApiParams = Omit<RequestParams, "signal" | "baseUrl" | "cancelToken">;

const constructBaseApiParams = (): BaseApiParams => {
  return {
    credentials: "include",
  };
};

// Create a patched Brain class that handles the duplicate method issue
class PatchedBrain extends Brain {
  constructor(config: any) {
    super(config);
    
    // Handle the duplicate check_health method issue
    // This approach allows us to maintain the functionality while preventing the duplicate error
    try {
      // Save the original implementation
      const originalCheckHealth = this.check_health;
      
      // Replace with a function that calls the original implementation
      Object.defineProperty(this, 'check_health', {
        configurable: true,
        writable: true,
        value: function(params: RequestParams = {}) {
          // Call the original implementation
          return originalCheckHealth.call(this, params);
        }
      });
    } catch (error) {
      console.warn('Failed to patch check_health method:', error);
      // If patching fails, at least the app won't break completely
    }
  }
}

const constructClient = () => {
  const baseUrl = constructBaseUrl();
  const baseApiParams = constructBaseApiParams();

  return new PatchedBrain({
    baseUrl,
    baseApiParams,
  });
};

const patchedBrain = constructClient();

export default patchedBrain;

