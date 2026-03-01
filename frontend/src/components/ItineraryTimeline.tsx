import { Clock, Sun, Sunset, Moon, Lightbulb, Navigation, Calendar, Download } from 'lucide-react';
import type { GeneratedItinerary, Activity } from '@/utils/itineraryGenerator';
import { downloadItineraryPDF } from '@/utils/pdfGenerator';

interface ItineraryTimelineProps {
    itinerary: GeneratedItinerary;
}

const timeIcons = {
    Morning: Sun,
    Afternoon: Sunset,
    Evening: Moon,
};

const timeColors = {
    Morning: 'bg-saffron-100 text-saffron-700 border-saffron-200',
    Afternoon: 'bg-terracotta-100 text-terracotta-700 border-terracotta-200',
    Evening: 'bg-teal-100 text-teal-700 border-teal-200',
};

function ActivityCard({ activity }: { activity: Activity }) {
    const Icon = timeIcons[activity.time];
    const colorClass = timeColors[activity.time];

    return (
        <div className="flex gap-3 group">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center mt-0.5 ${colorClass}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorClass}`}>
                        {activity.time}
                    </span>
                    <span className="text-base">{activity.icon}</span>
                </div>
                <h4 className="font-display font-semibold text-base text-foreground mb-1 leading-tight">
                    {activity.title}
                </h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {activity.description}
                </p>
            </div>
        </div>
    );
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
    return (
        <div className="space-y-6">
            {/* Header Summary */}
            <div className="bg-terracotta-800 rounded-2xl p-6 text-ivory-100">
                <div className="flex flex-wrap gap-4 items-start justify-between mb-4">
                    <div>
                        <h2 className="font-display font-bold text-2xl sm:text-3xl text-ivory-100 mb-1">
                            Your {itinerary.duration}-Day {itinerary.destination} Itinerary
                        </h2>
                        <p className="font-body text-ivory-300 text-sm">
                            {itinerary.travelStyle} style · {itinerary.groupType} trip
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-saffron-500/20 border border-saffron-500/30 text-saffron-300 text-xs font-body font-semibold">
                            <Calendar className="w-3 h-3" />
                            {itinerary.duration} Days
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-body font-semibold">
                            <Clock className="w-3 h-3" />
                            {itinerary.travelStyle}
                        </span>
                        {/* Download PDF Button */}
                        <button
                            onClick={() => downloadItineraryPDF(itinerary)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 text-xs font-body font-bold transition-colors shadow-sm"
                            title="Download itinerary as PDF"
                        >
                            <Download className="w-3 h-3" />
                            Download PDF
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-xl p-3">
                        <p className="font-body text-xs text-ivory-400 uppercase tracking-wider mb-1">Best Time to Visit</p>
                        <p className="font-body text-sm text-ivory-100 font-medium">{itinerary.bestTimeToVisit}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                        <p className="font-body text-xs text-ivory-400 uppercase tracking-wider mb-1">How to Reach</p>
                        <p className="font-body text-sm text-ivory-100 font-medium line-clamp-2">{itinerary.howToReach}</p>
                    </div>
                </div>
            </div>

            {/* Day-by-Day Timeline */}
            <div className="space-y-4">
                {itinerary.days.map((day) => (
                    <div key={day.day} className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-card">
                        {/* Day Header */}
                        <div className="bg-gradient-to-r from-saffron-500 to-terracotta-500 px-5 py-3 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <span className="font-display font-bold text-white text-sm">D{day.day}</span>
                            </div>
                            <div>
                                <p className="font-body text-xs text-white/70 uppercase tracking-wider">Day {day.day}</p>
                                <h3 className="font-display font-bold text-white text-base leading-tight">{day.theme}</h3>
                            </div>
                        </div>

                        {/* Activities */}
                        <div className="p-5 space-y-1">
                            {day.activities.map((activity, idx) => (
                                <ActivityCard key={idx} activity={activity} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Travel Tips */}
            <div className="bg-ivory-100 border border-saffron-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-saffron-600" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-foreground">Travel Tips for Your Trip</h3>
                </div>
                <ul className="space-y-2">
                    {itinerary.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                            <span className="text-saffron-500 font-bold mt-0.5 flex-shrink-0">✦</span>
                            {tip}
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA */}
            <div className="bg-teal-800 rounded-2xl p-6 text-center text-ivory-100">
                <Navigation className="w-8 h-8 text-saffron-400 mx-auto mb-3" />
                <h3 className="font-display font-bold text-xl mb-2">Ready to Make This Real?</h3>
                <p className="font-body text-ivory-300 text-sm mb-4">
                    Our travel experts can refine this itinerary and handle all bookings for you.
                </p>
                <a
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-body font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
                >
                    Book This Trip
                </a>
            </div>
        </div>
    );
}
