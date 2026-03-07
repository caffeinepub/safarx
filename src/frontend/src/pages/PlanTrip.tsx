import ExploreMoreSection from "@/components/ExploreMoreSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { destinations } from "@/data/destinations";
import { useSaveItinerary } from "@/hooks/useQueries";
import useSEO from "@/hooks/useSEO";
import { generateFullItinerary } from "@/utils/geminiClient";
import type {
  GeneratedItinerary,
  GroupType,
  TravelStyle,
} from "@/utils/itineraryGenerator";
import {
  Calendar,
  CheckCircle2,
  Compass,
  MapPin,
  Users,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface PlanFormData {
  destinationId: string;
  duration: number;
  travelStyle: TravelStyle;
  groupType: GroupType;
}

const travelStyles: {
  value: TravelStyle;
  label: string;
  emoji: string;
  desc: string;
}[] = [
  {
    value: "Adventure",
    label: "Adventure",
    emoji: "🧗",
    desc: "Treks, rafting & thrills",
  },
  {
    value: "Relaxation",
    label: "Relaxation",
    emoji: "🧘",
    desc: "Spas, sunsets & serenity",
  },
  {
    value: "Cultural",
    label: "Cultural",
    emoji: "🏛️",
    desc: "Heritage, art & local life",
  },
  {
    value: "Budget",
    label: "Budget",
    emoji: "💰",
    desc: "Smart travel, max experience",
  },
];

const groupTypes: { value: GroupType; label: string; emoji: string }[] = [
  { value: "Solo", label: "Solo", emoji: "🧍" },
  { value: "Couple", label: "Couple", emoji: "👫" },
  { value: "Family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { value: "Friends", label: "Friends", emoji: "👯" },
];

interface GeneratedTripParams {
  itinerary: GeneratedItinerary;
  destinationName: string;
  duration: number;
  travelStyle: TravelStyle;
  groupType: GroupType;
}

export default function PlanTrip() {
  const [tripResult, setTripResult] = useState<GeneratedTripParams | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [generateError, setGenerateError] = useState<string | null>(null);

  const saveItinerary = useSaveItinerary();

  useSEO({
    title: "Plan My Trip",
    description:
      "Use SafarX's AI-powered trip planner to build a custom day-by-day India itinerary. Choose your destination, duration, travel style, and group type for a personalised journey.",
    ogTitle: "Plan Your Perfect India Trip — SafarX AI Itinerary Planner",
    ogDescription:
      "Build a personalised day-by-day India itinerary in seconds with SafarX's AI trip planner. Pick your destination, travel style, and group type for a journey crafted just for you.",
    ogImage: "/assets/generated/itinerary-planner-hero.dim_1200x500.png",
    ogUrl: "https://safarx.in/plan",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "Plan Your Perfect India Trip — SafarX AI Itinerary Planner",
    twitterDescription:
      "Build a personalised day-by-day India itinerary in seconds with SafarX's AI trip planner. Pick your destination, travel style, and group type for a journey crafted just for you.",
    twitterImage: "/assets/generated/itinerary-planner-hero.dim_1200x500.png",
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlanFormData>({
    defaultValues: {
      duration: 5,
      travelStyle: "Adventure",
      groupType: "Friends",
    },
  });

  const selectedDestId = watch("destinationId");
  const selectedStyle = watch("travelStyle");
  const selectedGroup = watch("groupType");
  const selectedDuration = watch("duration");

  const onSubmit = async (data: PlanFormData) => {
    setIsGenerating(true);
    setTripResult(null);
    setSaveStatus("idle");
    setGenerateError(null);

    const dest = destinations.find((d) => d.id === data.destinationId);
    if (!dest) {
      setGenerateError(
        "Destination not found. Please select a valid destination.",
      );
      setIsGenerating(false);
      return;
    }

    try {
      const result = await generateFullItinerary({
        destinationId: dest.id,
        destinationName: dest.name,
        state: dest.state,
        duration: Number(data.duration),
        travelStyle: data.travelStyle,
        groupType: data.groupType,
        highlights: dest.highlights,
        bestTimeToVisit: dest.bestTimeToVisit,
        howToReach: dest.howToReach,
      });

      setTripResult({
        itinerary: result,
        destinationName: dest.name,
        duration: Number(data.duration),
        travelStyle: data.travelStyle,
        groupType: data.groupType,
      });

      // Scroll to result
      setTimeout(() => {
        document
          .getElementById("itinerary-result")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      // Save to backend
      setSaveStatus("saving");
      try {
        await saveItinerary.mutateAsync({
          destination: dest.name,
          duration: Number(data.duration),
          travelStyle: data.travelStyle,
          groupType: data.groupType,
          itineraryJson: JSON.stringify(result),
        });
        setSaveStatus("saved");
      } catch (saveErr) {
        console.error("Failed to save itinerary:", saveErr);
        setSaveStatus("error");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to generate itinerary. Please try again.";
      setGenerateError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <div
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage:
            "url(/assets/generated/itinerary-planner-hero.dim_1200x500.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-terracotta-900/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 font-body text-xs font-semibold text-saffron-400 uppercase tracking-widest mb-3">
            <Wand2 className="w-3.5 h-3.5" />
            Gemini AI-Powered Planner
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-ivory-100 mb-4 text-shadow-hero">
            Plan Your Perfect Trip
          </h1>
          <p className="font-cormorant italic text-xl text-ivory-200 max-w-xl mx-auto">
            Tell us your dream destination and travel style — Gemini AI crafts a
            personalised day-by-day itinerary for you.
          </p>
        </div>
      </div>

      {/* Planner Form */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-3xl shadow-card p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center">
                <Compass className="w-5 h-5 text-saffron-600" />
              </div>
              <div>
                <h2 className="font-display font-bold text-2xl text-foreground">
                  Customise Your Journey
                </h2>
                <p className="font-body text-sm text-muted-foreground">
                  Fill in your preferences and Gemini AI will craft your
                  itinerary
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Destination */}
              <div className="space-y-2">
                <Label className="font-body text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Choose Your Destination{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedDestId}
                  onValueChange={(val) =>
                    setValue("destinationId", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    data-ocid="plan.destination.select"
                    className="font-body text-sm bg-background border-border w-full h-12"
                  >
                    <SelectValue placeholder="Select a destination…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {destinations.map((dest) => (
                      <SelectItem
                        key={dest.id}
                        value={dest.id}
                        className="font-body text-sm"
                      >
                        <span className="flex items-center gap-2">
                          {dest.name}
                          <span className="text-xs text-muted-foreground">
                            — {dest.state}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.destinationId && (
                  <p
                    data-ocid="plan.destination.error_state"
                    className="font-body text-xs text-destructive"
                  >
                    Please select a destination
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label className="font-body text-sm font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Trip Duration:{" "}
                  <span className="text-primary font-bold">
                    {selectedDuration} Days
                  </span>
                </Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={14}
                    value={selectedDuration}
                    onChange={(e) =>
                      setValue("duration", Number(e.target.value))
                    }
                    className="flex-1 h-2 rounded-full accent-saffron-500 cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {[3, 5, 7, 10].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setValue("duration", d)}
                        className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold border transition-all ${
                          selectedDuration === d
                            ? "bg-saffron-500 text-terracotta-900 border-saffron-500"
                            : "bg-background text-muted-foreground border-border hover:border-saffron-400"
                        }`}
                      >
                        {d}D
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between font-body text-xs text-muted-foreground">
                  <span>1 Day</span>
                  <span>14 Days</span>
                </div>
              </div>

              {/* Travel Style */}
              <div className="space-y-3">
                <Label className="font-body text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="text-base">🎯</span>
                  Travel Style
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {travelStyles.map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      data-ocid="plan.style.toggle"
                      onClick={() => setValue("travelStyle", style.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedStyle === style.value
                          ? "border-saffron-500 bg-saffron-50 shadow-sm"
                          : "border-border bg-background hover:border-saffron-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{style.emoji}</div>
                      <div className="font-body font-semibold text-sm text-foreground">
                        {style.label}
                      </div>
                      <div className="font-body text-xs text-muted-foreground mt-0.5">
                        {style.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Group Type */}
              <div className="space-y-3">
                <Label className="font-body text-sm font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Travelling As
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {groupTypes.map((group) => (
                    <button
                      key={group.value}
                      type="button"
                      data-ocid="plan.group.toggle"
                      onClick={() => setValue("groupType", group.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedGroup === group.value
                          ? "border-saffron-500 bg-saffron-50 shadow-sm"
                          : "border-border bg-background hover:border-saffron-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{group.emoji}</div>
                      <div className="font-body font-semibold text-sm text-foreground">
                        {group.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Error */}
              {generateError && (
                <div
                  data-ocid="plan.error_state"
                  className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200"
                >
                  <span className="text-red-500 mt-0.5">⚠️</span>
                  <p className="font-body text-sm text-red-700">
                    {generateError}
                  </p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                data-ocid="plan.submit_button"
                disabled={isGenerating || !selectedDestId}
                className="w-full bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-body font-bold rounded-full border-0 h-14 text-base gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">✨</span>
                    Crafting with Gemini AI…
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate My Itinerary
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Itinerary Result */}
      {tripResult && (
        <section id="itinerary-result" className="py-16 bg-ivory-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Save status banner */}
            {saveStatus === "saved" && (
              <div
                data-ocid="plan.success_state"
                className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="font-body text-sm text-green-700 font-medium">
                  ✓ Itinerary saved to your SafarX account
                </p>
              </div>
            )}
            {saveStatus === "saving" && (
              <div
                data-ocid="plan.loading_state"
                className="flex items-center gap-3 p-4 rounded-xl bg-saffron-50 border border-saffron-200"
              >
                <span className="animate-spin text-saffron-600">⏳</span>
                <p className="font-body text-sm text-saffron-700">
                  Saving your itinerary…
                </p>
              </div>
            )}
            {saveStatus === "error" && (
              <div
                data-ocid="plan.save_error_state"
                className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200"
              >
                <span>⚠️</span>
                <p className="font-body text-sm text-orange-700">
                  Itinerary generated but could not be saved. You can still view
                  it below.
                </p>
              </div>
            )}

            <ItineraryTimeline itinerary={tripResult.itinerary} />

            {/* Explore More — Gemini AI Section */}
            <ExploreMoreSection
              destination={tripResult.destinationName}
              duration={tripResult.duration}
              travelStyle={tripResult.travelStyle}
              groupType={tripResult.groupType}
            />
          </div>
        </section>
      )}
    </main>
  );
}
