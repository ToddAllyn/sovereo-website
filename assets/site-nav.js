/* Sovereo shared navigation + footer: canonical links, dropdown menus,
   responsive mobile menu, grouped footer.
   Progressive enhancement. Static links remain if JS is disabled.

   Structure follows POSITIONING.md: Intelligence, Your Stage, Countries,
   Tools (grouped by the five areas of life), Advisory. */
(function(){
  var MENU=[
    {t:'Intelligence',h:'/sitrep/',items:[
      {t:'Daily SITREP',h:'/sitrep/',d:'Our free morning briefing'},
      {t:'The Sovereo Brief',h:'brief.html',d:'One big decision, each week'},
      {t:'The Reckoning',h:'forecast-ledger.html',d:'Every prediction, scored in public'},
      {t:'Guides',h:'guides.html'},
      {t:'Infographics',h:'infographics.html'},
      {t:'How We Research',h:'research-standard.html'}
    ]},
    {t:'Your Stage',h:'life-stages.html',items:[
      {t:'Pre-retirement',h:'life-stages.html#pre-retirement',d:'Usually about 50 to 64'},
      {t:'Retirement',h:'life-stages.html#retirement',d:'Usually about 65 and older'},
      {t:'Building',h:'life-stages.html#building',d:'Usually about 30 to 49'},
      {t:'Starting out',h:'life-stages.html#launch',d:'Usually about 18 to 29'},
      {t:'All stages',h:'life-stages.html'}
    ]},
    {t:'Countries',h:'Sovereo_Index_Table.html',items:[
      {t:'The Sovereo Index',h:'Sovereo_Index_Table.html',d:'Every country scored 0 to 100'},
      {t:'Best-Fit Countries',h:'best-fit-countries.html',d:'The countries that fit your life'},
      {t:'Country Dossiers',h:'Sovereo_Country_Reports.html',d:'Full reports on one country'},
      {t:'World Map',h:'atlas.html'},
      {t:'Build a Shortlist',h:'Sovereo_Index_Builder.html'},
      {t:'Capital and Enterprise',h:'capital-enterprise.html'},
      {t:'How the Index Works',h:'Sovereo_Index_Background.html'}
    ]},
    {t:'Tools',h:'free-tools.html',wide:true,groups:[
      {g:'Income',items:[
        {t:'Global Income Rank',h:'income-rank.html'},
        {t:'Income Tax by Country',h:'tax-compare.html'},
        {t:'Inflation Calculator',h:'inflation-calculator.html'},
        {t:'Currency Erosion',h:'currency-erosion.html'},
        {t:'Exchange Rates',h:'forex.html'},
        {t:'Retire on Social Security',h:'retire-on-social-security.html'}
      ]},
      {g:'Lifestyle',items:[
        {t:'Cost of Living Compare',h:'cost-compare.html'},
        {t:'Passport Power',h:'passport-power.html'}
      ]},
      {g:'Legacy',items:[
        {t:'Foreign Investment Climate',h:'invest-climate.html'},
        {t:'Government Debt',h:'debt-clock.html'}
      ]},
      {g:'See it clearly',items:[
        {t:'The Map Lies',h:'map-lies.html'},
        {t:'All free tools',h:'free-tools.html'}
      ]}
    ]},
    {t:'Advisory',h:'advisory.html'}
  ];
  var CTA={t:'Get the free SITREP',h:'index.html#sitrep'};
  var FOOTER_EXTRA={t:'Sovereo',items:[
    {t:'Home',h:'index.html'},
    {t:'Advisory',h:'advisory.html'},
    {t:'How We Research',h:'research-standard.html'},
    {t:'Terms',h:'terms.html'},
    {t:'Privacy',h:'privacy.html'}
  ]};

  function norm(h){ return (h.split('#')[0].split('/').pop()||'index.html').toLowerCase(); }
  var path=location.pathname;
  var here=(path.split('/').pop()||'index.html').toLowerCase();
  var inSitrep=/\/sitrep\//.test(path);
  function isHere(h){
    if(/^\/sitrep\/$/.test(h)) return inSitrep;
    if(h.indexOf('#')>-1) return false;
    return norm(h)===here || norm(h)===here.replace(/\.html$/,'')+'.html';
  }
  function linksOf(m){
    var out=[];
    (m.items||[]).forEach(function(l){ out.push(l); });
    (m.groups||[]).forEach(function(g){ g.items.forEach(function(l){ out.push(l); }); });
    return out;
  }
  function sectionHere(m){
    return isHere(m.h) || linksOf(m).some(function(l){ return isHere(l.h); });
  }
  function mk(l,cls){
    var a=document.createElement('a');
    a.href=l.h;
    if(l.d){
      var t=document.createElement('b'); t.textContent=l.t; a.appendChild(t);
      var d=document.createElement('small'); d.textContent=l.d; a.appendChild(d);
    } else a.textContent=l.t;
    var c=cls||'';
    if(isHere(l.h)) c+=' on';
    if(c.trim()) a.className=c.trim();
    return a;
  }

  /* compact (burger) menu rules; used on phones and whenever the full menu does not fit */
  function COMPACT(p){
    var R=[
      ['.mast .nav a,.mast .nav .sdd','display:none!important'],
      ['.navburger','display:flex'],
      ['.navpanel','display:block;position:fixed;left:0;right:0;background:#fff;border-top:1px solid var(--line,#E3DBCB);border-bottom:1px solid var(--line,#E3DBCB);box-shadow:0 14px 34px rgba(14,26,43,.14);transform:translateY(-10px);opacity:0;pointer-events:none;transition:transform .18s ease,opacity .18s ease;z-index:60;max-height:80vh;overflow:auto'],
      ['.navpanel.open','transform:none;opacity:1;pointer-events:auto'],
      ['.navpanel .nph','padding:16px 28px 6px;font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--soft,#7B8494);border-top:1px solid var(--line,#E3DBCB)'],
      ['.navpanel .nph:first-child','border-top:0'],
      ['.navpanel a','display:block;text-decoration:none;padding:10px 28px;font-size:16px;font-weight:500;color:var(--ink,#0E1A2B)'],
      ['.navpanel a small','display:none'],
      ['.navpanel a b','font-weight:500'],
      ['.navpanel a.on','color:var(--gold,#B0863C)'],
      ['.navpanel a.cta','background:#E7B85A;color:var(--ink,#0E1A2B);font-weight:700;text-align:center;padding:15px 28px;margin-top:8px'],
      ['.navburger.open span:nth-child(1)','transform:translateY(7px) rotate(45deg)'],
      ['.navburger.open span:nth-child(2)','opacity:0'],
      ['.navburger.open span:nth-child(3)','transform:translateY(-7px) rotate(-45deg)']
    ];
    return R.map(function(r){
      return r[0].split(',').map(function(s){ return p+s.trim(); }).join(',')+'{'+r[1]+'}';
    }).join('');
  }

  /* inject styles */
  var css=''
    +'.navburger{display:none;flex-direction:column;justify-content:center;gap:5px;width:42px;height:38px;background:none;border:0;cursor:pointer;padding:0;margin-left:6px}'
    +'.navburger span{display:block;width:24px;height:2px;background:var(--ink,#0E1A2B);border-radius:2px;transition:transform .2s,opacity .2s;margin:0 auto}'
    +'.mast .nav{display:flex;align-items:center;gap:20px!important;flex-wrap:nowrap}'
    +'.mast .nav>a,.mast .nav .sdd>a{white-space:nowrap;text-decoration:none;margin-left:0!important}'
    +'.mast .brand{white-space:nowrap}'
    +'html.snav-tight .mast .brand small{display:none}'
    +'.mast .nav a.on{color:var(--gold,#B0863C)}'
    +'.mast .nav a.cta{background:var(--ink,#0E1A2B);color:var(--paper,#FBF8F1)!important;padding:9px 16px;border-radius:7px;font-weight:600;white-space:nowrap;margin:0!important;display:inline-block;width:auto;max-width:none;font-size:14px;line-height:1.4;text-align:center}'
    +'.mast .nav a.cta.on{color:var(--paper,#FBF8F1)!important}'
    +'.mast .nav a.cta:hover{background:var(--gold,#B0863C);color:#fff!important}'
    /* dropdowns */
    +'.mast .nav .sdd{position:relative;display:flex;align-items:center}'
    +'.mast .nav .sdd>a.stop:after{content:"";display:inline-block;width:6px;height:6px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:translateY(-3px) rotate(45deg);margin-left:7px;opacity:.6}'
    +'.mast .nav .sddm{display:none;position:absolute;top:100%;left:-18px;padding-top:14px;z-index:70}'
    +'.mast .nav .sdd:hover .sddm,.mast .nav .sdd:focus-within .sddm{display:block}'
    +'.mast .nav .sddi{background:#fff;border:1px solid var(--line,#E3DBCB);border-radius:12px;box-shadow:0 18px 40px rgba(14,26,43,.14);padding:10px;min-width:250px}'
    +'.mast .nav .sddm.wide{left:auto;right:-120px}'
    +'.mast .nav .sddm.wide .sddi{display:grid;grid-template-columns:repeat(2,minmax(200px,1fr));gap:4px 14px;min-width:460px}'
    +'.mast .nav .sddi a{display:block;text-decoration:none;padding:8px 12px;border-radius:8px;font-size:14px;font-weight:500;color:var(--ink,#0E1A2B);white-space:nowrap}'
    +'.mast .nav .sddi a:hover{background:var(--paper,#FBF8F1);color:var(--ink,#0E1A2B)}'
    +'.mast .nav .sddi a.on{color:var(--gold,#B0863C)}'
    +'.mast .nav .sddi a b{display:block;font-weight:600}'
    +'.mast .nav .sddi a small{display:block;font-size:12.5px;color:var(--soft,#7B8494);font-weight:400;margin-top:1px}'
    +'.mast .nav .sddi .sgh{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--soft,#7B8494);padding:8px 12px 2px}'
    +'.navpanel{display:none}'
    /* footer */
    +'footer .sfoot-grid{flex:1 1 100%;width:100%;order:-1;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:22px;margin:0 0 26px}'
    +'footer .sfoot-grid h4{font-size:11.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold2,#C8A45C);margin:0 0 10px;font-family:inherit}'
    +'footer .sfoot-grid a{display:block;color:#C9D2DE;text-decoration:none;font-size:13.5px;margin:0 0 7px}'
    +'footer .sfoot-grid a:hover,footer .sfoot-grid a.on{color:var(--gold2,#C8A45C)}'
    +'@media(max-width:820px){footer .sfoot-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}'
    +'.navburger{color:inherit}'
    +'.navburger span{background:currentColor}'
    +'.mast .nav .sddi a{margin-left:0!important}'
    +'.mast.snav-dark .nav a.cta{background:#D4AF37;color:#12266B!important}'
    +'.mast.snav-dark .nav a.cta:hover{background:#fff;color:#12266B!important}'
    +'@media(max-width:820px){'+COMPACT('')+'}'
    +COMPACT('html.snav-compact ');
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  /* ---- top nav ---- */
  var nav=document.querySelector('.mast .nav');
  var mast=document.querySelector('.mast');
  if(nav&&mast){
    nav.innerHTML='';
    MENU.forEach(function(m){
      var top={t:m.t,h:m.h};
      if(!m.items&&!m.groups){ var a=mk(top); if(sectionHere(m)) a.className='on'; nav.appendChild(a); return; }
      var dd=document.createElement('div'); dd.className='sdd';
      var ta=document.createElement('a'); ta.href=m.h; ta.textContent=m.t;
      ta.className='stop'+(sectionHere(m)?' on':'');
      ta.setAttribute('aria-haspopup','true');
      dd.appendChild(ta);
      var menu=document.createElement('div'); menu.className='sddm'+(m.wide?' wide':'');
      var inner=document.createElement('div'); inner.className='sddi';
      if(m.items) m.items.forEach(function(l){ inner.appendChild(mk(l)); });
      if(m.groups) m.groups.forEach(function(g){
        var col=document.createElement('div');
        var h=document.createElement('div'); h.className='sgh'; h.textContent=g.g; col.appendChild(h);
        g.items.forEach(function(l){ col.appendChild(mk(l)); });
        inner.appendChild(col);
      });
      menu.appendChild(inner); dd.appendChild(menu); nav.appendChild(dd);
    });
    nav.appendChild(mk(CTA,'cta'));

    var burger=document.createElement('button');
    burger.className='navburger';
    burger.setAttribute('aria-label','Open menu');
    burger.setAttribute('aria-expanded','false');
    burger.innerHTML='<span></span><span></span><span></span>';
    nav.appendChild(burger);

    var panel=document.createElement('div');
    panel.className='navpanel';
    MENU.forEach(function(m){
      var links=linksOf(m);
      if(!links.length){ panel.appendChild(mk({t:m.t,h:m.h})); return; }
      var h=document.createElement('div'); h.className='nph'; h.textContent=m.t; panel.appendChild(h);
      links.forEach(function(l){ panel.appendChild(mk(l)); });
    });
    panel.appendChild(mk(CTA,'cta'));
    document.body.appendChild(panel);

    var root=document.documentElement;
    var fits=function(){
      var nr=nav.getBoundingClientRect(), pr=nav.parentElement.getBoundingClientRect();
      var br=(mast.querySelector('.brand')||nav).getBoundingClientRect();
      var tooWide=nr.right>pr.right+1 || nr.right>window.innerWidth || root.scrollWidth>window.innerWidth;
      var wrapped=nr.height>60||Math.abs((br.top+br.height/2)-(nr.top+nr.height/2))>12;
      return !(tooWide||wrapped);
    };
    var fit=function(){
      root.classList.remove('snav-compact','snav-tight');
      if(window.innerWidth<=820) return;
      if(fits()) return;
      root.classList.add('snav-tight');
      if(fits()) return;
      root.classList.remove('snav-tight');
      root.classList.add('snav-compact');
    };
    fit();
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
    var bg=getComputedStyle(mast).backgroundColor.match(/\d+(\.\d+)?/g);
    if(bg&&bg.length>=3&&(bg.length<4||+bg[3]>.5)&&(0.299*bg[0]+0.587*bg[1]+0.114*bg[2])<110) mast.classList.add('snav-dark');
    var place=function(){ panel.style.top=mast.getBoundingClientRect().height+'px'; };
    var open=function(){ place(); panel.classList.add('open'); burger.classList.add('open'); burger.setAttribute('aria-expanded','true'); };
    var close=function(){ panel.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); };
    burger.addEventListener('click',function(e){ e.stopPropagation(); panel.classList.contains('open')?close():open(); });
    panel.addEventListener('click',function(e){ if(e.target.closest('a')) close(); });
    document.addEventListener('click',function(e){ if(panel.classList.contains('open') && !panel.contains(e.target) && e.target!==burger) close(); });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){ close(); if(document.activeElement && nav.contains(document.activeElement)) document.activeElement.blur(); }
    });
    window.addEventListener('resize',function(){ fit(); if(window.innerWidth>820&&!root.classList.contains('snav-compact')) close(); else if(panel.classList.contains('open')) place(); });
  }

  /* ---- footer: same sections as the top nav ---- */
  var footer=document.querySelector('footer');
  if(footer){
    var grid=document.createElement('div'); grid.className='sfoot-grid';
    MENU.filter(function(m){ return linksOf(m).length; }).concat([FOOTER_EXTRA]).forEach(function(m){
      var col=document.createElement('div');
      var h=document.createElement('h4'); h.textContent=m.t; col.appendChild(h);
      var seen={};
      linksOf(m).forEach(function(l){
        if(seen[l.h]) return; seen[l.h]=1;
        col.appendChild(mk({t:l.t,h:l.h}));
      });
      grid.appendChild(col);
    });
    var existing=footer.querySelector('.links');
    if(!existing){ var firstA=footer.querySelector('a'); if(firstA) existing=firstA.parentElement; }
    if(existing){ existing.parentNode.replaceChild(grid, existing); }
    else { var wrap=footer.querySelector('.wrap')||footer; wrap.insertBefore(grid, wrap.firstChild); }
  }
})();
