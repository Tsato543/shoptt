// TikTok Pixel ID
const TIKTOK_PIXEL_ID = 'D4H50QRC77UA1JCPR9M0';

// Declare ttq globally
declare global {
  interface Window {
    ttq: any;
    TiktokAnalyticsObject: string;
  }
}

// Initialize TikTok Pixel
export const initTikTokPixel = () => {
  if (typeof window === 'undefined') return;
  if (window.ttq) return; // Already initialized

  // TikTok Pixel base code
  (function(w: any, d: Document, t: string) {
    w.TiktokAnalyticsObject = t;
    const ttq = w[t] = w[t] || [];
    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];
    ttq.setAndDefer = function(t: any, e: string) {
      t[e] = function() {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (let i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }
    ttq.instance = function(t: string) {
      const e = ttq._i[t] || [];
      for (let n = 0; n < ttq.methods.length; n++) {
        ttq.setAndDefer(e, ttq.methods[n]);
      }
      return e;
    };
    ttq.load = function(e: string, n?: any) {
      const i = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = i;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      const o = document.createElement("script");
      o.type = "text/javascript";
      o.async = true;
      o.src = i + "?sdkid=" + e + "&lib=" + t;
      const a = document.getElementsByTagName("script")[0];
      a?.parentNode?.insertBefore(o, a);
    };

    ttq.load(TIKTOK_PIXEL_ID);
    ttq.page();
  })(window, document, 'ttq');
};

// Track PageView
export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.page();
  }
};

// Track ViewContent (quando visualiza produto)
export const trackViewContent = (contentId: string, contentName: string, value?: number, currency = 'BRL') => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('ViewContent', {
      content_id: contentId,
      content_name: contentName,
      content_type: 'product',
      value: value,
      currency: currency,
    });
  }
};

// Track AddToCart
export const trackAddToCart = (contentId: string, contentName: string, value: number, quantity = 1, currency = 'BRL') => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('AddToCart', {
      content_id: contentId,
      content_name: contentName,
      content_type: 'product',
      quantity: quantity,
      value: value,
      currency: currency,
    });
  }
};

// Track InitiateCheckout
export const trackInitiateCheckout = (value: number, currency = 'BRL') => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('InitiateCheckout', {
      value: value,
      currency: currency,
    });
  }
};

// Track AddPaymentInfo
export const trackAddPaymentInfo = (value: number, currency = 'BRL') => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('AddPaymentInfo', {
      value: value,
      currency: currency,
    });
  }
};

// Track CompletePayment (Purchase)
export const trackCompletePayment = (contentId: string, contentName: string, value: number, quantity = 1, currency = 'BRL') => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('CompletePayment', {
      content_id: contentId,
      content_name: contentName,
      content_type: 'product',
      quantity: quantity,
      value: value,
      currency: currency,
    });
  }
};

// Track SubmitForm
export const trackSubmitForm = () => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('SubmitForm');
  }
};

// Track ClickButton (custom event)
export const trackClickButton = (buttonName: string) => {
  if (typeof window !== 'undefined' && window.ttq) {
    window.ttq.track('ClickButton', {
      button_name: buttonName,
    });
  }
};
