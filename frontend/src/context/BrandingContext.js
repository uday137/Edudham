import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/utils/api';

const DEFAULT_BRANDING = {
    siteName: 'Edu Dham',
    logoUrl: '',
};

const BrandingContext = createContext(DEFAULT_BRANDING);

export const BrandingProvider = ({ children }) => {
    const [branding, setBranding] = useState(DEFAULT_BRANDING);

    useEffect(() => {
        api.getHomepageConfig()
            .then((data) => {
                if (data) {
                    setBranding({
                        siteName: data.site_name || 'Edu Dham',
                        logoUrl: data.logo_url || '',
                    });
                }
            })
            .catch(() => {/* silently keep defaults */ });
    }, []);

    return (
        <BrandingContext.Provider value={branding}>
            {children}
        </BrandingContext.Provider>
    );
};

/** Hook — use anywhere: const { siteName, logoUrl } = useBranding(); */
export const useBranding = () => useContext(BrandingContext);
