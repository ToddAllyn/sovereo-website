/* Sovereo shared navigation + footer: canonical links, responsive mobile menu.
   Progressive enhancement. Static links remain if JS is disabled. */
(function(){
  var DESKTOP=[
    {t:'The Index',h:'Sovereo_Index_Table.html'},
    {t:'World Map',h:'atlas.html'},
    {t:'Guides',h:'guides.html'},
    {t:'Reports',h:'Sovereo_Country_Reports.html'},
    {t:'The Reckoning',h:'forecast-ledger.html'},
    {t:'The Brief',h:'https://sovereobrief.substack.com',ext:true}
  ];
  var MOBILE_EXTRA=[
    {t:'Shortlist',h:'Sovereo_Index_Builder.html'},
    {t:'Science',h:'Sovereo_Scientific_Basis.html'}
  ];
  var CTA={t:'Find your best-fit countries',h:'Sovereo_Relocation_Diagnostic.html'};
  var FOOTER=[
    {t:'Home',h:'index.html'},
    {t:'The Index',h:'Sovereo_Index_Table.html'},
    {t:'Shortlist',h:'Sovereo_Index_Builder.html'},
    {t:'World Map',h:'atlas.html'},
    {t:'Guides',h:'guides.html'},
    {t:'Reports',h:'Sovereo_Country_Reports.html'},
    {t:'The Reckoning',h:'forecast-ledger.html'},
    {t:'Science',h:'Sovereo_Scientific_Basis.html'},
    {t:'Best-Fit Countries',h:'Sovereo_Relocation_Diagnostic.html'},
    {t:'The Brief',h:'https://sovereobrief.substack.com',ext:true},
    {t:'Terms',h:'terms.html'},
    {t:'Privacy',h:'privacy.html'}
  ];

  var here=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  function mk(l,cls){
    var a=document.createElement('a');
    a.href=l.h; a.textContent=l.t;
    if(l.ext){a.target='_blank'; a.rel='noopener';}
    var c=cls||'';
    if(!l.ext && l.h.toLowerCase()===here) c+=' on';
    if(c.trim()) a.className=c.trim();
    return a;
  }

  /* inject styles */
  var css=''
    +'.navburger{display:none;flex-direction:column;justify-content:center;gap:5px;width:42px;height:38px;background:none;border:0;cursor:pointer;padding:0;margin-left:6px}'
    +'.navburger span{display:block;width:24px;height:2px;background:var(--ink,#0E1A2B);border-radius:2px;transition:transform .2s,opacity .2s;margin:0 auto}'
    +'.mast .nav a.on{color:var(--gold,#B0863C)}'
    +'.navpanel{display:none}'
    +'footer .sfoot-links{display:flex;flex-wrap:wrap;gap:22px;margin:0 0 4px}'
    +'footer .sfoot-links a{color:#C9D2DE;text-decoration:none;font-size:13.5px}'
    +'footer .sfoot-links a:hover{color:var(--gold2,#C8A45C)}'
    +'footer .sfoot-links a.on{color:var(--gold2,#C8A45C)}'
    +'@media(max-width:820px){'
    +'.mast .nav a{display:none!important}'
    +'.navburger{display:flex}'
    +'.navpanel{display:block;position:fixed;left:0;right:0;background:#fff;border-top:1px solid var(--line,#E3DBCB);border-bottom:1px solid var(--line,#E3DBCB);box-shadow:0 14px 34px rgba(14,26,43,.14);transform:translateY(-10px);opacity:0;pointer-events:none;transition:transform .18s ease,opacity .18s ease;z-index:60;max-height:80vh;overflow:auto}'
    +'.navpanel.open{transform:none;opacity:1;pointer-events:auto}'
    +'.navpanel a{display:block;padding:15px 28px;border-top:1px solid var(--line,#E3DBCB);font-size:16px;font-weight:500;color:var(--ink,#0E1A2B)}'
    +'.navpanel a:first-child{border-top:0}'
    +'.navpanel a.on{color:var(--gold,#B0863C)}'
    +'.navpanel a.cta{background:#E7B85A;color:var(--ink,#0E1A2B);font-weight:700;text-align:center}'
    +'.navburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}'
    +'.navburger.open span:nth-child(2){opacity:0}'
    +'.navburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}'
    +'}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  /* ---- top nav ---- */
  var nav=document.querySelector('.mast .nav');
  var mast=document.querySelector('.mast');
  if(nav&&mast){
    nav.innerHTML='';
    DESKTOP.forEach(function(l){ nav.appendChild(mk(l)); });
    nav.appendChild(mk(CTA,'cta'));

    var burger=document.createElement('button');
    burger.className='navburger';
    burger.setAttribute('aria-label','Open menu');
    burger.setAttribute('aria-expanded','false');
    burger.innerHTML='<span></span><span></span><span></span>';
    nav.appendChild(burger);

    var panel=document.createElement('div');
    panel.className='navpanel';
    DESKTOP.concat(MOBILE_EXTRA).forEach(function(l){ panel.appendChild(mk(l)); });
    panel.appendChild(mk(CTA,'cta'));
    document.body.appendChild(panel);

    var place=function(){ panel.style.top=mast.getBoundingClientRect().height+'px'; };
    var open=function(){ place(); panel.classList.add('open'); burger.classList.add('open'); burger.setAttribute('aria-expanded','true'); };
    var close=function(){ panel.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); };
    burger.addEventListener('click',function(e){ e.stopPropagation(); panel.classList.contains('open')?close():open(); });
    panel.addEventListener('click',function(e){ if(e.target.tagName==='A') close(); });
    document.addEventListener('click',function(e){ if(panel.classList.contains('open') && !panel.contains(e.target) && e.target!==burger) close(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
    window.addEventListener('resize',function(){ if(window.innerWidth>820) close(); else if(panel.classList.contains('open')) place(); });
  }

  /* ---- footer parity ---- */
  var footer=document.querySelector('footer');
  if(footer){
    var box=document.createElement('div'); box.className='sfoot-links';
    FOOTER.forEach(function(l){ box.appendChild(mk(l)); });
    var existing=footer.querySelector('.links');
    if(!existing){ var firstA=footer.querySelector('a'); if(firstA) existing=firstA.parentElement; }
    if(existing){ existing.parentNode.replaceChild(box, existing); }
    else { var wrap=footer.querySelector('.wrap')||footer; wrap.insertBefore(box, wrap.firstChild); }
  }
})();
