import { destinations, type Destination } from '@/data/destinations';

export type TravelStyle = 'Adventure' | 'Relaxation' | 'Cultural' | 'Budget';
export type GroupType = 'Solo' | 'Couple' | 'Family' | 'Friends';

export interface Activity {
    time: 'Morning' | 'Afternoon' | 'Evening';
    title: string;
    description: string;
    icon: string;
}

export interface ItineraryDay {
    day: number;
    theme: string;
    activities: Activity[];
}

export interface GeneratedItinerary {
    destination: string;
    duration: number;
    travelStyle: TravelStyle;
    groupType: GroupType;
    days: ItineraryDay[];
    tips: string[];
    bestTimeToVisit: string;
    howToReach: string;
}

const styleActivities: Record<TravelStyle, { morning: string[]; afternoon: string[]; evening: string[] }> = {
    Adventure: {
        morning: ['Early morning trek to viewpoint', 'River rafting session', 'Rock climbing activity', 'Mountain biking trail', 'Sunrise hike'],
        afternoon: ['Zip-lining adventure', 'Rappelling session', 'Kayaking on the river', 'Paragliding experience', 'Off-road jeep safari'],
        evening: ['Bonfire at campsite', 'Stargazing session', 'Night trek preparation', 'Camp cooking experience', 'Adventure debrief & stories'],
    },
    Relaxation: {
        morning: ['Yoga & meditation session', 'Leisurely nature walk', 'Sunrise watching from viewpoint', 'Spa & wellness treatment', 'Peaceful garden stroll'],
        afternoon: ['Ayurvedic massage', 'Poolside relaxation', 'Scenic boat ride', 'Café hopping & reading', 'Hammock time by the river'],
        evening: ['Sunset viewing', 'Candlelit dinner', 'Cultural music performance', 'Herbal tea & journaling', 'Rooftop stargazing'],
    },
    Cultural: {
        morning: ['Heritage temple/monument visit', 'Local market exploration', 'Museum tour', 'Cooking class with locals', 'Artisan workshop visit'],
        afternoon: ['Historical site exploration', 'Local craft shopping', 'Guided heritage walk', 'Folk art demonstration', 'Traditional lunch experience'],
        evening: ['Cultural dance/music show', 'Street food trail', 'Local festival participation', 'Storytelling session', 'Traditional dinner with locals'],
    },
    Budget: {
        morning: ['Free walking tour', 'Local chai & breakfast', 'Public transport exploration', 'Free viewpoint hike', 'Morning market visit'],
        afternoon: ['Budget local eatery lunch', 'Free beach/park time', 'Hostel common area socializing', 'DIY sightseeing', 'Local bus tour'],
        evening: ['Street food dinner', 'Budget guesthouse rooftop', 'Free cultural event', 'Bonfire with fellow travelers', 'Night market browsing'],
    },
};

const groupTips: Record<GroupType, string[]> = {
    Solo: [
        'Stay in hostels to meet fellow travelers',
        'Always share your itinerary with someone back home',
        'Join group tours for popular attractions',
        'Download offline maps before heading out',
    ],
    Couple: [
        'Book romantic sunset viewpoint spots in advance',
        'Try a private houseboat or heritage stay',
        'Opt for candlelit dinners at local restaurants',
        'Capture memories with a local photographer',
    ],
    Family: [
        'Book accommodations with family rooms well in advance',
        'Carry a first-aid kit and child-friendly snacks',
        'Choose activities suitable for all age groups',
        'Keep a buffer day for rest and flexibility',
    ],
    Friends: [
        'Split costs with group booking discounts',
        'Try adventure packages for group thrills',
        'Book a villa or group homestay for bonding',
        'Plan a group cooking or cultural activity',
    ],
};

const dayThemes = [
    'Arrival & First Impressions',
    'Deep Dive into Local Culture',
    'Nature & Landscapes',
    'Hidden Gems & Offbeat Trails',
    'Adventure & Thrills',
    'Relaxation & Rejuvenation',
    'Local Flavors & Markets',
    'Spiritual & Heritage',
    'Scenic Drives & Viewpoints',
    'Farewell & Memories',
    'Bonus Exploration',
    'Leisure & Shopping',
    'Wildlife & Nature',
    'Sunset & Celebrations',
];

