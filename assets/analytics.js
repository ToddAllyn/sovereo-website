/* Sovereo analytics + retargeting loader.
   Single source, loaded on every page (directly, or via site-nav.js).
   Privacy-light by default. No cookies from Plausible. The Meta pixel
   stays dormant until PIXEL_ID is filled in, so shipping this is safe.

   To activate:
     1. Plausible: sign up, add sovereo.com, then this fires automatically.
     2. Meta pixel: paste your ID into PIXEL_ID below.
     3. Track a purchase/lead anywhere with:  window.sov.track('Lead')  */
(function(){
  if(window.__sovAnalytics) return; window.__sovAnalytics = 1;

  /* ---- config ---- */
  var PLAUSIBLE_DOMAIN = 'sovereo.com';
  var PIXEL_ID = '';           /* <-- paste Meta pixel ID here to activate */

  /* ---- Plausible (cookieless) ---- */
  (function(){
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
    s.src = 'https://plausible.io/js/script.tagged-events.outbound-links.js';
    document.head.appendChild(s);
    window.plausible = window.plausible || function(){ (window.plausible.q = window.plausible.q || []).push(arguments); };
  })();

  /* ---- Meta pixel (dormant until PIXEL_ID set) ---- */
  if(PIXEL_ID){
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,
      'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  /* ---- one helper for both tools ---- */
  window.sov = window.sov || {};
  window.sov.track = function(name, props){
    try{ if(window.plausible) window.plausible(name, props ? {props:props} : undefined); }catch(e){}
    try{ if(window.fbq) window.fbq('track', name, props || {}); }catch(e){}
  };

  /* ---- auto-tag the money moments ---- */
  document.addEventListener('DOMContentLoaded', function(){
    /* subscribe forms -> Lead (fired on submit; success is confirmed elsewhere) */
    Array.prototype.forEach.call(document.querySelectorAll('form'), function(f){
      if(f.querySelector('input[type=email]')){
        f.addEventListener('submit', function(){
          var src = f.getAttribute('data-src') || (f.id || '').replace(/^sub/,'').toLowerCase() || 'site';
          window.sov.track('SITREP Signup', { source: src });
        });
      }
    });
    /* dossier / brief / consult buy buttons -> InitiateCheckout */
    Array.prototype.forEach.call(document.querySelectorAll('a[href*="payhip.com"], a[href*="substack.com"]'), function(a){
      a.addEventListener('click', function(){
        var kind = a.href.indexOf('substack') > -1 ? 'Brief Checkout' : 'Dossier Checkout';
        window.sov.track(kind, { label: (a.textContent || '').trim().slice(0,60) });
      });
    });
  });
})();
