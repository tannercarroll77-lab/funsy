import React, { createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

// Enterprise-grade utilities context
const EnterpriseContext = createContext(null);

// Decimal precision utilities (no floating point errors)
export const Decimal = {
  round: (num, decimals = 2) => {
    const factor = Math.pow(10, decimals);
    return Math.round((num + Number.EPSILON) * factor) / factor;
  },
  multiply: (a, b, decimals = 2) => {
    const factor = Math.pow(10, decimals);
    return Math.round(((a * factor) * (b * factor)) / (factor * factor) * factor) / factor;
  },
  divide: (a, b, decimals = 2) => {
    if (b === 0) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round((a / b) * factor) / factor;
  },
  format: (num, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  },
  formatCurrency: (num, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }
};

// ISO 8601 date utilities with timezone handling
export const DateUtil = {
  toISO: (date) => new Date(date).toISOString(),
  toLocal: (isoString, options = {}) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...options
    });
  },
  toLocalDate: (isoString) => {
    return DateUtil.toLocal(isoString, { dateStyle: 'medium' });
  },
  toLocalTime: (isoString) => {
    return DateUtil.toLocal(isoString, { timeStyle: 'short' });
  },
  toRelative: (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return DateUtil.toLocalDate(isoString);
  },
  getUserTimezone: () => Intl.DateTimeFormat().resolvedOptions().timeZone
};

// Circuit breaker for API calls
class CircuitBreaker {
  constructor(threshold = 5, timeout = 30000) {
    this.failures = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED';
    this.nextAttempt = 0;
  }

  async call(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

// Exponential backoff retry
export async function withRetry(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// Request deduplication
const pendingRequests = new Map();

export async function dedupe(key, fn) {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  
  const promise = fn().finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, promise);
  return promise;
}

// Performance monitoring
const performanceMarks = new Map();

export const Perf = {
  mark: (name) => {
    performanceMarks.set(name, performance.now());
  },
  measure: (name) => {
    const start = performanceMarks.get(name);
    if (!start) return null;
    const duration = performance.now() - start;
    performanceMarks.delete(name);
    return duration;
  },
  trackRender: (componentName) => {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (duration > 16) {
        console.warn(`[Perf] Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  }
};

// Input sanitization (OWASP)
export const Sanitize = {
  html: (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },
  sql: (str) => {
    if (!str) return '';
    return String(str).replace(/['";\\]/g, '');
  },
  ticker: (str) => {
    if (!str) return '';
    return String(str).toUpperCase().replace(/[^A-Z0-9.]/g, '').slice(0, 10);
  },
  email: (str) => {
    if (!str) return '';
    return String(str).toLowerCase().trim();
  }
};

// Session management
let sessionId = null;

export function getSessionId() {
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

// Audit logging helper
export async function logAudit(action, resourceType, resourceId, metadata = {}) {
  try {
    await base44.functions.invoke('auditLog', {
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata
    });
  } catch (e) {
    console.warn('Audit log failed:', e);
  }
}

// Feature flag hook
const flagCache = new Map();

export async function checkFeatureFlag(flagKey) {
  if (flagCache.has(flagKey)) {
    return flagCache.get(flagKey);
  }
  
  try {
    const response = await base44.functions.invoke('featureFlags', { flag: flagKey });
    const result = response.data?.enabled || false;
    flagCache.set(flagKey, result);
    setTimeout(() => flagCache.delete(flagKey), 30000);
    return result;
  } catch {
    return false;
  }
}

// Provider component
export function EnterpriseProvider({ children }) {
  const circuitBreakers = useRef(new Map());

  const getCircuitBreaker = useCallback((key) => {
    if (!circuitBreakers.current.has(key)) {
      circuitBreakers.current.set(key, new CircuitBreaker());
    }
    return circuitBreakers.current.get(key);
  }, []);

  useEffect(() => {
    // Initialize session
    getSessionId();

    // Track page visibility for analytics
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logAudit('page_hidden', 'session', getSessionId());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const value = {
    Decimal,
    DateUtil,
    Sanitize,
    Perf,
    getCircuitBreaker,
    withRetry,
    dedupe,
    logAudit,
    checkFeatureFlag,
    getSessionId
  };

  return (
    <EnterpriseContext.Provider value={value}>
      {children}
    </EnterpriseContext.Provider>
  );
}

export function useEnterprise() {
  const context = useContext(EnterpriseContext);
  if (!context) {
    // Return utilities directly if not in provider
    return {
      Decimal,
      DateUtil,
      Sanitize,
      Perf,
      withRetry,
      dedupe,
      logAudit,
      checkFeatureFlag,
      getSessionId
    };
  }
  return context;
}

export default EnterpriseProvider;