function pickRandom<T>(arr: T[], seed: number): T {
    return arr[seed % arr.length];
}

function generateDayActivities(
    dest: Destination,
    dayNum: number,
    style: TravelStyle,
    group: GroupType
): Activity[] {
    const stylePool = styleActivities[style];
    const highlights = dest.highlights;

    const activities: Activity[] = [];

    // Morning
    const morningHighlight = highlights[(dayNum * 3) % highlights.length];
    const morningGeneric = pickRandom(stylePool.morning, dayNum * 7);
    activities.push({
        time: 'Morning',
        title: dayNum === 1 ? `Arrive & Check-in at ${dest.name}` : morningHighlight,
        description: dayNum === 1
            ? `Settle into your accommodation, freshen up, and take a leisurely stroll to get your first feel of ${dest.name}. Grab a local breakfast and soak in the atmosphere.`
            : `${morningGeneric} — explore ${morningHighlight} with fresh morning energy. The early hours offer the best light and fewer crowds.`,
        icon: dayNum === 1 ? '🏨' : '🌅',
    });

    // Afternoon
    const afternoonHighlight = highlights[(dayNum * 3 + 1) % highlights.length];
    const afternoonGeneric = pickRandom(stylePool.afternoon, dayNum * 11);
    activities.push({
        time: 'Afternoon',
        title: afternoonHighlight,
        description: `${afternoonGeneric} — spend your afternoon at ${afternoonHighlight}. Enjoy a hearty local lunch at a nearby restaurant before continuing your exploration.`,
        icon: '☀️',
    });

    // Evening
    const eveningHighlight = highlights[(dayNum * 3 + 2) % highlights.length];
    const eveningGeneric = pickRandom(stylePool.evening, dayNum * 13);
    const isLastDay = false;
    activities.push({
        time: 'Evening',
        title: isLastDay ? 'Farewell Dinner' : eveningHighlight,
        description: `${eveningGeneric} — as the sun sets over ${dest.name}, enjoy ${eveningHighlight}. End the day with a delicious local dinner and reflect on the day's adventures.`,
        icon: '🌙',
    });

    return activities;
}

export function generateItinerary(
    destinationId: string,
    duration: number,
    travelStyle: TravelStyle,
    groupType: GroupType
): GeneratedItinerary | null {
    const dest = destinations.find((d) => d.id === destinationId);
    if (!dest) return null;

    const days: ItineraryDay[] = [];

    for (let i = 1; i <= duration; i++) {
        const themeIndex = i === 1 ? 0 : i === duration ? 9 : (i - 1) % (dayThemes.length - 2) + 1;
        days.push({
            day: i,
            theme: dayThemes[themeIndex],
            activities: generateDayActivities(dest, i, travelStyle, groupType),
        });
    }

    // Last day override
    if (days.length > 0) {
        const lastDay = days[days.length - 1];
        lastDay.theme = 'Farewell & Memories';
        lastDay.activities[2].title = 'Farewell Dinner & Departure Prep';
        lastDay.activities[2].description = `Savour a final meal at your favourite local spot in ${dest.name}. Pack your bags, collect souvenirs, and cherish the memories of an incredible journey.`;
        lastDay.activities[2].icon = '🎉';
    }

    const baseTips = [
        `Best time to visit ${dest.name}: ${dest.bestTimeToVisit}`,
        'Carry a reusable water bottle and stay hydrated',
        'Respect local customs and dress codes at religious sites',
        'Keep digital and physical copies of all travel documents',
        'Try at least one local street food specialty each day',
    ];

    const tips = [...baseTips, ...groupTips[groupType]];

    return {
        destination: dest.name,
        duration,
        travelStyle,
        groupType,
        days,
        tips,
        bestTimeToVisit: dest.bestTimeToVisit,
        howToReach: dest.howToReach,
    };
}
