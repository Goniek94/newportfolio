export const smartFormCode = `"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { SmartFormData, INITIAL_STATE, Photo } from "./types";
import SmartFormSteps from "./SmartFormSteps";
import { SuccessView } from "./steps";
import { SmartFormSummary } from "./summary";
import {
  createAuctionFromForm,
  updateListingVerification,
} from "@/lib/api/auctions.api";
import { uploadPhotos } from "@/lib/supabase";
import { analyzeListing } from "@/lib/api/ai";
import { logger } from "@/lib/logger";

/**
 * SmartForm — multi-step listing creation with branching paths.
 *
 * AI path:     Category → Photos → Pre-Analysis → Mode → AI Analysis → Edit → Pricing → Summary
 * Manual path: Category → Photos → Pre-Analysis → Mode → Details              → Pricing → Summary
 *
 * On publish:
 *   1. Upload photos to Supabase Storage
 *   2. Create the listing on the backend (gets an ID immediately)
 *   3. Show success screen — user is unblocked
 *   4. Fire-and-forget AI authenticity check in the background;
 *      when it returns, PATCH the listing with the score.
 *
 * The AI verification is decoupled from listing creation — slow Gemini calls
 * never block the UX. Worst case: listing shows up immediately, gets a
 * verification badge a few seconds later.
 */
export default function SmartForm({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<SmartFormData>(INITIAL_STATE);
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedPhotos, setPublishedPhotos] = useState<Photo[]>([]);
  const [publishedListingId, setPublishedListingId] = useState<string | null>(null);

  const update = (
    field: keyof SmartFormData,
    val: SmartFormData[keyof SmartFormData],
  ) => setData((prev) => ({ ...prev, [field]: val }));

  const handleNext = () => {
    setStep((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackNavigation = () => {
    if (step === 1) {
      onBack?.();
    } else {
      setStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);

      // 1. Upload photos to Supabase Storage
      const uploadedPhotos = await uploadPhotos(data.photos);

      // 2. Re-attach uploaded URLs onto the original Photo[] (preserves IDs/order)
      const photosWithIds: Photo[] = data.photos.map((photo, index) => ({
        ...photo,
        url: uploadedPhotos[index]?.url || photo.url,
      }));

      const dataWithPhotos: SmartFormData = { ...data, photos: photosWithIds };

      // 3. Create the listing — user gets unblocked the moment this returns
      const result = await createAuctionFromForm(dataWithPhotos);

      if (!result.success) {
        logger.error("[Publish] Failed", "SmartForm", { message: result.message });
        alert(\`Failed to create listing: \${result.message}\`);
        return;
      }

      logger.info("[Publish] Listing created", "SmartForm", { id: result.data?.id });

      setPublishedListingId(result.data?.id || null);
      setPublishedPhotos(photosWithIds);
      setData(dataWithPhotos);
      setIsPublished(true);

      // 4. Fire-and-forget AI authenticity check (Google Gemini)
      //    — slow, doesn't block UX. When it lands, PATCH the listing.
      const photoGroupKey = data.itemCategory || data.category || "shirts";
      const bgPhotos = photosWithIds
        .filter((p) => p.url?.startsWith("http"))
        .slice(0, 6) // cap at 6 photos to control Gemini cost
        .map((p) => ({ url: p.url, typeHint: p.typeHint || "front_far" }));

      if (bgPhotos.length > 0 && result.data?.id) {
        const listingId = result.data.id;
        analyzeListing(photoGroupKey, bgPhotos)
          .then((aiResult) => {
            if (aiResult.success && aiResult.data) {
              updateListingVerification(
                listingId,
                aiResult.data.authenticityScore,
                aiResult.data as unknown as Record<string, unknown>,
              );
            }
          })
          .catch(() => {
            // Silent — AI verification is best-effort. Listing still goes live.
          });
      }
    } catch (error) {
      logger.error("[Publish] Exception", "SmartForm", error);
      alert("An error occurred while publishing. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const totalSteps = data.completionMode === "AI" ? 7 : 6;

  if (isPublished) {
    return (
      <SuccessView
        status="live"
        title={data.title || "Your Listing"}
        listingId={publishedListingId || undefined}
        imageUrl={publishedPhotos[0]?.url || ""}
        onReset={() => {
          setIsPublished(false);
          setStep(1);
          setData(INITIAL_STATE);
          setPublishedPhotos([]);
          setPublishedListingId(null);
        }}
      />
    );
  }

  // Final summary + publish
  if (step === totalSteps + 1) {
    return (
      <div className="min-h-screen pb-24 pt-24 px-4 max-w-7xl mx-auto">
        <SmartFormSummary
          data={data}
          onPublish={handlePublish}
          onBack={handleBackNavigation}
          isPublishing={isPublishing}
        />
      </div>
    );
  }

  // Steps with their own nav controls — hide the global next/back buttons
  const hideNavButtons =
    step === 1 || step === 2 || step === 4 ||
    (step === 5 && data.completionMode === "AI") ||
    (step === 6 && data.completionMode === "AI");

  return (
    <div className="min-h-screen pb-24 pt-20">
      {/* Progress bar */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-4 py-3 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-500 ease-out"
              style={{ width: \`\${(step / totalSteps) * 100}%\` }}
            />
          </div>
          <span className="text-xs font-bold font-mono text-gray-400">
            STEP {step}/{totalSteps}
          </span>
        </div>
      </div>

      <div className={\`px-4 mx-auto \${step === 6 && data.completionMode === "AI" ? "max-w-6xl" : "max-w-4xl"}\`}>
        <SmartFormSteps
          step={step}
          data={data}
          update={update}
          onNext={handleNext}
          onBack={handleBackNavigation}
        />

        {!hideNavButtons && (
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBackNavigation}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              {step === 1 ? "Cancel" : "Back"}
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-10 py-3 rounded-xl font-bold text-white bg-black hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all hover:scale-[1.02] active:scale-95"
            >
              {step === totalSteps ? "Review Listing" : "Next"} <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
`;
