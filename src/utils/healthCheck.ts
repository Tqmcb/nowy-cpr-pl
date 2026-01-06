/**
 * This file provides dedicated health check functions to avoid duplicate method issues
 */

import patchedBrain from './patchedBrain';
import { HttpResponse, RequestParams } from '../brain/http-client';

/**
 * Dedicated function to check application health status
 * This avoids the duplicate 'check_health' method issue in the generated client
 */
export async function checkApplicationHealth(params: RequestParams = {}): Promise<HttpResponse<any, any>> {
  return patchedBrain.request({
    path: `/_healthz`,
    method: "GET",
    ...params,
  });
}

/**
 * Dedicated function to check API health status
 * This avoids the duplicate 'check_health' method issue in the generated client
 */
export async function checkApiHealth(params: RequestParams = {}): Promise<HttpResponse<any, any>> {
  return brain.request({
    path: `/routes/health`,
    method: "GET",
    ...params,
  });
}
