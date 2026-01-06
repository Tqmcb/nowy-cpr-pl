/**
 * This file provides patches for issues in the auto-generated Brain client
 */

import brain from '../brain';
import { RequestParams } from '../brain/http-client';

// Override the problematic duplicate method
const originalBrain = brain;

// Create a proxy to intercept the duplicate check_health method
const patchedBrain = new Proxy(originalBrain, {
  get(target, prop, receiver) {
    // Return only the first check_health implementation when accessed directly
    if (prop === 'check_health') {
      return (params: RequestParams = {}) => 
        target.request({
          path: `/_healthz`,
          method: "GET",
          ...params,
        });
    }
    
    return Reflect.get(target, prop, receiver);
  }
});

export default patchedBrain;
