// Custom React hooks for the Freeducation platform

import { useState, useEffect } from 'react';

// Reading progress management
export const useReadingProgress = () => {
  const [readMap, setReadMap] = useState(() => loadReadProgress());
  const [recentRead, setRecentRead] = useState(() => loadRecentRead());

  const markRead = (entry) => {
    const updated = { ...readMap, [entry.chapterKey]: { ...entry, updatedAt: Date.now() } };
    setReadMap(updated);
    saveReadProgress(updated);
    
    // Update recent reads
    const recent = loadRecentRead();
    const newRecent = [entry, ...recent.filter(r => r.chapterKey !== entry.chapterKey)].slice(0, 10);
    setRecentRead(newRecent);
    saveRecentRead(newRecent);
  };

  return { readMap, markRead, recentRead };
};

// Thumbnail management
export const useThumbnails = (endpoint, keyField) => {
  const [thumbnailMap, setThumbnailMap] = useState({});

  useEffect(() => {
    let isActive = true;
    const fetchThumbnails = async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (!isActive) return;
        
        const map = {};
        data.forEach(item => {
          map[item[keyField]] = item;
        });
        setThumbnailMap(map);
      } catch (error) {
        console.error('Failed to fetch thumbnails:', error);
      }
    };

    fetchThumbnails();
    return () => { isActive = false; };
  }, [endpoint, keyField]);

  return thumbnailMap;
};

// Dashboard view preference
export const useDashboardViewPreference = () => {
  const [viewMode, setViewMode] = useState(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('dashboard_view') || 'card' : 'card';
  });

  const viewOptions = ['card', 'list'];

  const updateViewMode = (newMode) => {
    if (viewOptions.includes(newMode)) {
      setViewMode(newMode);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('dashboard_view', newMode);
      }
    }
  };

  return { viewMode, setViewMode: updateViewMode, viewOptions };
};

// Image preloader
export const useImagePreloader = (imageUrls, options = {}) => {
  const [isReady, setIsReady] = useState(false);
  const { eagerCount = 0, maxWaitMs = 2000 } = options;

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setIsReady(true);
      return;
    }

    let loadedCount = 0;
    let timeoutId;
    const totalImages = imageUrls.length;

    const checkAllLoaded = () => {
      if (loadedCount >= Math.min(eagerCount, totalImages)) {
        setIsReady(true);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    // Set timeout as fallback
    if (maxWaitMs > 0) {
      timeoutId = setTimeout(() => {
        setIsReady(true);
      }, maxWaitMs);
    }

    // Load first few images eagerly
    const imagesToLoad = imageUrls.slice(0, eagerCount);
    imagesToLoad.forEach((url, index) => {
      if (!url) {
        loadedCount++;
        checkAllLoaded();
        return;
      }

      const img = new Image();
      img.onload = () => {
        loadedCount++;
        checkAllLoaded();
      };
      img.onerror = () => {
        loadedCount++;
        checkAllLoaded();
      };
      img.src = url;
    });

    // If no eager loading, mark as ready immediately
    if (eagerCount === 0) {
      setIsReady(true);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [imageUrls, eagerCount, maxWaitMs]);

  return isReady;
};

// Local storage helpers
const loadReadProgress = () => {
  try {
    return typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('reading-progress') || '{}') : {};
  } catch (error) {
    console.warn('Failed to load reading progress:', error);
    return {};
  }
};

const saveReadProgress = (progress) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('reading-progress', JSON.stringify(progress));
    }
  } catch (error) {
    console.warn('Failed to save reading progress:', error);
  }
};

const loadRecentRead = () => {
  try {
    return typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('recent-reads') || '[]') : [];
  } catch (error) {
    console.warn('Failed to load recent reads:', error);
    return [];
  }
};

const saveRecentRead = (recent) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('recent-reads', JSON.stringify(recent));
    }
  } catch (error) {
    console.warn('Failed to save recent reads:', error);
  }
};

// Utility functions
export const makeChapterThumbnailKey = (classLabel, subjectLabel, chapterKey) => {
  return (classLabel + '-' + subjectLabel + '-' + chapterKey)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const getLastReadForSubject = (readMap, subjectLabel) => {
  const entries = Object.values(readMap || {}).filter((entry) => entry.subjectLabel === subjectLabel);
  if (entries.length === 0) return '';
  entries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return entries[0]?.label || '';
};

export const storeBanglaSelection = ({ classLabel, categoryName, itemName }) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('freeducation.bangla-selection', JSON.stringify({ classLabel, categoryName, itemName }));
    }
  } catch (error) {
    console.warn('Failed to store Bangla selection', error);
  }
};
