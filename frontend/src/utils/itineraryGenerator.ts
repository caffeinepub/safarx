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

// Per-destination curated activity pools keyed by destination id and travel style
const destinationActivityPools: Record<string, Record<TravelStyle, { morning: string[]; afternoon: string[]; evening: string[] }>> = {
    agra: {
        Adventure: {
            morning: ['Sunrise cycling tour around Taj Mahal', 'Hot air balloon ride over Agra', 'Early morning Taj Mahal photography walk', 'Cycling through Agra\'s old city lanes', 'Morning run along Yamuna riverfront'],
            afternoon: ['Boat ride on Yamuna River', 'Cycling to Fatehpur Sikri', 'Rock climbing at Agra adventure park', 'Cycling through Sikandra', 'Adventure sports at Keetham Lake'],
            evening: ['Sunset at Mehtab Bagh with Taj view', 'Evening walk along Yamuna', 'Night photography at Taj Mahal', 'Rooftop dinner with Taj view', 'Evening cultural show at Kalakriti'],
        },
        Relaxation: {
            morning: ['Sunrise visit to Taj Mahal', 'Morning yoga at hotel garden', 'Leisurely breakfast with Taj view', 'Gentle walk through Mehtab Bagh', 'Morning meditation at peaceful ghat'],
            afternoon: ['Spa treatment at luxury hotel', 'Leisurely Agra Fort tour', 'Afternoon tea with Taj view', 'Relaxing boat ride on Yamuna', 'Shopping for marble crafts'],
            evening: ['Sunset at Mehtab Bagh', 'Mughal cuisine dinner', 'Cultural show at Kalakriti', 'Rooftop dinner with Taj view', 'Moonlit Taj Mahal visit'],
        },
        Cultural: {
            morning: ['Guided Taj Mahal tour with historian', 'Agra Fort detailed exploration', 'Visit Itmad-ud-Daulah (Baby Taj)', 'Explore Akbar\'s Tomb at Sikandra', 'Morning at Jama Masjid Agra'],
            afternoon: ['Marble inlay craft workshop', 'Fatehpur Sikri guided tour', 'Visit Agra Museum', 'Leather craft workshop', 'Mughal cuisine cooking class'],
            evening: ['Mughal-era dinner at Esphahan', 'Cultural show at Kalakriti', 'Moonlit Taj Mahal visit', 'Heritage walk in old Agra', 'Petha sweet making demonstration'],
        },
        Budget: {
            morning: ['Sunrise at free Mehtab Bagh viewpoint', 'Budget Taj Mahal entry', 'Free Agra Fort courtyard visit', 'Morning chai at local dhaba', 'Walk through old Agra bazaar'],
            afternoon: ['Budget lunch at local restaurant', 'Shared auto to Fatehpur Sikri', 'Free Sikandra gardens', 'Explore Kinari Bazaar for bargains', 'Budget marble craft shopping'],
            evening: ['Free sunset at Mehtab Bagh', 'Budget Mughal thali dinner', 'Evening walk at Taj Ganj', 'Free cultural events at town square', 'Night market at Sadar Bazaar'],
        },
    },
    varanasi: {
        Adventure: {
            morning: ['Sunrise boat ride on Ganges', 'Cycling through Varanasi old city', 'Early morning ghats exploration on foot', 'Sunrise photography at Assi Ghat', 'Morning run along Ganges ghats'],
            afternoon: ['Boat ride to Ramnagar Fort', 'Cycling through Banaras Hindu University', 'Explore Chunar Fort by boat', 'Trekking to Vindhyachal', 'Cycling through silk weaving villages'],
            evening: ['Ganga Aarti at Dashashwamedh Ghat', 'Night boat ride on Ganges', 'Evening walk through Vishwanath Gali', 'Sunset at Assi Ghat', 'Night photography at ghats'],
        },
        Relaxation: {
            morning: ['Sunrise meditation at Assi Ghat', 'Gentle boat ride at dawn', 'Morning yoga at ghat', 'Leisurely walk through flower market', 'Morning chai at ghat-side cafe'],
            afternoon: ['Relaxing boat ride on Ganges', 'Ayurvedic massage at Varanasi spa', 'Leisurely visit to Sarnath', 'Afternoon at Banaras Hindu University', 'Relaxing at rooftop cafe with Ganges view'],
            evening: ['Ganga Aarti ceremony', 'Sunset boat ride', 'Evening at Assi Ghat cultural events', 'Dinner at rooftop restaurant', 'Evening meditation at ghat'],
        },
        Cultural: {
            morning: ['Visit Kashi Vishwanath Temple', 'Explore Dashashwamedh Ghat', 'Tour of Banaras Hindu University', 'Visit Tulsi Manas Temple', 'Explore Annapurna Temple'],
            afternoon: ['Silk weaving workshop', 'Visit Sarnath Buddhist site', 'Explore Varanasi Museum', 'Brassware craft workshop', 'Banarasi paan making experience'],
            evening: ['Ganga Aarti at Dashashwamedh Ghat', 'Classical music concert at ghat', 'Banarasi cuisine dinner', 'Evening at Assi Ghat cultural events', 'Storytelling about Varanasi mythology'],
        },
        Budget: {
            morning: ['Free sunrise at Assi Ghat', 'Free morning Ganga Aarti viewing', 'Walk through free ghats', 'Morning chai at local tea stall', 'Free visit to Kashi Vishwanath area'],
            afternoon: ['Budget boat ride on Ganges', 'Free Sarnath museum entry', 'Budget lunch at local dhaba', 'Free BHU campus walk', 'Budget silk shopping'],
            evening: ['Free Ganga Aarti at Dashashwamedh', 'Budget thali dinner', 'Free evening walk at ghats', 'Free cultural events at Assi Ghat', 'Budget lassi at Blue Lassi shop'],
        },
    },
    kerala: {
        Adventure: {
            morning: ['White water rafting on Periyar River', 'Trekking in Wayanad forests', 'Kayaking through Alleppey backwaters', 'Rock climbing at Munnar hills', 'Paragliding at Vagamon'],
            afternoon: ['Jungle trekking in Silent Valley', 'Zip-lining at Wayanad adventure park', 'Surfing at Varkala Beach', 'Elephant interaction at Kodanad', 'Waterfall rappelling at Athirappilly'],
            evening: ['Sunset kayaking in backwaters', 'Night fishing with local fishermen', 'Campfire at forest resort', 'Sunset at Varkala cliff', 'Evening boat ride on Vembanad Lake'],
        },
        Relaxation: {
            morning: ['Sunrise yoga on houseboat deck', 'Ayurvedic Panchakarma treatment', 'Morning walk through spice garden', 'Meditation at Sivananda Ashram', 'Gentle stroll at Kovalam Beach'],
            afternoon: ['Houseboat cruise through backwaters', 'Ayurvedic spa at Kumarakom resort', 'Relaxing at Marari Beach', 'Coconut oil massage at Varkala', 'Afternoon tea at Munnar plantation'],
            evening: ['Sunset houseboat cruise', 'Kathakali performance at cultural center', 'Sunset at Varkala cliff', 'Seafood dinner at Alleppey', 'Evening Ayurvedic treatment'],
        },
        Cultural: {
            morning: ['Visit Padmanabhaswamy Temple', 'Explore Fort Kochi heritage area', 'Tour of Mattancherry Palace', 'Visit Jewish Synagogue in Kochi', 'Morning at Thrissur Pooram grounds'],
            afternoon: ['Kathakali makeup and performance workshop', 'Kalaripayattu martial arts demonstration', 'Coir weaving workshop in Alleppey', 'Spice plantation tour in Thekkady', 'Visit Folklore Museum Kochi'],
            evening: ['Kathakali performance', 'Mohiniyattam dance show', 'Kalaripayattu evening show', 'Traditional Kerala Sadhya dinner', 'Theyyam ritual performance'],
        },
        Budget: {
            morning: ['Free sunrise at Kovalam Beach', 'Walk through Fort Kochi heritage area', 'Free visit to Chinese Fishing Nets', 'Morning at free Alleppey Beach', 'Explore Thrissur town on foot'],
            afternoon: ['Cheap local ferry through backwaters', 'Budget lunch at local Kerala restaurant', 'Free visit to Mattancherry area', 'Shared boat to Alleppey backwaters', 'Explore Kochi spice market'],
            evening: ['Free sunset at Fort Kochi waterfront', 'Budget seafood at local shack', 'Free Kathakali preview show', 'Evening walk at Marine Drive Kochi', 'Budget thali at local restaurant'],
        },
    },
    hampi: {
        Adventure: {
            morning: ['Sunrise trek to Matanga Hill', 'Cycling through Hampi ruins', 'Rock climbing on Hampi boulders', 'Early morning coracle ride on Tungabhadra', 'Sunrise at Hemakuta Hill'],
            afternoon: ['Rock climbing at Anjanadri Hill', 'Coracle ride on Tungabhadra', 'Cycling to Anegundi village', 'Trekking to Anjaneya Hill', 'Bouldering session with guide'],
            evening: ['Sunset at Hemakuta Hill', 'Evening walk through Hampi Bazaar', 'Sunset at Virupaksha Temple', 'Night photography at ruins', 'Campfire at riverside'],
        },
        Relaxation: {
            morning: ['Sunrise yoga at riverside', 'Gentle walk through Hampi Bazaar', 'Morning meditation at Virupaksha Temple', 'Leisurely breakfast at riverside cafe', 'Morning photography walk'],
            afternoon: ['Relaxing coracle ride', 'Leisurely Vittala Temple visit', 'Afternoon at riverside cafe', 'Gentle walk through Lotus Mahal', 'Afternoon at Tungabhadra riverside'],
            evening: ['Sunset at Hemakuta Hill', 'Evening at Virupaksha Temple', 'Dinner at riverside restaurant', 'Evening walk through ruins', 'Candlelit dinner at heritage guesthouse'],
        },
        Cultural: {
            morning: ['Guided tour of Virupaksha Temple', 'Explore Vittala Temple complex', 'Visit Hampi Archaeological Museum', 'Tour of Royal Enclosure', 'Explore Hazara Rama Temple'],
            afternoon: ['Visit Elephant Stables', 'Explore Queen\'s Bath', 'Tour of Zenana Enclosure', 'Visit Anegundi village', 'Banana fiber craft workshop'],
            evening: ['Sound and light show at ruins', 'Evening puja at Virupaksha Temple', 'Dinner at traditional Karnataka restaurant', 'Cultural storytelling session', 'Evening walk through Hampi Bazaar'],
        },
        Budget: {
            morning: ['Free sunrise at Matanga Hill', 'Free walk through Hampi Bazaar', 'Budget entry to Virupaksha Temple', 'Free Hemakuta Hill sunrise', 'Cycle rental for ruins exploration'],
            afternoon: ['Budget coracle ride', 'Budget lunch at local restaurant', 'Free Vittala Temple exterior', 'Cycle to Anegundi village', 'Free ruins exploration'],
            evening: ['Free sunset at Hemakuta Hill', 'Budget dinner at local dhaba', 'Free evening walk through ruins', 'Free Virupaksha Temple evening puja', 'Budget banana chips shopping'],
        },
    },
    rajasthan: {
        Adventure: {
            morning: ['Camel safari at Sam Sand Dunes at sunrise', 'Hot air balloon ride over Jaipur', 'Jeep safari in Ranthambore National Park', 'Rock climbing at Aravalli Hills', 'Zip-lining at Mehrangarh Fort'],
            afternoon: ['Dune bashing in Jaisalmer desert', 'Rappelling at Bundi Fort', 'ATV ride through desert terrain', 'Trekking to Nahargarh Fort', 'Cycling through Shekhawati villages'],
            evening: ['Bonfire and folk music at desert camp', 'Stargazing in Thar Desert', 'Sunset at Jaisalmer Fort ramparts', 'Night walk through Jodhpur Blue City', 'Cultural show at Chokhi Dhani'],
        },
        Relaxation: {
            morning: ['Sunrise yoga at Lake Pichola', 'Ayurvedic massage at Udaipur spa', 'Leisurely stroll through Saheliyon ki Bari garden', 'Morning tea at Rambagh Palace garden', 'Meditation at Pushkar ghats'],
            afternoon: ['Boat ride on Lake Pichola', 'Spa treatment at heritage hotel', 'Leisurely shopping in Jodhpur bazaar', 'Afternoon tea at Umaid Bhawan Palace', 'Relaxing at Jal Mahal viewpoint'],
            evening: ['Sunset cruise on Lake Pichola', 'Ganga Aarti at Pushkar Lake', 'Rooftop dinner at Jaisalmer haveli', 'Folk dance performance at Bagore ki Haveli', 'Candlelit dinner at palace hotel'],
        },
        Cultural: {
            morning: ['Guided tour of Amber Fort and Sheesh Mahal', 'Visit Mehrangarh Fort museum', 'Explore Jaisalmer Fort\'s living quarters', 'Morning puja at Brahma Temple Pushkar', 'Tour of City Palace Udaipur'],
            afternoon: ['Block printing workshop in Sanganer', 'Blue pottery workshop in Jaipur', 'Visit Patwon ki Haveli in Jaisalmer', 'Explore Ranakpur Jain Temples', 'Textile museum tour in Jodhpur'],
            evening: ['Kathputli puppet show', 'Ghoomar dance performance', 'Visit Bagore ki Haveli museum', 'Explore Jodhpur clock tower market', 'Heritage walk in Bundi old town'],
        },
        Budget: {
            morning: ['Free sunrise walk at Nahargarh Fort', 'Explore Jaipur old city on foot', 'Visit free ghats at Pushkar', 'Morning chai at local dhaba', 'Walk through Jodhpur Blue City lanes'],
            afternoon: ['Cheap local bus to Amber Fort', 'Street food lunch at Jodhpur market', 'Explore Jaipur bazaars for bargains', 'Shared jeep to Sam Sand Dunes', 'Visit free Pushkar Lake ghats'],
            evening: ['Free Ganga Aarti at Pushkar', 'Budget thali dinner at local restaurant', 'Evening walk at Jawahar Circle', 'Sunset at free viewpoints in Jaisalmer', 'Night market browsing in Jaipur'],
        },
    },
};

