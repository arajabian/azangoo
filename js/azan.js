/* Copyright (c) 2026 azangoo.com. All rights reserved.
   Copying, reuse, modification or redistribution of this code, or of its calculations,
   is prohibited without written permission. See the Terms and conditions page. */
(function(){
  /* clock and dates: always the local time of the selected place.
     lastOffset (hours from UTC) starts as the device offset and is replaced when a place is found. */
  var lastOffset=-new Date().getTimezoneOffset()/60,shownDay="",onNewDay=null;
  var pad=function(n){return n<10?"0"+n:n};
  var clockEl=document.getElementById("clock"),zoneEl=document.getElementById("d-zone"),weekEl=document.getElementById("d-week");

  var fPersian=new Intl.DateTimeFormat("en-u-ca-persian-nu-latn",{year:"numeric",month:"numeric",day:"numeric",timeZone:"UTC"});
  var fHijri=new Intl.DateTimeFormat("en-u-ca-islamic-tbla-nu-latn",{year:"numeric",month:"numeric",day:"numeric",timeZone:"UTC"});
  var num=function(x){return window.AzanLang.num(x)};
  function partsOf(fmt,d){var p={};fmt.formatToParts(d).forEach(function(x){if(x.type!=="literal")p[x.type]=+x.value});return p}

  function showDate(prefix,day,month,year){
    document.getElementById(prefix+"-day").textContent=num(day);
    document.getElementById(prefix+"-my").textContent=month+" "+num(year);
  }
  function zoneLabel(h){
    var a=Math.abs(h),hh=Math.floor(a),mm=Math.round((a-hh)*60);
    return "UTC"+(h<0?"\u2212":"+")+hh+(mm?":"+pad(mm):"");
  }

  function tick(skipNewDay){
    var A=window.AzanLang, d=new Date(Date.now()+lastOffset*3600000);
    clockEl.textContent=num(pad(d.getUTCHours())+":"+pad(d.getUTCMinutes())+":"+pad(d.getUTCSeconds()));
    zoneEl.textContent=A.t("clock_zone")+" \u00B7 "+num(zoneLabel(lastOffset));
    var key=d.getUTCFullYear()+"-"+d.getUTCMonth()+"-"+d.getUTCDate()+"-"+A.current(),first=!shownDay;
    if(key!==shownDay){
      shownDay=key;
      weekEl.textContent=A.names("weekdays")[d.getUTCDay()];
      var sh=partsOf(fPersian,d), hj=partsOf(fHijri,d);
      showDate("d-j",sh.day,A.names("shamsi")[sh.month-1],sh.year);
      showDate("d-h",hj.day,A.names("hijri")[hj.month-1],hj.year);
      showDate("d-g",d.getUTCDate(),A.names("greg")[d.getUTCMonth()],d.getUTCFullYear());
      if(!first&&!skipNewDay&&onNewDay)onNewDay();     /* a new day began at that place: recalculate the times */
    }
  }
  tick();
  setInterval(tick,1000);
  window.addEventListener("azan:langchange",function(){
    shownDay="";tick(true);paintTimes();showPlace();
    var pp=marker.getLatLng();
    latEl.value=window.AzanLang.num(pp.lat.toFixed(6));
    lngEl.value=window.AzanLang.num(pp.lng.toFixed(6));
    if(typeof updateQibla==="function")updateQibla();      /* Qibla sentence and map label follow the language */
    if(typeof qTag!=="undefined"&&qTag){
      qTag.setIcon(L.divIcon({className:"qibla-tag",html:"\uD83D\uDD4B "+window.AzanLang.t("qibla_tag"),iconSize:[76,26],iconAnchor:[38,13]}));
    }
  });

  if(!window.L)return;

  /* map */
  var placed=false;                                    /* true once a place is chosen (saved, GPS, search, map or typed) */
  var fallback=[20,0];
  var map=L.map("map").setView(fallback,2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
    maxZoom:19,attribution:"&copy; OpenStreetMap contributors"
  }).addTo(map);
  var marker=L.marker(fallback,{draggable:true,opacity:0}).addTo(map);

  var latEl=document.getElementById("lat"),
      lngEl=document.getElementById("lng"),
      cityEl=document.getElementById("city"),
      msgEl=document.getElementById("msg");
  var NOMINATIM="https://nominatim.openstreetmap.org/";

  /* qibla: a line from the marker along the direction of the Kaaba */
  var KAABA=L.latLng(21.4225,39.8262),RAD=Math.PI/180;
  var qCase=L.polyline([],{color:"#0b2530",weight:8,opacity:.75}).addTo(map);
  var qLine=L.polyline([],{color:"#f0d58a",weight:4}).addTo(map);
  var qTag=L.marker(KAABA,{
    icon:L.divIcon({className:"qibla-tag",html:"\uD83D\uDD4B "+window.AzanLang.t("qibla_tag"),iconSize:[76,26],iconAnchor:[38,13]}),
    interactive:false,keyboard:false
  }).addTo(map);
  var qiblaEl=document.getElementById("qibla");

  function bearing(a,b){
    var f1=a.lat*RAD,f2=b.lat*RAD,dl=(b.lng-a.lng)*RAD;
    var y=Math.sin(dl)*Math.cos(f2),
        x=Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl);
    return (Math.atan2(y,x)/RAD+360)%360;
  }
  function destination(a,brg,dist){
    var d=dist/6371008.8,t=brg*RAD,f1=a.lat*RAD,l1=a.lng*RAD;
    var f2=Math.asin(Math.sin(f1)*Math.cos(d)+Math.cos(f1)*Math.sin(d)*Math.cos(t));
    var l2=l1+Math.atan2(Math.sin(t)*Math.sin(d)*Math.cos(f1),Math.cos(d)-Math.sin(f1)*Math.sin(f2));
    return L.latLng(f2/RAD,((l2/RAD+540)%360)-180);
  }
  function updateQibla(){
    if(!placed){qiblaEl.textContent="";return}
    var p=marker.getLatLng(),b=bearing(p,KAABA);
    var bounds=map.getBounds();
    var len=map.distance(bounds.getNorthWest(),bounds.getNorthEast())*0.4;   /* 40% of the visible width */
    var end=p.distanceTo(KAABA)<len?KAABA:destination(p,b,len);
    qCase.setLatLngs([p,end]);
    qLine.setLatLngs([p,end]);
    qTag.setLatLng(end);
    qiblaEl.textContent=window.AzanLang.t("qibla",{deg:window.AzanLang.num(Math.round(b))});
  }

  function say(t){msgEl.textContent=t||""}

  /* Country of the selected place, used only for official months that are limited to some countries ("regions" in
     data/official-months.json). Nothing is requested when the file has no such months. A place whose country cannot
     be found uses the site's own prediction. */
  var regionSeq=0, regionCache={};
  function regionKey(ll){return ll.lat.toFixed(1)+","+ll.lng.toFixed(1)}
  function rememberRegion(ll,cc){if(cc)regionCache[regionKey(ll)]=String(cc).toUpperCase()}
  function findRegion(ll){
    var O=window.AzanOfficial;
    if(!O||!O.needsRegion)return;
    O.onReady(function(){
      var id=++regionSeq;
      if(!O.needsRegion()){O.setRegion(null);return}
      var cc=regionCache[regionKey(ll)];
      if(cc){O.setRegion(cc);return}
      O.setRegion(null);                                    /* unknown until the lookup answers */
      fetch(NOMINATIM+"reverse?format=jsonv2&zoom=3&addressdetails=1&accept-language=en&lat="+ll.lat.toFixed(4)+"&lon="+ll.lng.toFixed(4))
        .then(function(r){return r.json()})
        .then(function(d){
          if(id!==regionSeq)return;                         /* a newer place replaced this one */
          var c=d&&d.address&&d.address.country_code;
          if(c){rememberRegion(ll,c);O.setRegion(c)}
        })
        .catch(function(){});
    });
  }

  function setPos(ll,zoom){
    placed=true;
    findRegion(ll);
    marker.setOpacity(1);
    marker.setLatLng(ll);
    if(zoom)map.setView(ll,zoom);
    latEl.value=window.AzanLang.num(ll.lat.toFixed(6));
    lngEl.value=window.AzanLang.num(ll.lng.toFixed(6));
    updateQibla();
    showPlace();
    recalc();
  }

  /* find the city name for a point */
  /* name of a found place in the language of the page: the place's own name in that language first (namedetails),
     then the address parts that the lookup returned in that language */
  function placeName(d,fallback){
    var L=window.AzanLang.current(), nd=(d&&d.namedetails)||{}, a=(d&&d.address)||{};
    return nd["name:"+L]||a.city||a.town||a.village||a.county||a.state||fallback||"";
  }

  /* the search box is emptied, then filled with the name that was found, in the language of the page */
  var qEl=document.getElementById("q"), revSeq=0;
  function reverse(ll,toSearchBox,done){
    var id=++revSeq;
    if(toSearchBox)qEl.value="";
    fetch(NOMINATIM+"reverse?format=jsonv2&zoom=10&namedetails=1&accept-language="+encodeURIComponent(window.AzanLang.current())+"&lat="+ll.lat+"&lon="+ll.lng)
      .then(function(r){return r.json()})
      .then(function(d){
        if(id!==revSeq)return;                              /* a newer place replaced this one */
        var name=placeName(d,"");
        cityEl.value=name;
        if(toSearchBox)qEl.value=name;
        if(done)done(name);
        showPlace();
      })
      .catch(function(){});
  }

  /* when the language is changed, the place name is read again in the new language */
  window.addEventListener("azan:langchange",function(){
    if(!placed)return;
    var old=cityEl.value, ll=marker.getLatLng(), sameInBox=(qEl.value&&qEl.value===old);
    reverse(ll,false,function(name){ if(sameInBox)qEl.value=name; });
  });

  /* double click on the map or drag the marker */
  marker.on("drag",updateQibla);
  map.on("zoomend resize",updateQibla);
  updateQibla();
  map.doubleClickZoom.disable();          /* double click now picks a place instead of zooming */
  map.on("dblclick",function(e){setPos(e.latlng);reverse(e.latlng,true)});
  marker.on("dragend",function(){var ll=marker.getLatLng();setPos(ll);reverse(ll,true)});

  /* search box */
  document.getElementById("searchForm").addEventListener("submit",function(e){
    e.preventDefault();
    var q=document.getElementById("q").value.trim();
    if(!q)return;
    say(window.AzanLang.t("searching"));
    fetch(NOMINATIM+"search?format=jsonv2&limit=1&addressdetails=1&namedetails=1&accept-language="+encodeURIComponent(window.AzanLang.current())+"&q="+encodeURIComponent(q))
      .then(function(r){return r.json()})
      .then(function(list){
        if(!list.length){say(window.AzanLang.t("not_found"));return}
        var p=list[0],ll=L.latLng(parseFloat(p.lat),parseFloat(p.lon)),a=p.address||{};
        rememberRegion(ll,a.country_code);
        setPos(ll,14);
        cityEl.value=placeName(p,p.name||q);
        showPlace();
        say("");
      })
      .catch(function(){say(window.AzanLang.t("search_failed"))});
  });

  /* ---- prayer times (js/azangoo-prayer-times.js) ---- */
  var timeEls={},placeEl=document.getElementById("place");
  Array.prototype.forEach.call(document.querySelectorAll("[data-t]"),function(e){timeEls[e.getAttribute("data-t")]=e});
  var seq=0,lastTimes=null;
  function paintTimes(){
    if(!lastTimes)return;
    for(var k in timeEls)timeEls[k].textContent=window.AzanLang.num(lastTimes[k]);
    markNext();
  }

  function showPlace(){
    var A=window.AzanLang, p=marker.getLatLng();
    if(!placed){placeEl.textContent=A.t("pick_place");return}
    var ns=p.lat>=0?A.t("dir_n"):A.t("dir_s"), ew=p.lng>=0?A.t("dir_e"):A.t("dir_w");
    placeEl.textContent=(cityEl.value?cityEl.value+" \u00B7 ":"")+
      A.num(Math.abs(p.lat).toFixed(4))+" "+ns+", "+A.num(Math.abs(p.lng).toFixed(4))+" "+ew;
  }

  /* zone name and current UTC offset of the selected point.
     Tries Open-Meteo, then timeapi.io (both free, no key). A service that fails is skipped for 5 minutes. */
  function fetchJson(url){
    var ctl=window.AbortController?new AbortController():null;
    var timer=setTimeout(function(){if(ctl)ctl.abort()},7000);
    return fetch(url,ctl?{signal:ctl.signal}:{}).then(function(r){
      clearTimeout(timer);
      if(!r.ok)throw new Error("http "+r.status);
      return r.json();
    },function(err){clearTimeout(timer);throw err});
  }

  var zoneServices=[
    {
      name:"open-meteo",
      url:function(ll){return "https://api.open-meteo.com/v1/forecast?latitude="+ll.lat.toFixed(4)+"&longitude="+ll.lng.toFixed(4)+"&daily=sunrise&forecast_days=1&timezone=auto"},
      parse:function(d){
        if(typeof d.utc_offset_seconds!=="number"||!d.timezone)throw new Error("no zone");
        return {h:d.utc_offset_seconds/3600,zone:d.timezone};
      }
    },
    {
      name:"timeapi",
      url:function(ll){return "https://timeapi.io/api/TimeZone/coordinate?latitude="+ll.lat.toFixed(4)+"&longitude="+ll.lng.toFixed(4)},
      parse:function(d){
        if(!d.timeZone)throw new Error("no zone");
        var h=d.currentUtcOffset&&typeof d.currentUtcOffset.seconds==="number"?d.currentUtcOffset.seconds/3600:null;
        return {h:h,zone:d.timeZone};
      }
    }
  ];
  var zoneDownUntil={};

  /* resolves {h, zone, ok}; zone is null when only the device offset is known */
  function getOffset(ll){
    var i=0;
    function next(){
      if(i>=zoneServices.length)return Promise.resolve({h:-new Date().getTimezoneOffset()/60,zone:null,ok:false});
      var s=zoneServices[i++];
      if(zoneDownUntil[s.name]>Date.now())return next();
      return fetchJson(s.url(ll))
        .then(function(d){var r=s.parse(d);return {h:r.h,zone:r.zone,ok:true}})
        .catch(function(){zoneDownUntil[s.name]=Date.now()+300000;return next()});
    }
    return next();
  }

  function ymd(ms){var d=new Date(ms);return {year:d.getUTCFullYear(),month:d.getUTCMonth()+1,day:d.getUTCDate()}}

  var zoneKnown=false, lastRecalc=0;
  function recalc(){
    if(!window.AzangooPrayerTimes)return;
    if(!placed){for(var k0 in timeEls)timeEls[k0].textContent="—";lastTimes=null;return}
    var ll=marker.getLatLng(),id=++seq;
    getOffset(ll).then(function(o){
      if(id!==seq)return;                                   /* a newer position replaced this one */
      var r;
      try{
        r=AzangooPrayerTimes.calculateForNow({
          latitude:ll.lat,longitude:ll.lng,zoneName:o.zone,fallbackOffsetHours:o.h,now:Date.now()
        });
      }catch(err){say(window.AzanLang.t("calc_fail"));return}
      lastTimes={fajr:r.fajr,fajrNext:r.nextfajr,sunrise:r.sunrise,dhuhr:r.dhuhr,sunset:r.sunset,
                 maghrib:r.maghrib,midnight:r.midnight,fajrNext:r.nextfajr};
      lastOffset=o.h;
      zoneKnown=!!o.ok;
      lastRecalc=Date.now();
      paintTimes();
      markNext();
      updateMoonSky();
      if(window.MoonInfo)MoonInfo.update(ll.lat,ll.lng,o.h);
      window.AzanPlace={latitude:ll.lat,longitude:ll.lng,zoneName:o.zone,fallbackOffsetHours:o.h};
      tick(true);
      if(!o.ok)say(window.AzanLang.t("zone_fallback"));
    });
  }

  /* highlight the next adhan (fajr, dhuhr, maghrib, then tomorrow's fajr),
     using the local time of the selected place */
  var adhans=["fajr","dhuhr","maghrib","fajrNext"];
  function toMin(s){var m=/^(\d{1,2}):(\d\d)$/.exec(s);return m?(+m[1])*60+(+m[2]):null}
  function markNext(){
    if(!lastTimes)return;
    var n=new Date(Date.now()+lastOffset*3600000),now=n.getUTCHours()*60+n.getUTCMinutes();
    var prev=-1,next=null;
    adhans.forEach(function(k){
      var m=toMin(lastTimes[k]);
      if(m===null)return;
      while(m<prev)m+=1440;                 /* tomorrow's fajr comes after maghrib */
      prev=m;
      if(next===null&&m>now)next=k;
    });
    for(var k in timeEls)timeEls[k].parentNode.classList.toggle("next",k===next);
  }
  setInterval(markNext,30000);

  /* the sky behind the moon picture: sunrise, day, sunset or night, by the local time of the selected place.
     "sunrise" and "sunset" last SKY_SPAN minutes before and after the real sunrise / sunset (not the maghrib adhan). */
  var SKY_SPAN=30;
  function skyState(now,sr,ss){
    if(ss<sr)ss+=1440;                                      /* sunset after midnight (far north or south) */
    for(var d=-1440;d<=1440;d+=1440){
      var n=now+d;
      if(Math.abs(n-sr)<=SKY_SPAN)return "sunrise";
      if(Math.abs(n-ss)<=SKY_SPAN)return "sunset";
      if(n>sr+SKY_SPAN&&n<ss-SKY_SPAN)return "day";
    }
    return "night";
  }
  function updateMoonSky(){
    var box=document.querySelector(".moon");
    if(!box)return;
    var sr=lastTimes?toMin(lastTimes.sunrise):null, ss=lastTimes?toMin(lastTimes.sunset):null;
    if(sr===null||ss===null){box.setAttribute("data-sky","night");return}   /* no place or no sunrise / sunset: the starry sky */
    var n=new Date(Date.now()+lastOffset*3600000);
    box.setAttribute("data-sky",skyState(n.getUTCHours()*60+n.getUTCMinutes(),sr,ss));
  }
  setInterval(updateMoonSky,30000);

  /* countdown to the next adhan (fajr, dhuhr, maghrib, tomorrow's fajr) */
  var cdEl=document.getElementById("countdown");
  var COUNT=[["fajr","adhan_fajr"],["dhuhr","adhan_dhuhr"],["maghrib","adhan_maghrib"],["fajrNext","adhan_fajr_next"]];
  function updateCountdown(){
    if(!lastTimes||!cdEl)return;
    markNext();                                      /* highlight moves to the next adhan the moment one starts */
    /* while the adhan is playing (from its start or from the middle) the line says so;
       the moment it ends, the countdown to the next adhan comes back */
    if(player&&!player.paused&&!player.ended){cdEl.textContent=window.AzanLang.t("adhan_now");return}
    var d=new Date(Date.now()+lastOffset*3600000);
    var nowS=d.getUTCHours()*3600+d.getUTCMinutes()*60+d.getUTCSeconds();
    var prev=-1,next=null,nextS=0;
    COUNT.forEach(function(x){
      var m=toMin(lastTimes[x[0]]);
      if(m===null)return;
      var s=m*60;
      while(s<prev)s+=86400;                         /* after maghrib, tomorrow's fajr comes next */
      prev=s;
      if(next===null&&s>nowS){next=x;nextS=s}
    });
    if(!next){cdEl.textContent="";return}
    var A=window.AzanLang, rem=nextS-nowS;
    cdEl.textContent=A.t("countdown",{
      name:A.t(next[1]),
      h:A.num(Math.floor(rem/3600)),
      m:A.num(Math.floor(rem%3600/60)),
      s:A.num(rem%60)
    });
  }
  setInterval(function(){
    if(!placed)return;
    if(!zoneKnown||Date.now()-lastRecalc>300000)recalc();
  },60000);
  /* when the whole page (fonts, map, scripts) has finished loading, calculate once more */
  window.addEventListener("load",function(){
    if(placed)recalc();
  });
  document.addEventListener("visibilitychange",function(){
    if(!document.hidden&&placed)recalc();
  });
  setInterval(updateCountdown,1000);
  updateCountdown();
  window.addEventListener("azan:langchange",updateCountdown);

  /* Ramadan (Hijri month 9): countdown to the end of suhur (Fajr) and iftar (maghrib), with an optional reminder */
  var ramBox=document.getElementById("ramadanBox"),
      ramSuhur=document.getElementById("ramSuhur"),
      ramIftar=document.getElementById("ramIftar"),
      ramRemind=document.getElementById("ramRemind"),
      ramMsg=document.getElementById("ramMsg");
  var ramFired={};
  function nextAt(hm,nowS){                       /* next time of day (seconds) after nowS */
    var m=toMin(hm);
    if(m===null)return null;
    var s=m*60;
    while(s<=nowS)s+=86400;
    return s;
  }
  function hms(rem){
    var A=window.AzanLang;
    return {h:A.num(Math.floor(rem/3600)),m:A.num(Math.floor(rem%3600/60)),s:A.num(rem%60)};
  }
  function remindOnce(key,text){
    if(ramFired[key])return;
    ramFired[key]=true;
    ramMsg.textContent=text;
    if(window.Notification&&Notification.permission==="granted"){
      try{new Notification(text,{icon:"images/logo-azangoo-120.png"})}catch(e){}
    }
  }
  function updateRamadan(){
    if(!ramBox||!lastTimes){if(ramBox)ramBox.hidden=true;return}
    var A=window.AzanLang, d=new Date(Date.now()+lastOffset*3600000);
    var ramadan=hijriMonthOf(d)===9;
    ramBox.hidden=!ramadan;
    if(!ramadan)return;
    var nowS=d.getUTCHours()*3600+d.getUTCMinutes()*60+d.getUTCSeconds();
    var sT=nextAt(lastTimes.fajr,nowS), iT=nextAt(lastTimes.maghrib,nowS);   /* suhur ends at the Fajr adhan */
    if(sT!==null)ramSuhur.textContent=A.t("ram_suhur",hms(sT-nowS));
    if(iT!==null)ramIftar.textContent=A.t("ram_iftar",hms(iT-nowS));
    if(!ramRemind.checked)return;
    var day=d.getUTCFullYear()+"-"+d.getUTCMonth()+"-"+d.getUTCDate();
    if(sT!==null&&sT-nowS<=600)remindOnce(day+"-suhur",A.t("ram_remind_suhur"));
    if(iT!==null&&iT-nowS<=600&&iT-nowS>0)remindOnce(day+"-iftar10",A.t("ram_remind_iftar"));
    var mS=toMin(lastTimes.maghrib);
    if(mS!==null&&nowS>=mS*60&&nowS<mS*60+60)remindOnce(day+"-iftar",A.t("ram_iftar_now"));
  }
  if(ramRemind){
    ramRemind.addEventListener("change",function(){
      var A=window.AzanLang;
      if(!ramRemind.checked){ramMsg.textContent="";return}
      if(window.Notification&&Notification.permission==="default")Notification.requestPermission();
      ramMsg.textContent=(window.Notification&&Notification.permission==="granted")?"":A.t("ram_no_notif");
    });
  }
  /* daily dua before the adhan: data/doa.json says which Hijri months have it (daily = "1");
     the file for the weekday is played so that it ends one second before the adhan.
     The adhan itself is played by the normal adhan check at its minute. */
  var DUA_FILES=["audio/doa/doa-sun.mp3","audio/doa/doa-mon.mp3","audio/doa/doa-tue.mp3","audio/doa/doa-wed.mp3",
                 "audio/doa/doa-thu.mp3","audio/doa/doa-fri.mp3","audio/doa/doa-sat.mp3"];   /* index = getDay() */
  var doaList=null, doaFired={};
  var dailyPlayer=new Audio();
  dailyPlayer.preload="auto";
  var nextDuaPlayer=new Audio();
  nextDuaPlayer.preload="metadata";

  /* Ramadan duas (flag "ramadan" per Hijri month in data/doa.json). There are two sets of files; each set plays one file after
     another in letter order and its last file ends 1 second before the adhan:
       sahar = Dua_for_Sahar-A..H before the fajr adhan,  iftar = Dua-Eftar-A..I before the maghrib adhan.
     Where the flag is on, the Ramadan dua replaces the daily dua before fajr and before maghrib (dhuhr keeps the daily dua).
     One player plays a whole set; the other audio objects only read the lengths (and warm the cache shortly before the start).
     A person who arrives in the middle hears the rest, from that point. */
  function ramFiles(prefix,letters){return letters.split("").map(function(x){return "audio/doa/ramadan/"+prefix+x+".mp3"})}
  var RAM_SETS={
    sahar:{kind:"fajr",timerKey:"dua_timer_sahar",files:ramFiles("Dua_for_Sahar-","ABCDEFGH"),
           fallback:[317.44,292.467,234.005,334.472,298.58,5.695,319.426,404.01]},          /* lengths in seconds, used until the browser reports the real ones */
    iftar:{kind:"maghrib",timerKey:"dua_timer_iftar",files:ramFiles("Dua-Eftar-","ABCDEFGHI"),
           fallback:[62.454,164.452,134.646,158.114,135.414,56.785,143.12,78.833,69.115]}
  };
  var RAM_LIST=[RAM_SETS.sahar,RAM_SETS.iftar];
  RAM_LIST.forEach(function(S){S.pre=null;S.warm=false;S.busy=false});
  var ramPlayer=new Audio();
  ramPlayer.preload="auto";
  var ramCur=null, ramIdx=0, ramChain=false;                 /* the set that is playing, the file in it, and whether the next file follows */
  function ramPrepare(S){
    if(S.pre)return;
    S.pre=S.files.map(function(f){var a=new Audio();a.preload="metadata";a.src=f;return a});
  }
  function ramWarmUp(S){
    if(S.warm||!S.pre)return;
    S.warm=true;
    S.pre.forEach(function(a){a.preload="auto";try{a.load()}catch(e){}});
  }
  function ramDurations(S){
    return S.files.map(function(f,i){
      var d=S.pre&&S.pre[i]?S.pre[i].duration:NaN;
      return (isFinite(d)&&d>0)?d:S.fallback[i];
    });
  }
  function ramTotal(S){return ramDurations(S).reduce(function(a,b){return a+b},0)}
  /* play file number idx of set S from offset seconds; done(true|false) tells whether it started */
  function playRamAt(S,idx,off,done){
    ramCur=S; ramIdx=idx;
    var f=S.files[idx], settled=false, timer=null;
    function finish(ok){
      if(settled)return;
      settled=true;
      clearTimeout(timer);
      ramPlayer.removeEventListener("loadedmetadata",go);
      ramPlayer.removeEventListener("error",fail);
      if(done)done(ok);
    }
    function fail(){finish(false)}
    function go(){
      ramPlayer.removeEventListener("loadedmetadata",go);
      try{ramPlayer.currentTime=off||0}catch(e){}
      var p=null;
      try{p=ramPlayer.play()}catch(e){p=null}
      if(p&&p.then)p.then(function(){finish(true)}).catch(fail);
      else finish(p!==null);
    }
    if(ramPlayer.getAttribute("data-file")!==f){ramPlayer.setAttribute("data-file",f);ramPlayer.src=f}
    ramPlayer.addEventListener("error",fail);
    timer=setTimeout(fail,8000);                              /* file missing or very slow: the caller tries again */
    if(ramPlayer.readyState>=1)go(); else ramPlayer.addEventListener("loadedmetadata",go);
  }
  ramPlayer.addEventListener("ended",function(){
    if(!ramChain||!ramCur)return;
    var S=ramCur;
    if(ramIdx+1<S.files.length)playRamAt(S,ramIdx+1,0,function(ok){if(!ok)ramChain=false});
    else ramChain=false;
  });

  /* the monthly flags are read from the server (data/doa.json) and re-read every 30 minutes,
     so a change in the file is picked up without touching the code. If it cannot be read, nothing is played. */
  function loadDoaList(){
    try{
      fetch("data/doa.json?_="+Date.now(),{cache:"no-store"})
        .then(function(r){ if(!r.ok)throw new Error("doa "+r.status); return r.json(); })
        .then(function(list){ if(Array.isArray(list))doaList=list; })
        .catch(function(){ /* keep the last good list; if there never was one, doaList stays null */ });
    }catch(e){}
  }
  loadDoaList();
  setInterval(loadDoaList,30*60*1000);
  setTimeout(function(){ if(!doaList)loadDoaList(); },5000);   /* quick retry if the first read failed */

  /* 0) the monthly flag: daily = "1" means on for that Hijri month, "0" means off */
  function dailyOn(d){
    if(!doaList)return false;
    var m=hijriMonthOf(d), rec=null;
    for(var i=0;i<doaList.length;i++){ if(+doaList[i].order===m){rec=doaList[i];break} }
    return !!rec&&String(rec.daily)==="1";
  }
  /* the Ramadan flag of the Hijri month: ramadan = "1" means the Ramadan dua is used before maghrib */
  function ramadanOn(d){
    if(!doaList)return false;
    var m=hijriMonthOf(d), rec=null;
    for(var i=0;i<doaList.length;i++){ if(+doaList[i].order===m){rec=doaList[i];break} }
    return !!rec&&String(rec.ramadan)==="1";
  }
  /* 2/3) the user's switch: the "automatic adhan and dua" box (saved default if any, otherwise on) */
  function userWantsDua(){ return !!autoEl&&autoEl.checked; }

  /* browsers block sound until the person has touched the page once: unlock both players on the first touch */
  var audioUnlocked=false;
  function unlockAudio(){
    if(audioUnlocked)return;
    audioUnlocked=true;
    [dailyPlayer,ramPlayer,player].forEach(function(a){
      if(!a.paused)return;                                   /* never interrupt a sound that is already playing */
      try{
        a.muted=true;
        var p=a.play();
        var back=function(){ a.pause(); a.currentTime=0; a.muted=false; };
        if(p&&p.then)p.then(back).catch(function(){ a.muted=false; }); else back();
      }catch(e){ a.muted=false; }
    });
  }
  ["click","touchstart","keydown"].forEach(function(ev){ document.addEventListener(ev,unlockAudio,{once:true,passive:true}); });

  /* the daily dua; kinds = the adhans it is played before */
  function checkDailyDua(nowMs,day,kinds){
    var now=new Date(Date.now()+lastOffset*3600000);
    var file=DUA_FILES[now.getUTCDay()];
    if(!file)return;
    if(dailyPlayer.getAttribute("data-file")!==file){
      dailyPlayer.setAttribute("data-file",file);
      dailyPlayer.src=file;
      dailyPlayer.load();
    }
    /* 3) flag on but the user's switch is off: nothing is played */
    if(!userWantsDua())return;
    var dur=dailyPlayer.duration;
    if(!isFinite(dur)||dur<=0)return;                        /* the length is not known yet */
    if(!dailyPlayer.paused)return;                           /* already playing */
    kinds.forEach(function(k){
      var m=toMin(lastTimes[k]);
      if(m===null)return;
      /* 4) the dua ends 1 second before the adhan, which starts at the beginning of its minute */
      var endMs=m*60000-1000, startMs=endMs-dur*1000;
      var key=day+k+"dua";
      if(doaFired[key]||!dailyPlayer.paused)return;
      /* from the start of the dua until half a second before its end: a person who arrives in the middle
         hears it from that point; if the browser blocks the sound it is retried until the dua is over */
      if(nowMs>=startMs&&nowMs<endMs-500){
        try{ dailyPlayer.currentTime=Math.max(0,(nowMs-startMs)/1000); }catch(e){}
        var p=dailyPlayer.play();
        if(p&&p.then)p.then(function(){ doaFired[key]=true; }).catch(function(){});
        else doaFired[key]=true;
      }
    });
  }
  /* a Ramadan dua (set S) before its adhan: the files in a row; someone who arrives in the middle hears the rest */
  function checkRamSet(S,nowMs,day){
    ramPrepare(S);
    var m=toMin(lastTimes[S.kind]);
    if(m===null)return;
    var endMs=m*60000-1000, startMs=endMs-ramTotal(S)*1000;
    if(nowMs<endMs&&startMs-nowMs<20*60000)ramWarmUp(S);     /* fetch the files shortly before they are needed */
    var key=day+S.kind+"ramdua";
    if(doaFired[key]||S.busy)return;
    if(nowMs>=startMs&&nowMs<endMs-500){
      var pos=(nowMs-startMs)/1000, durs=ramDurations(S), i=0;
      while(i<durs.length-1&&pos>=durs[i]){pos-=durs[i];i++}
      S.busy=true;
      playRamAt(S,i,pos,function(ok){
        S.busy=false;
        if(ok){doaFired[key]=true;ramChain=true}
      });
    }
  }
  function checkRamadanDua(nowMs,day){
    if(!userWantsDua())return;                              /* the user's automatic adhan and dua switch */
    RAM_LIST.forEach(function(S){checkRamSet(S,nowMs,day)});
  }
  function checkDua(){
    if(!lastTimes||!doaList)return;
    var now=new Date(Date.now()+lastOffset*3600000);
    var dayOn=dailyOn(now), ramOn=ramadanOn(now);
    /* 1) both flags off: nothing is loaded or played */
    if(!dayOn&&!ramOn)return;
    var nowMs=now.getUTCHours()*3600000+now.getUTCMinutes()*60000+now.getUTCSeconds()*1000+now.getUTCMilliseconds();
    var day=now.getUTCFullYear()+"-"+now.getUTCMonth()+"-"+now.getUTCDate();
    /* where the Ramadan dua is on, it replaces the daily dua before fajr and before maghrib (dhuhr keeps the daily dua) */
    if(dayOn)checkDailyDua(nowMs,day,ramOn?["dhuhr"]:["fajr","dhuhr","maghrib"]);
    if(ramOn)checkRamadanDua(nowMs,day);
  }
  setInterval(checkDua,250);
  /* timer: when the daily dua starts before the next adhan (fajr, dhuhr, maghrib) */
  var duaTimerEl=document.getElementById("duaTimer");
  function hhmmss(s){
    /* whole seconds only: no milliseconds or fractions */
    s=Math.floor(s);
    var A=window.AzanLang, h=Math.floor(s/3600), m=Math.floor(s%3600/60), x=s%60;
    return A.num((h<10?"0":"")+h)+":"+A.num((m<10?"0":"")+m)+":"+A.num((x<10?"0":"")+x);
  }
  function updateDuaTimer(){
    if(!duaTimerEl)return;
    var A=window.AzanLang;
    /* the line is shown only when a dua will be played; otherwise it stays empty */
    /* if the dua list cannot be read, say so (this is the only message); otherwise a flag that is off stays silent */
    if(lastTimes&&autoEl.checked&&!doaList){duaTimerEl.textContent=A.t("dua_nolist");return}
    if(!lastTimes||!autoEl.checked||!doaList){duaTimerEl.textContent="";return}
    var d=new Date(Date.now()+lastOffset*3600000);
    var dayOn=dailyOn(d), ramOn=ramadanOn(d);
    if((!dayOn&&!ramOn)||!userWantsDua()){duaTimerEl.textContent="";return}
    var nowS=d.getUTCHours()*3600+d.getUTCMinutes()*60+d.getUTCSeconds();
    var best=null;
    /* one line: which dua, at what time it starts, and before which adhan (no countdown) */
    function show(start,key,wd,kind){
      duaTimerEl.textContent=A.t(key,{day:A.names("weekdays")[wd],start:hhmmss(start%86400),adhan:A.t("adhan_"+kind)});
    }
    if(dayOn){
      var dur=dailyPlayer.duration;
      if(!isFinite(dur)||dur<=0){duaTimerEl.textContent=A.t("dua_loading");return}
      (ramOn?["dhuhr"]:["fajr","dhuhr","maghrib"]).forEach(function(k){
        var m=toMin(lastTimes[k]);
        if(m===null)return;
        var start=m*60-1-dur;
        if(start>nowS&&(best===null||start<best.start))best={start:start,key:"dua_timer",wd:d.getUTCDay(),kind:k};
      });
    }
    if(ramOn){
      RAM_LIST.forEach(function(S){
        ramPrepare(S);
        var mm=toMin(lastTimes[S.kind]);
        if(mm===null)return;
        var rs=mm*60-1-ramTotal(S);
        if(rs>nowS&&(best===null||rs<best.start))best={start:rs,key:S.timerKey,wd:d.getUTCDay(),kind:S.kind};
      });
    }
    if(best){show(best.start,best.key,best.wd,best.kind);return}
    /* today is over: tomorrow's dua before tomorrow's Fajr (the Ramadan Sahar dua or the daily dua), if tomorrow's month has one */
    var d2=new Date(d.getTime()+86400000), fn=toMin(lastTimes.fajrNext);
    if(fn===null){duaTimerEl.textContent="";return}
    if(ramadanOn(d2)){
      ramPrepare(RAM_SETS.sahar);
      show(fn*60-1-ramTotal(RAM_SETS.sahar)+86400,RAM_SETS.sahar.timerKey,d2.getUTCDay(),"fajr");
      return;
    }
    if(!dailyOn(d2)){duaTimerEl.textContent="";return}
    var tf=DUA_FILES[d2.getUTCDay()];
    if(nextDuaPlayer.getAttribute("data-file")!==tf){
      nextDuaPlayer.setAttribute("data-file",tf);
      nextDuaPlayer.src=tf;
      nextDuaPlayer.load();
    }
    var durT=nextDuaPlayer.duration;
    if(!isFinite(durT)||durT<=0){duaTimerEl.textContent=A.t("dua_loading");return}
    show(fn*60-1-durT+86400,"dua_timer",d2.getUTCDay(),"fajr");
  }
  setInterval(updateDuaTimer,1000);

  setInterval(updateRamadan,1000);

  updateRamadan();
  if(window.AzanOfficial)AzanOfficial.onReady(updateRamadan);
  if(window.AzanOfficial&&AzanOfficial.onChange)AzanOfficial.onChange(updateRamadan);
  window.addEventListener("azan:langchange",updateRamadan);

  /* "محاسبه اوقات" button: use the typed latitude and longitude */
  document.querySelector(".coords").addEventListener("submit",function(e){
    e.preventDefault();
    var lat=parseFloat(window.AzanLang.toAscii(latEl.value)),lng=parseFloat(window.AzanLang.toAscii(lngEl.value));
    if(!(lat>=-90&&lat<=90&&lng>=-180&&lng<=180)){say(window.AzanLang.t("bad_coords"));return}
    say("");
    var ll=L.latLng(lat,lng);
    setPos(ll,15);
    reverse(ll,true);
  });

  /* ---- adhan sound: plays by itself at fajr, dhuhr and maghrib of the selected place ---- */
  var player=document.getElementById("adhanPlayer"),
      autoEl=document.getElementById("autoAdhan"),
      adhanMsg=document.getElementById("adhanMsg"),
      voices=document.querySelectorAll("input[name=r]"),
      played="";

  /* saved defaults: written only by the "ذخیره پیش‌فرض‌ها" button, read on every visit */
  var DEF_KEY="azangoo-defaults";
  var defaults=null;
  try{defaults=JSON.parse(localStorage.getItem(DEF_KEY))}catch(e){defaults=null}

  /* voice and auto-play: saved values if there are any, otherwise the values in the page */
  if(defaults&&defaults.voice){
    var voiceExists=false;
    Array.prototype.forEach.call(voices,function(r){ if(r.value===defaults.voice)voiceExists=true; });
    /* a saved voice that was removed from the site (e.g. an old reciter) is ignored: the page default stays */
    if(voiceExists)Array.prototype.forEach.call(voices,function(r){r.checked=(r.value===defaults.voice)});
  }
  if(defaults&&typeof defaults.auto==="boolean")autoEl.checked=defaults.auto;
  Array.prototype.forEach.call(voices,function(r){
    r.addEventListener("change",function(){player.src=r.value});
    if(r.checked)player.src=r.value;
  });

  /* the save button */
  var saveBtn=document.getElementById("saveDefaults"),
      saveMsg=document.getElementById("saveMsg");
  var confirmDlg=document.getElementById("saveDlg");
  function doSave(){
    var voice=null;
    Array.prototype.forEach.call(voices,function(r){if(r.checked)voice=r.value});
    var ll=marker.getLatLng();
    var data={place:{lat:ll.lat,lng:ll.lng,city:cityEl.value||""},voice:voice,auto:autoEl.checked,lang:window.AzanLang.current(),theme:window.AzanTheme?window.AzanTheme.current():"dark"};
    try{
      localStorage.setItem(DEF_KEY,JSON.stringify(data));
      saveMsg.textContent=window.AzanLang.t("saved");
    }catch(e){saveMsg.textContent=window.AzanLang.t("save_fail");}
  }
  /* saving asks first, in a small pop-up */
  function closeSaveDlg(){ if(confirmDlg.close)confirmDlg.close(); else confirmDlg.removeAttribute("open"); }
  if(saveBtn&&confirmDlg){
    saveBtn.addEventListener("click",function(){
      saveMsg.textContent="";
      if(confirmDlg.showModal)confirmDlg.showModal(); else confirmDlg.setAttribute("open","");
    });
    document.getElementById("saveYes").addEventListener("click",function(){
      closeSaveDlg();
      doSave();
    });
    document.getElementById("saveNo").addEventListener("click",function(){
      closeSaveDlg();
      saveMsg.textContent=window.AzanLang.t("no_change");
    });
  }

  /* after-adhan dua: only after the maghrib adhan (the old after-fajr dua was removed; the Sahar dua now plays before fajr) */
  var duaPlayer=new Audio();
  var pendingAfter=null;
  /* Hijri month number of a local date (d has the local date in its UTC fields); official list first */
  function hijriMonthOf(d){
    var ymd=d.getUTCFullYear()+"-"+pad(d.getUTCMonth()+1)+"-"+pad(d.getUTCDate());
    var e=window.AzanOfficial?window.AzanOfficial.covering(ymd):null;
    return e?+e.hijriMonth:partsOf(fHijri,d).month;
  }
  player.addEventListener("ended",function(){
    mutedAuto=false; player.muted=false;
    adhanMsg.textContent="";
    var kind=pendingAfter;
    pendingAfter=null;
    if(!kind)return;
    /* after the maghrib adhan: the Iftar dua, always exactly 1 second after the adhan ends, when the "ramadan" flag of the
       Hijri month in data/doa.json is 1 and the automatic adhan and dua switch is on. */
    setTimeout(function(){
      if(!autoEl.checked)return;
      if(!ramadanOn(new Date(Date.now()+lastOffset*3600000)))return;
      var f="audio/doa/ramadan/Eftar_after_Azan.mp3";
      if(duaPlayer.getAttribute("data-file")!==f){duaPlayer.setAttribute("data-file",f);duaPlayer.src=f;}
      try{duaPlayer.currentTime=0}catch(e){}
      var p=duaPlayer.play();
      if(p&&p.catch)p.catch(function(){});                    /* file missing or playback blocked */
    },1000);
  });

  player.preload="auto";
  /* The browser may block sound until the person has touched the page. In that case the adhan is started
     silently (always allowed) at the right position, and the first touch anywhere turns the sound on. */
  var mutedAuto=false, mutedName="";
  /* the Iftar dua file is loaded while the maghrib adhan plays, so it can start on time after it */
  function prepareAfter(kind){
    if(kind!=="maghrib"||!autoEl.checked)return;
    if(!ramadanOn(new Date(Date.now()+lastOffset*3600000)))return;
    var f="audio/doa/ramadan/Eftar_after_Azan.mp3";
    if(duaPlayer.getAttribute("data-file")!==f){
      duaPlayer.setAttribute("data-file",f);duaPlayer.preload="auto";duaPlayer.src=f;
      try{duaPlayer.load()}catch(e){}
    }
  }
  function playAdhan(name,key,kind,offset){
    if(!player.paused)return;                                  /* already playing */
    try{ player.currentTime=offset||0; }catch(e){}
    player.muted=false;
    var p=player.play();
    function ok(){ played=key; pendingAfter=kind; prepareAfter(kind); adhanMsg.textContent=window.AzanLang.t("playing",{name:name}); updateCountdown(); }
    function silent(){
      played=key; pendingAfter=kind; prepareAfter(kind); mutedAuto=true; mutedName=name;
      adhanMsg.textContent=window.AzanLang.t("adhan_muted");
      updateCountdown();
    }
    function blocked(){
      player.muted=true;
      var q;
      try{ q=player.play(); }catch(e){ q=null; }
      if(q&&q.then)q.then(silent).catch(function(){            /* even silent playback was refused: retried on the next tick */
        player.muted=false;
        adhanMsg.textContent=window.AzanLang.t("time_for",{name:name});
      });
      else if(q===undefined)silent();
      else{ player.muted=false; adhanMsg.textContent=window.AzanLang.t("time_for",{name:name}); }
    }
    if(p&&p.then)p.then(ok).catch(blocked);
    else ok();
  }
  function unmuteOnTouch(){
    if(!mutedAuto)return;
    mutedAuto=false;
    player.muted=false;
    if(!player.paused)adhanMsg.textContent=window.AzanLang.t("playing",{name:mutedName});
  }
  ["click","touchstart","keydown"].forEach(function(ev){ document.addEventListener(ev,unmuteOnTouch,{passive:true}); });
  /* the countdown line follows the player at once, without waiting for the next second */
  ["play","playing","pause","ended","emptied"].forEach(function(ev){ player.addEventListener(ev,function(){ updateCountdown(); }); });

  function checkAdhan(){
    if(!lastTimes||!autoEl.checked)return;
    var d=new Date(Date.now()+lastOffset*3600000),
        nowMs=d.getUTCHours()*3600000+d.getUTCMinutes()*60000+d.getUTCSeconds()*1000+d.getUTCMilliseconds(),
        day=d.getUTCFullYear()+"-"+d.getUTCMonth()+"-"+d.getUTCDate(),
        dur=player.duration;
    [["fajr","adhan_fajr"],["dhuhr","adhan_dhuhr"],["maghrib","adhan_maghrib"]].forEach(function(x){
      var m=toMin(lastTimes[x[0]]);
      if(m===null)return;
      var key=day+x[0];
      if(played===key||!player.paused)return;
      var startMs=m*60000;
      /* from the start of the adhan until the end of the recording: a person who arrives in the middle hears it from that point */
      var len=(isFinite(dur)&&dur>0)?dur*1000-500:2500;
      if(nowMs>=startMs&&nowMs<startMs+len){
        playAdhan(window.AzanLang.t(x[1]),key,x[0]==="maghrib"?"maghrib":null,(nowMs-startMs)/1000);
      }
    });
  }
  setInterval(checkAdhan,250);

  onNewDay=recalc;
  showPlace();
  recalc();

  /* permission: explain first, then ask the browser only if the user agrees */
  var locDlg=document.getElementById("locDlg"),
      locYes=document.getElementById("locYes"),
      locNo=document.getElementById("locNo");
  function requestGps(){
    if(!navigator.geolocation){say(window.AzanLang.t("geo_denied"));return}
    say(window.AzanLang.t("locating"));
    navigator.geolocation.getCurrentPosition(function(pos){
      var ll=L.latLng(pos.coords.latitude,pos.coords.longitude);
      setPos(ll,14);reverse(ll,true);say("");
    },function(err){
      say(window.AzanLang.t(err&&err.code===1?"gps_denied":"geo_denied"));
    },{timeout:10000,maximumAge:300000});
  }
  function askLocation(){
    if(!locDlg){requestGps();return}
    locDlg.showModal?locDlg.showModal():locDlg.setAttribute("open","");
  }
  var gpsBtn=document.getElementById("gpsBtn");
  if(gpsBtn)gpsBtn.addEventListener("click",function(){ requestGps(); });
  if(locYes)locYes.addEventListener("click",function(){
    if(locDlg.close)locDlg.close();else locDlg.removeAttribute("open");
    requestGps();
  });
  if(locNo)locNo.addEventListener("click",function(){
    if(locDlg.close)locDlg.close();else locDlg.removeAttribute("open");
    say(window.AzanLang.t("pick_place"));
  });
  if(!placed&&timeEls){for(var k1 in timeEls)timeEls[k1].textContent="—";}

  /* start: saved place if there is one; otherwise ask permission and use the current location */
  var qs=new URLSearchParams(window.location.search||"");
  var qLat=parseFloat(qs.get("lat")), qLng=parseFloat(qs.get("lng"));
  if(defaults&&defaults.place&&isFinite(defaults.place.lat)&&isFinite(defaults.place.lng)){   /* saved defaults first */
    cityEl.value=defaults.place.city||"";
    setPos(L.latLng(defaults.place.lat,defaults.place.lng),15);
    reverse(L.latLng(defaults.place.lat,defaults.place.lng));   /* name in the language of the page */
  }else if(isFinite(qLat)&&isFinite(qLng)&&Math.abs(qLat)<=90&&Math.abs(qLng)<=180){   /* link from a city page, when there are no defaults */
    cityEl.value=qs.get("city")||"";
    rememberRegion(L.latLng(qLat,qLng),qs.get("cc"));   /* the city page already knows the country */
    setPos(L.latLng(qLat,qLng),15);
    try{ if(window.history&&history.replaceState) history.replaceState(null,"",window.location.pathname); }catch(e){}
  }else{
    showPlace();
    askLocation();
  }
})();
