export const legitCheckApiCode = `/**
 * Legit Check API client.
 *
 * Two-stage upload to keep Gemini fast and Supabase as source of truth:
 *   1. Browser uploads photos to Supabase Storage  → photoUrls
 *   2. Same browser sends base64 photos to backend → Gemini Vision
 *      (base64 is for AI only, never persisted)
 *
 * Backend persists a LegitCheckReport row holding the AI verdict + the
 * Supabase URLs. Reports can be regenerated up to 3x per credit (Gemini
 * re-fetches photos from Supabase), archived, or linked to a published
 * auction listing.
 */

import apiClient from "./client";
import { ApiResponse } from "./config";
import type { AIAnalysisResult } from "@/types/features/listing.types";
import type { PhotoDto, UserAnalysisContext } from "./ai";

// ─── Types ──────────────────────────────────────────────────────────────

export interface LegitCheckReport {
  id: string;
  userId: string;
  category: string;
  sport: string | null;
  photos: string[];
  userDeclaredCondition: string | null;
  userDeclaredDefects: string | null;
  userItemHistory: string | null;
  userMeasurements: string | null;
  tagOptions: Record<string, unknown> | null;
  aiAnalysis: AIAnalysisResult;
  authenticityScore: number | null;
  tierConfidence: number | null;
  tier: string | null;
  linkedAuctionId: string | null;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface LegitCheckReportListItem {
  id: string;
  category: string;
  sport: string | null;
  tier: string | null;
  authenticityScore: number | null;
  tierConfidence: number | null;
  thumbnail: string | null;
  linkedAuctionId: string | null;
  createdAt: string;
}

export interface CreateLegitCheckPayload {
  category: string;
  sport?: string;
  /** Base64 photos for Gemini analysis (same shape as /ai/analyze). */
  photos: PhotoDto[];
  /** Supabase URLs persisted on the report row. Same order as photos. */
  photoUrls: string[];
  userDeclaredCondition?: string;
  userDeclaredDefects?: string;
  userItemHistory?: string;
  userMeasurements?: string;
  tagOptions?: Record<string, unknown>;
}

// Same generous timeout as /ai/analyze — Gemini + Google Search Grounding
// can spend 15–25 s, plus base64 upload time.
const LEGIT_CHECK_TIMEOUT_MS = 120_000;

/**
 * Run a Legit Check and persist as a report. The browser must upload
 * photos to Supabase BEFORE calling this (so photoUrls is populated) —
 * the base64 payload is for Gemini only and never stored.
 */
export const createLegitCheckReport = async (
  payload: CreateLegitCheckPayload,
): Promise<ApiResponse<{ report: LegitCheckReport; analysis: AIAnalysisResult }>> => {
  const response = await apiClient.post<
    ApiResponse<{ report: LegitCheckReport; analysis: AIAnalysisResult }>
  >("/ai/legit-check", payload, { timeout: LEGIT_CHECK_TIMEOUT_MS });
  return response.data;
};

/** Paginated dashboard list of the caller's reports. */
export const listLegitCheckReports = async (params?: {
  page?: number;
  limit?: number;
  tier?: string;
}): Promise<
  ApiResponse<{
    reports: LegitCheckReportListItem[];
    total: number;
    page: number;
    totalPages: number;
  }>
> => {
  const response = await apiClient.get<
    ApiResponse<{
      reports: LegitCheckReportListItem[];
      total: number;
      page: number;
      totalPages: number;
    }>
  >("/ai/legit-check/reports", { params });
  return response.data;
};

/** Full single report (including aiAnalysis JSON + photo URLs). */
export const getLegitCheckReport = async (
  id: string,
): Promise<ApiResponse<LegitCheckReport>> => {
  const response = await apiClient.get<ApiResponse<LegitCheckReport>>(
    \`/ai/legit-check/reports/\${encodeURIComponent(id)}\`,
  );
  return response.data;
};

/**
 * Refresh the scoring on an existing report — up to 3 times per credit,
 * NO additional credit charged. Server fetches the original photos from
 * Supabase and reruns Gemini with the same context.
 */
export const regenerateLegitCheckReport = async (
  id: string,
): Promise<
  ApiResponse<{
    report: LegitCheckReport;
    analysis: AIAnalysisResult;
    regenerationsUsed: number;
    regenerationsRemaining: number;
  }>
> => {
  const response = await apiClient.post<
    ApiResponse<{
      report: LegitCheckReport;
      analysis: AIAnalysisResult;
      regenerationsUsed: number;
      regenerationsRemaining: number;
    }>
  >(
    \`/ai/legit-check/reports/\${encodeURIComponent(id)}/regenerate\`,
    undefined,
    { timeout: LEGIT_CHECK_TIMEOUT_MS },
  );
  return response.data;
};

/** Soft-archive (hide from dashboard, kept in DB). */
export const archiveLegitCheckReport = async (
  id: string,
): Promise<ApiResponse<{ ok: true }>> => {
  const response = await apiClient.patch<ApiResponse<{ ok: true }>>(
    \`/ai/legit-check/reports/\${encodeURIComponent(id)}/archive\`,
  );
  return response.data;
};

/** Link a report to a published auction (called after listing creation). */
export const linkReportToAuction = async (
  id: string,
  auctionId: string,
): Promise<ApiResponse<{ ok: true }>> => {
  const response = await apiClient.patch<ApiResponse<{ ok: true }>>(
    \`/ai/legit-check/reports/\${encodeURIComponent(id)}/link-auction\`,
    { auctionId },
  );
  return response.data;
};

export type { PhotoDto, UserAnalysisContext };
`;