// Generic style-based activity pools (fallback for destinations without specific pools)
const genericStyleActivities: Record<TravelStyle, { morning: string[]; afternoon: string[]; evening: string[] }> = {
    Adventure: {
        morning: [
            'Early morning trek to scenic viewpoint',
            'River rafting session',
            'Rock climbing activity',
            'Mountain biking trail',
            'Sunrise hike to hilltop',
            'Kayaking on local river',
            'Zip-lining through forest canopy',
            'Paragliding over valley',
            'Bouldering session',
            'Cycling through rugged terrain',
        ],
        afternoon: [
            'Zip-lining adventure',
            'Rappelling session',
            'Kayaking on the river',
            'Paragliding experience',
            'Off-road jeep safari',
            'Waterfall rappelling',
            'ATV ride through trails',
            'Trekking to hidden waterfall',
            'River crossing adventure',
            'Jungle trek with guide',
        ],
        evening: [
            'Bonfire at campsite',
            'Stargazing session',
            'Night trek preparation',
            'Camp cooking experience',
            'Adventure debrief & stories',
            'Sunset at mountain viewpoint',
            'Night photography session',
            'Campfire with local guides',
            'Evening at riverside camp',
            'Rooftop stargazing',
        ],
    },
    Relaxation: {
        morning: [
            'Yoga & meditation session',
            'Leisurely nature walk',
            'Sunrise watching from viewpoint',
            'Spa & wellness treatment',
            'Peaceful garden stroll',
            'Morning Ayurvedic massage',
            'Gentle beach walk',
            'Sunrise photography',
            'Herbal tea at scenic spot',
            'Mindful forest bathing',
        ],
        afternoon: [
            'Ayurvedic massage',
            'Poolside relaxation',
            'Scenic boat ride',
            'Café hopping & reading',
            'Hammock time by the river',
            'Spa treatment at resort',
            'Leisurely heritage walk',
            'Afternoon tea at viewpoint',
            'Gentle cycling tour',
            'Relaxing at lakeside',
        ],
        evening: [
            'Sunset viewing',
            'Candlelit dinner',
            'Cultural music performance',
            'Herbal tea & journaling',
            'Rooftop stargazing',
            'Sunset boat ride',
            'Evening at cultural center',
            'Peaceful walk at dusk',
            'Dinner at heritage restaurant',
            'Evening meditation',
        ],
    },
    Cultural: {
        morning: [
            'Heritage temple/monument visit',
            'Local market exploration',
            'Museum tour',
            'Cooking class with locals',
            'Artisan workshop visit',
            'Guided heritage walk',
            'Traditional craft workshop',
            'Visit ancient ruins',
            'Morning puja at temple',
            'Folk art demonstration',
        ],
        afternoon: [
            'Historical site exploration',
            'Local craft shopping',
            'Guided heritage walk',
            'Folk art demonstration',
            'Traditional lunch experience',
            'Pottery workshop',
            'Weaving demonstration',
            'Visit cultural museum',
            'Cooking class',
            'Explore old bazaar',
        ],
        evening: [
            'Cultural dance/music show',
            'Street food trail',
            'Local festival participation',
            'Storytelling session',
            'Traditional dinner with locals',
            'Classical music concert',
            'Heritage walk at dusk',
            'Evening puja ceremony',
            'Folk performance',
            'Night market exploration',
        ],
    },
    Budget: {
        morning: [
            'Free walking tour',
            'Local chai & breakfast',
            'Public transport exploration',
            'Free viewpoint hike',
            'Morning market visit',
            'Free temple visit',
            'Sunrise at public viewpoint',
            'Free nature walk',
            'Budget cycle rental',
            'Free heritage site walk',
        ],
        afternoon: [
            'Budget local eatery lunch',
            'Free beach/park time',
            'Hostel common area socializing',
            'DIY sightseeing',
            'Local bus tour',
            'Free museum entry',
            'Budget street food trail',
            'Free waterfall visit',
            'Shared transport to attraction',
            'Free cultural site',
        ],
        evening: [
            'Street food dinner',
            'Budget guesthouse rooftop',
            'Free cultural event',
            'Bonfire with fellow travelers',
            'Night market browsing',
            'Free sunset viewpoint',
            'Budget thali dinner',
            'Free evening walk',
            'Free cultural show',
            'Budget local market',
        ],
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

function getActivityPool(destId: string, style: TravelStyle) {
    return destinationActivityPools[destId]?.[style] ?? genericStyleActivities[style];
}

function generateDayActivities(
    dest: Destination,
    dayNum: number,
    style: TravelStyle,
    group: GroupType,
    usedTitles: Set<string>
): Activity[] {
    const pool = getActivityPool(dest.id, style);
    const highlights = dest.highlights;
    const activities: Activity[] = [];

    // Helper: pick a unique item from an array, avoiding already-used titles
    function pickUnique(arr: string[], seed: number): string {
        // Try each offset until we find an unused one
        for (let offset = 0; offset < arr.length; offset++) {
            const candidate = arr[(seed + offset) % arr.length];
            if (!usedTitles.has(candidate)) {
                usedTitles.add(candidate);
                return candidate;
            }
        }
        // All used — return with a day suffix to differentiate
        const base = arr[seed % arr.length];
        const unique = `${base} (Day ${dayNum})`;
        usedTitles.add(unique);
        return unique;
    }

    function pickUniqueHighlight(offset: number): string {
        for (let i = 0; i < highlights.length; i++) {
            const candidate = highlights[(offset + i) % highlights.length];
            if (!usedTitles.has(candidate)) {
                usedTitles.add(candidate);
                return candidate;
            }
        }
        const base = highlights[offset % highlights.length];
        const unique = `${base} — deeper exploration`;
        usedTitles.add(unique);
        return unique;
    }

    // Morning
    if (dayNum === 1) {
        const arrivalTitle = `Arrive & Check-in at ${dest.name}`;
        usedTitles.add(arrivalTitle);
        activities.push({
            time: 'Morning',
            title: arrivalTitle,
            description: `Settle into your accommodation, freshen up, and take a leisurely stroll to get your first feel of ${dest.name}. Grab a local breakfast and soak in the atmosphere.`,
            icon: '🏨',
        });
    } else {
        const morningActivity = pickUnique(pool.morning, dayNum * 7);
        const morningHighlight = pickUniqueHighlight(dayNum * 3);
        activities.push({
            time: 'Morning',
            title: morningHighlight,
            description: `${morningActivity} — explore ${morningHighlight} with fresh morning energy. The early hours offer the best light and fewer crowds.`,
            icon: '🌅',
        });
    }

    // Afternoon
    const afternoonActivity = pickUnique(pool.afternoon, dayNum * 11);
    const afternoonHighlight = pickUniqueHighlight(dayNum * 3 + 1);
    activities.push({
        time: 'Afternoon',
        title: afternoonHighlight,
        description: `${afternoonActivity} — spend your afternoon at ${afternoonHighlight}. Enjoy a hearty local lunch at a nearby restaurant before continuing your exploration.`,
        icon: '☀️',
    });

    // Evening
    const eveningActivity = pickUnique(pool.evening, dayNum * 13);
    const eveningHighlight = pickUniqueHighlight(dayNum * 3 + 2);
    activities.push({
        time: 'Evening',
        title: eveningHighlight,
        description: `${eveningActivity} — as the sun sets over ${dest.name}, enjoy ${eveningHighlight}. End the day with a delicious local dinner and reflect on the day's adventures.`,
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
    // Track used activity/highlight titles across all days to prevent duplicates
    const usedTitles = new Set<string>();

    for (let i = 1; i <= duration; i++) {
        const themeIndex = i === 1 ? 0 : i === duration ? 9 : (i - 1) % (dayThemes.length - 2) + 1;
        days.push({
            day: i,
            theme: dayThemes[themeIndex],
            activities: generateDayActivities(dest, i, travelStyle, groupType, usedTitles),
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
