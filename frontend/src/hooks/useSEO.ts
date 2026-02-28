import { useEffect } from 'react';

interface SEOOptions {
    title: string;
    description: string;
    // Open Graph
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    ogType?: string;
    // Twitter Card
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
}

const SITE_NAME = 'SafarX';
const DEFAULT_TITLE = `${SITE_NAME} - Your Trusted Indian Travel Partner | Explore India's Destinations`;
const DEFAULT_DESCRIPTION =
    'SafarX is your trusted Indian travel platform offering curated destinations, travel packages, AI-powered trip planning, and a vibrant community for exploring incredible India.';

function upsertMeta(selector: string, attribute: string, value: string): () => void {
    let el = document.querySelector<HTMLMetaElement>(selector);
    const existed = !!el;
    const prevContent = el?.content ?? '';

    if (el) {
        el.content = value;
    } else {
        el = document.createElement('meta');
        const [attrName, attrValue] = attribute.split('=');
        el.setAttribute(attrName, attrValue);
        el.content = value;
        document.head.appendChild(el);
    }

    const capturedEl = el;
    return () => {
        if (existed) {
            capturedEl.content = prevContent;
        } else {
            if (capturedEl.parentNode) {
                document.head.removeChild(capturedEl);
            }
        }
    };
}

export default function useSEO({
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
}: SEOOptions) {
    useEffect(() => {
        const cleanups: Array<() => void> = [];

        // --- Document title ---
        const prevTitle = document.title;
        document.title = `${title} | ${SITE_NAME}`;
        cleanups.push(() => { document.title = prevTitle; });

        // --- Meta description ---
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
        const capturedMetaDesc = metaDesc;
        cleanups.push(() => { capturedMetaDesc.content = prevDesc; });

        // --- Open Graph tags ---
        if (ogTitle !== undefined) {
            cleanups.push(upsertMeta("meta[property='og:title']", "property=og:title", ogTitle));
        }
        if (ogDescription !== undefined) {
            cleanups.push(upsertMeta("meta[property='og:description']", "property=og:description", ogDescription));
        }
        if (ogImage !== undefined) {
            cleanups.push(upsertMeta("meta[property='og:image']", "property=og:image", ogImage));
        }
        if (ogUrl !== undefined) {
            cleanups.push(upsertMeta("meta[property='og:url']", "property=og:url", ogUrl));
        }
        if (ogType !== undefined) {
            cleanups.push(upsertMeta("meta[property='og:type']", "property=og:type", ogType));
        }

        // --- Twitter Card tags ---
        if (twitterCard !== undefined) {
            cleanups.push(upsertMeta("meta[name='twitter:card']", "name=twitter:card", twitterCard));
        }
        if (twitterTitle !== undefined) {
            cleanups.push(upsertMeta("meta[name='twitter:title']", "name=twitter:title", twitterTitle));
        }
        if (twitterDescription !== undefined) {
            cleanups.push(upsertMeta("meta[name='twitter:description']", "name=twitter:description", twitterDescription));
        }
        if (twitterImage !== undefined) {
            cleanups.push(upsertMeta("meta[name='twitter:image']", "name=twitter:image", twitterImage));
        }

        return () => {
            cleanups.forEach((fn) => fn());
        };
    }, [
        title, description,
        ogTitle, ogDescription, ogImage, ogUrl, ogType,
        twitterCard, twitterTitle, twitterDescription, twitterImage,
    ]);
}
