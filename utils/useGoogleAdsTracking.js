// hooks/useGoogleAdsTracking.js
import { useState, useEffect } from 'react';

const useGoogleAdsTracking = () => {
  const [gadsData, setGadsData] = useState(null);

  useEffect(() => {
    // Function to get URL parameters
    const getUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const params = {};

      // Google Ads UTM parameters
      const gadsParams = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid', // Google Click Identifier
        'gclsrc', // Google Click Source
        'gad_source', // Google Ads Source (newer parameter)
        'gad_campaignid', // Google Ads Campaign ID (newer parameter)
        'gbraid', // Google Brand Ads ID (newer parameter for brand campaigns)
        'wbraid', // Google Web Brand Ads ID (another brand campaign parameter)
        'fbclid', // Facebook Click ID (if you also use Facebook ads)
        'msclkid', // Microsoft Click ID (if you use Bing ads)
      ];

      gadsParams.forEach((param) => {
        if (urlParams.has(param)) {
          params[param] = urlParams.get(param);
        }
      });

      return Object.keys(params).length > 0 ? params : null;
    };

    // Function to save tracking data to sessionStorage
    const saveTrackingData = (data) => {
      const trackingInfo = {
        ...data,
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        landingPage: window.location.href,
      };

      sessionStorage.setItem('gads_tracking', JSON.stringify(trackingInfo));
      return trackingInfo;
    };

    // Function to load existing tracking data
    const loadTrackingData = () => {
      const stored = sessionStorage.getItem('gads_tracking');
      return stored ? JSON.parse(stored) : null;
    };

    // Check if we already have tracking data stored
    let existingData = loadTrackingData();

    // If we don't have existing data, or if we have new URL parameters, update
    const currentParams = getUrlParams();

    if (currentParams && Object.keys(currentParams).length > 0) {
      // New tracking parameters found, save them
      existingData = saveTrackingData(currentParams);
    } else if (!existingData) {
      // No URL params and no stored data, save basic session info
      existingData = saveTrackingData({
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        landingPage: window.location.href,
        timestamp: new Date().toISOString(),
      });
    }

    setGadsData(existingData);
  }, []);

  // Function to get current tracking data
  const getTrackingData = () => {
    const stored = sessionStorage.getItem('gads_tracking');
    return stored ? JSON.parse(stored) : gadsData;
  };

  // Function to clear tracking data (useful for testing)
  const clearTrackingData = () => {
    sessionStorage.removeItem('gads_tracking');
    setGadsData(null);
  };

  return {
    gadsData,
    getTrackingData,
    clearTrackingData,
  };
};

export default useGoogleAdsTracking;
