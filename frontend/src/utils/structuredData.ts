export function getTravelAgencySchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'TravelAgency',
        name: 'SafarX',
        url: 'https://safarx.in',
        logo: 'https://safarx.in/assets/generated/safarx-logo.dim_400x120.png',
        description:
            'Your trusted Indian travel partner offering curated travel packages, destination guides, and AI-powered trip planning',
        areaServed: {
            '@type': 'Country',
            name: 'India',
        },
        email: 'travelsafarx@gmail.com',
        telephone: '+91-8979695644',
        sameAs: ['https://www.instagram.com/SafarX.in'],
    };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
