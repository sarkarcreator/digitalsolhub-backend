
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Language } from '../types';

interface SEOProps {
  title: string;
  description: string;
  lang: Language;
  image?: string;
  schema?: Record<string, any>; // JSON-LD Schema
}

const SEO: React.FC<SEOProps> = ({ title, description, lang, image = 'https://digitalsolhub.com/og-image.jpg', schema }) => {
  const location = useLocation();
  
  // Construct absolute URL
  const baseUrl = 'https://digitalsolhub.com';
  // Remove lang prefix from path for hreflang generation
  const pathWithoutLang = location.pathname.replace(/^\/(en|ur|ar|ru)/, '') || '/';
  const currentUrl = `${baseUrl}${location.pathname}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = `${title} | Digital Solutions Hub`;

    // 2. Update HTML Attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === Language.URDU || lang === Language.ARABIC) ? 'rtl' : 'ltr';

    // 3. Helper to update/create meta tags
    const updateMeta = (name: string, content: string, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard SEO Tags
    updateMeta('description', description);
    updateMeta('keywords', lang === Language.URDU 
      ? 'ÚˆÛŒØ¬ÛŒÙ¹Ù„ Ø³Ø±ÙˆØ³Ø², Ø¢Ù† Ù„Ø§Ø¦Ù† Ú©ÙˆØ±Ø³Ø², Ù¾Ø§Ú©Ø³ØªØ§Ù†, Ø¬Ø§Ø¨Ø², ÙˆÛŒØ²Ø§, ÙØ±ÛŒ Ù„Ø§Ù†Ø³Ù†Ú¯, ÙˆÛŒØ¨ ÚˆÛŒÙˆÙ„Ù¾Ù…Ù†Ù¹' 
      : 'Digital Services, Online Courses, Pakistan, Jobs, Visa, Freelancing, IT Solutions, Web Development, SEO');
    updateMeta('author', 'Sarkar Azeem');
    updateMeta('robots', 'index, follow');

    // Open Graph (Facebook/LinkedIn)
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:url', currentUrl, 'property');
    updateMeta('og:type', 'website', 'property');
    updateMeta('og:site_name', 'Digital Solutions Hub', 'property');
    updateMeta('og:locale', lang === Language.URDU ? 'ur_PK' : lang === Language.ARABIC ? 'ar_SA' : lang === Language.RUSSIAN ? 'ru_RU' : 'en_US', 'property');

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

    // 4. Canonical Tag
    let linkCanonical = document.querySelector("link[rel='canonical']");
    if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // 5. Hreflang Tags (Multi-language SEO)
    const languages = [Language.ENGLISH, Language.URDU, Language.ARABIC, Language.RUSSIAN];
    
    languages.forEach(l => {
        let linkHreflang = document.querySelector(`link[rel='alternate'][hreflang='${l}']`);
        if (!linkHreflang) {
            linkHreflang = document.createElement('link');
            linkHreflang.setAttribute('rel', 'alternate');
            linkHreflang.setAttribute('hreflang', l);
            document.head.appendChild(linkHreflang);
        }
        // Ensure path logic works for root vs subpages
        const hrefPath = pathWithoutLang === '/' ? `/${l}` : `/${l}${pathWithoutLang}`;
        linkHreflang.setAttribute('href', `${baseUrl}${hrefPath}`);
    });

    // x-default (English)
    let linkXDefault = document.querySelector("link[rel='alternate'][hreflang='x-default']");
    if (!linkXDefault) {
        linkXDefault = document.createElement('link');
        linkXDefault.setAttribute('rel', 'alternate');
        linkXDefault.setAttribute('hreflang', 'x-default');
        document.head.appendChild(linkXDefault);
    }
    const defaultPath = pathWithoutLang === '/' ? '/en' : `/en${pathWithoutLang}`;
    linkXDefault.setAttribute('href', `${baseUrl}${defaultPath}`);

    // 6. JSON-LD Structured Data
    if (schema) {
        let scriptSchema = document.querySelector("#json-ld-schema");
        if (!scriptSchema) {
            scriptSchema = document.createElement('script');
            scriptSchema.id = "json-ld-schema";
            scriptSchema.setAttribute('type', 'application/ld+json');
            document.head.appendChild(scriptSchema);
        }
        scriptSchema.textContent = JSON.stringify(schema);
    }

  }, [title, description, lang, currentUrl, image, schema, pathWithoutLang]);

  return null;
};

export default SEO;
