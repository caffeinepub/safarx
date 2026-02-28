import { useEffect } from 'react';

interface SEOOptions {
    title: string;
    description: string;
}

const DEFAULT_TITLE = "SafarX - Your Trusted Indian Travel Partner | Explore India's Destinations";
const DEFAULT_DESCRIPTION =
    "SafarX is your trusted Indian travel agency offering curated travel packages, destination guides, and AI-powered trip planning for exploring India's diverse destinations from the Himalayas to Kerala.";

export default function useSEO({ title, description }: SEOOptions) {
    useEffect(() => {
        // Update document title
        const prevTitle = document.title;
        document.title = title;

        // Update meta description
        let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
        const prevDesc = metaDesc?.content ?? DEFAULT_DESCRIPTION;
        if (metaDesc) {
            metaDesc.content = description;
        } else {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            metaDesc.content = description;
            document.head.appendChild(metaDesc);
        }

        return () => {
            document.title = prevTitle;
            if (metaDesc) {
                metaDesc.content = prevDesc;
            }
        };
    }, [title, description]);
}
