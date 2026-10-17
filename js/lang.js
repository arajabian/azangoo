/* Copyright (c) 2026 azangoo.com. All rights reserved.
   Copying, reuse, modification or redistribution of this code, or of its calculations,
   is prohibited without written permission. See the Terms and conditions page. */
/* Language support: Persian (default) and English.
   Text lives in one dictionary. Elements in the page are marked with data-i18n (text),
   data-i18n-attr (attribute) or data-i18n-ph (placeholder). The chosen language is kept
   in the browser (separately from the saved defaults). */
(function (root) {
  'use strict';

  var lang = 'fa';

  /* Language registry. To add a language: add its text to D, its names to NAMES, and one line here. */
  var LANGS = [
    { code: 'fa', label: 'فارسی', rtl: true,  digits: 'persian' },
    { code: 'en', label: 'English', rtl: false, digits: 'latin' },
    { code: 'ur', label: 'اردو', rtl: true,  digits: 'persian' },
    { code: 'ar', label: 'العربية', rtl: true, digits: 'arabic' }
  ];
  function info(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return LANGS[0];
  }

  var D = {
    fa: {
      dua_timer_sahar: 'دعای سحر ماه رمضان ساعت {start} قبل از {adhan} شروع می‌شود.',
      dua_timer_iftar: 'دعای افطار ماه رمضان ساعت {start} قبل از {adhan} شروع می‌شود.',
      adhan_now: 'در حال پخش اذان…', adhan_muted: 'اذان بی‌صدا شروع شد؛ برای شنیدن صدا یک بار روی صفحه بزنید.',
      times_title: 'اوقات شرعی امروز', imsak: 'امساک', fajr: 'اذان صبح', sunrise: 'طلوع آفتاب',
      dhuhr: 'اذان ظهر', sunset: 'غروب آفتاب', maghrib: 'اذان مغرب', midnight: 'نیمه شب',
      fajr_next: 'اذان صبح فردا',
      cal_title: 'تقویم اوقات شرعی', cal_greg: 'میلادی', cal_shamsi: 'شمسی',
      cal_pick: 'انتخاب سال و ماه:', cal_year: '- سال -', cal_month: '- ماه -', cal_ok: 'تایید',
      cal_pick_ym: 'لطفاً سال و ماه را انتخاب کنید.', cal_need_place: 'ابتدا مکان را روی نقشه انتخاب کنید.',
      cal_no_pdf: 'ساخت PDF در دسترس نیست.', cal_busy: 'در حال ساخت PDF…', cal_done: 'فایل PDF ساخته شد.',
      cal_fail: 'ساخت PDF انجام نشد.',
      search_ph: 'جستجوی شهر یا آدرس…', search_btn: 'جستجو', searching: 'در حال جستجو…',
      not_found: 'مکانی پیدا نشد. نام شهر یا آدرس را دقیق‌تر بنویسید.',
      search_failed: 'جستجو انجام نشد. اتصال اینترنت را بررسی کنید.',
      lat: 'عرض جغرافیایی', lng: 'طول جغرافیایی', city: 'شهر', calc_btn: 'محاسبه اوقات',
      map_hint: 'روی نقشه دابل‌کلیک کنید یا نشانگر را بکشید تا مکان شما عوض شود.',
      map_label: 'نقشه', calc_fail: 'محاسبه اوقات برای این مکان ممکن نیست.',
      zone_fallback: 'منطقهٔ زمانی این مکان پیدا نشد؛ از ساعت دستگاه شما استفاده شد.',
      bad_coords: 'عرض یا طول جغرافیایی معتبر نیست.',
      locating: 'در حال پیدا کردن مکان فعلی…',
      geo_denied: 'موقع فعلی دریافت نشد. روی نقشه دابل‌کلیک کنید یا شهر را جستجو کنید.',
      moon_title: 'رؤیت ماه', moon_now: 'درصد روشنایی هم اکنون', moon_rise: 'طلوع ماه',
      moon_set: 'غروب ماه', moon_sunset: 'درصد روشنایی هنگام غروب',
      moon_visible: 'ماه {cur} در این مکان {len} روز می‌باشد و در غروب روز آخر هلال ماه {next} {illum} و به مدت {dur} دقیقه (فاصله غروب خورشید تا غروب ماه) رؤیت می‌شود.',
      moon_hidden: 'ماه {cur} در این مکان {len} روز می‌باشد. در غروب روز آخر، هلال ماه {next} با {illum} روشنایی قابل رؤیت نیست.',
      moon_start: 'اول ماه {next} در این مکان روز {weekday} {gd} {gm} {gy} برابر {sd} {sm} {sy} می‌باشد.',
      moon_follow_official: 'آغاز یا پایان ماه {cur} با اعلام رسمی ماه کناری آن هماهنگ شده است؛ طول این ماه {len} روز است.',
      moon_odeh: 'رؤیت هلال با معیار عودة (Odeh V-criterion) برآورد می‌شود؛ تخمینی است و اعلام رسمی نیست.',
      privacy_link: 'حریم خصوصی',
      moon_official_same: 'طول ماه {cur} ({len} روز) بر اساس اعلام رسمی تنظیم شده است.',
      moon_official_len: 'طول ماه {cur} بر اساس اعلام رسمی {len} روز تنظیم شد، در حالی که محاسبهٔ نجومی سایت آن را {plen} روز پیش‌بینی کرده بود.',
      moon_official_shift: 'آغاز ماه {cur} بر اساس اعلام رسمی تنظیم شد و {n} روز با محاسبهٔ نجومی سایت تفاوت دارد.',
      moon_why_short: 'هلال غروب روز {d} دیده نمی‌شود؛ پس ماه {cur} {len} روز است.',
      moon_best: 'بهترین زمان مشاهدهٔ هلال ماه {next} در این مکان: غروب {weekday} {gd} {gm}، ساعت {time} (حدود {mins} دقیقه بعد از غروب خورشید)، حدود {alt} درجه بالای افق، {dir}. {how}',
      moon_best_naked: 'با چشم غیرمسلح قابل مشاهده است.',
      moon_best_aid: 'با دوربین قابل مشاهده است و احتمال دارد با چشم غیرمسلح هم دیده شود.',
      moon_best_optical: 'فقط با دوربین قابل مشاهده است.',
      moon_best_none: 'در غروب {weekday} {gd} {gm}، هلال ماه {next} در این مکان قابل مشاهده نیست.',
      moon_best_tip: 'برای دیدن هلال، افق در آن جهت باید باز و بدون مانع باشد.',
      moon_alt: 'ماه، {p} درصد روشن',
      dir: 'از جهت {card}، {deg} درجه به سمت {side}',
      qibla: 'جهت قبله: {deg}° از شمال، در جهت عقربه‌های ساعت', qibla_label: 'جهت قبله',
      adhan_title: 'صدای اذان', r_moazen: 'موذن‌زاده اردبیلی', r_abather: 'اباذر الحلواجی', r_sobhdel: 'حسین صبحدل', r_najafi: 'فرید نجفی', auto_label: 'پخش خودکار اذان و دعا',
      auto_hint: 'برای پخش خودکار، این صفحه باید باز باشد و یک بار روی آن کلیک کرده باشید.',
      playing: 'در حال پخش {name}', time_for: 'وقت {name} است. برای پخش، دکمهٔ پخش را بزنید.',
      adhan_fajr: 'اذان صبح', adhan_dhuhr: 'اذان ظهر', adhan_maghrib: 'اذان مغرب',
      save_btn: 'ذخیره پیش‌فرض‌ها', save_q: 'تنظیمات فعلی شما (مکان روی نقشه، صدای اذان، پخش خودکار اذان و دعا، زبان و تم تیره/روشن) به‌عنوان پیش‌فرض در همین مرورگر ذخیره می‌شود و دفعهٔ بعد خودکار بارگذاری خواهد شد. پیش‌فرض‌های قبلی شما جایگزین می‌شوند. ذخیره شود؟',
      yes: 'بله', no: 'خیر', saved: 'تنظیمات پیش‌فرض ذخیره شد.',
      save_fail: 'ذخیره انجام نشد. حافظهٔ مرورگر در دسترس نیست.', no_change: 'تغییری ذخیره نشد.',
      donate_title: 'جهت مشارکت در هزینه های وب سایت اینجا را کلیک کنید', donate: 'کمک مالی',
      copyright: '© 2026 azangoo.com · All rights reserved',
      dua_off_auto: 'پخش خودکار اذان خاموش است', dua_off: 'پخش دعای روزانه خاموش است', dua_nolist: 'فایل دعاها خوانده نشد', dua_nomonth: 'این ماه قمری دعای روزانه ندارد', dua_passed: 'دعای امروز گذشته است',
      dua_timer: 'دعای روز ({day}) ساعت {start} قبل از {adhan} شروع می‌شود.', dua_loading: 'دعای روزانه: در حال آماده‌سازی…',
      dua_opt: 'پخش خودکار دعای روزانه قبل از اذان',
      terms_link: 'شرایط استفاده',
      city_list_btn: 'فهرست شهرها',
      cities_title: 'شهرهای پرکاربرد', city_aurora: 'آرورا، کانادا', city_tehran: 'تهران، ایران',
      gps_btn: 'موقعیت فعلی من', gps_denied: 'دسترسی به موقعیت داده نشده است. آن را در تنظیمات مرورگر (کنار نشانی سایت) فعال کنید و دوباره تلاش کنید.',
      theme_dark: 'تیره', theme_light: 'روشن',
      official_mark: '(اعلام رسمی)', predicted_mark: '(پیش‌بینی)',
      ram_suhur: 'تا پایان سحر (اذان صبح): {h} ساعت و {m} دقیقه و {s} ثانیه', ram_iftar: 'تا افطار (مغرب): {h} ساعت و {m} دقیقه و {s} ثانیه', ram_remind: 'یادآوری ۱۰ دقیقه قبل از سحر و افطار', ram_remind_suhur: '۱۰ دقیقه تا پایان سحر (اذان صبح) باقی است.', ram_remind_iftar: '۱۰ دقیقه تا افطار باقی است.', ram_iftar_now: 'وقت افطار است.', ram_no_notif: 'برای یادآوری روی اعلان مرورگر، اجازهٔ اعلان را بدهید.',
      loc_text: 'برای نشان دادن اوقات شرعی درست برای محل شما، اجازه می‌دهید موقعیت فعلی‌تان خوانده شود؟ موقعیت فقط در مرورگر شما استفاده می‌شود و جایی ذخیره نمی‌شود.', loc_yes: 'اجازه می‌دهم', loc_no: 'فعلاً نه', pick_place: 'مکان را روی نقشه دابل‌کلیک کنید یا شهر را جستجو کنید.',
      annual_btn: 'تقویم سالانه', ann_title: 'ماه‌های قمری سال', ann_hijri: 'ماه قمری', ann_greg: 'شروع (میلادی)', ann_shamsi: 'شروع (شمسی)', ann_len: 'طول ماه', ann_days: 'روز',
      months_all: 'همه ماه‌ها', cal_pick_greg: 'انتخاب سال و ماه میلادی:', cal_pick_shamsi: 'انتخاب سال و ماه شمسی:',
      dir_n: 'شمال', dir_s: 'جنوب', dir_e: 'شرق', dir_w: 'غرب',
      asr: 'اذان عصر', isha: 'اذان عشا', adhan_asr: 'اذان عصر', adhan_isha: 'اذان عشا', adhan_fajr_next: 'اذان صبح فردا',
      countdown: 'تا {name}: {h} ساعت و {m} دقیقه و {s} ثانیه باقی‌مانده',
      about_btn: 'درباره ما',
      about_title: 'دربارهٔ اذان گو',
      about_p1: 'سایت اذان گو را در سال ۲۰۱۱ میلادی راه‌اندازی کردیم؛ آن روزها با نقشهٔ گوگل کار می‌کرد. اما گوگل دیگر خدمات نقشهٔ خود را در اختیار ما نگذاشت و ارائهٔ اوقات شرعی در اذان گو با مشکل روبه‌رو شد.',
      about_p2: 'امسال، در سال ۲۰۲۶، خداوند منّان بار دیگر بر ما منّت نهاد تا بتوانیم خدمتگزار شما نمازگزاران گرامی باشیم؛ این بار با طراحی تازه، امکانات امروزی، و صفحه‌ای که روی موبایل هم به‌راحتی دیده و استفاده می‌شود.',
      about_p3: 'هدف ما از اذان گو ساده است: اینکه هر نمازگزار، در هر نقطه‌ای از جهان، با یک نگاه وقت نماز محل خودش را بداند، و اذان و دعا او را به یاد ایستادن در پیشگاه پروردگارش بیندازد. برای همین اوقات شرعی را برای مکانی که روی نقشه انتخاب می‌کنید محاسبه می‌کنیم و در کنار آن، جهت قبله، صدای اذان، دعاهای روزانه و ماه رمضان، رؤیت هلال ماه و تقویم را به چهار زبان فارسی، انگلیسی، اردو و عربی در اختیارتان می‌گذاریم.',
      about_p4: 'اذان گو به هیچ سازمان، نهاد، مؤسسه یا گروهی، دولتی یا غیردولتی، در هیچ نقطه‌ای از جهان وابسته نیست.',
      about_p5: 'امیدواریم توانسته باشیم خدمتی، هرچند کوچک، به نمازگزاران کرده باشیم. بی‌گمان بدون لطف و مرحمت خداوند متعال و توجه حضرت ولی‌عصر (عج)، انجام این کار برای ما میسر نبود. در پایان، از شما نمازگزاران عزیز التماس دعا داریم؛ ما را در هنگام اذان و نماز از دعای خیرتان محروم نفرمایید، و دعا برای تعجیل در فرج مولایمان امام زمان (عج) را هرگز فراموش نکنید.',
      about_p6: 'نظرها و پیشنهادهای شما را از راه «تماس با ما» با آغوش باز می‌شنویم.',
      contact_btn: 'تماس با ما', contact_text: 'شما می‌توانید با ایمیل زیر جهت هرگونه سوال، پیشنهاد و یا انتقاد با ما در تماس باشید:', copy_btn: 'کپی ایمیل', copied: 'کپی شد', close_btn: 'بستن',
      clock_zone: 'ساعت محلی', lang_toggle: 'English',
      qibla_tag: 'قبله', logo_alt: 'اذان گو', page_title: 'اذان گو',
      pdf_title: 'اوقات شرعی', pdf_day: 'روز', pdf_greg: 'میلادی', pdf_shamsi: 'شمسی', pdf_hijri: 'قمری',
      pdf_fajr: 'فجر', pdf_sunrise: 'طلوع', pdf_dhuhr: 'ظهر', pdf_asr: 'عصر', pdf_sunset: 'غروب',
      pdf_maghrib: 'مغرب', pdf_isha: 'عشا', pdf_midnight: 'نیمه‌شب',
 dates_label: 'تاریخ و ساعت', tiles_label: 'تاریخ و ساعت'
    },
    en: {
      dua_timer_sahar: 'Ramadan Sahar dua starts at {start}, before the {adhan}.',
      dua_timer_iftar: 'Ramadan Iftar dua starts at {start}, before the {adhan}.',
      adhan_now: 'Adhan is playing…', adhan_muted: 'The adhan started silently because the browser blocks sound; tap the page once to hear it.',
      times_title: 'Prayer times today', imsak: 'Imsak', fajr: 'Fajr adhan', sunrise: 'Sunrise',
      dhuhr: 'Dhuhr adhan', sunset: 'Sunset', maghrib: 'Maghrib adhan', midnight: 'Midnight',
      fajr_next: 'Tomorrow’s Fajr',
      cal_title: 'Prayer calendar', cal_greg: 'Gregorian', cal_shamsi: 'Solar Hijri',
      cal_pick: 'Choose year and month:', cal_year: '- Year -', cal_month: '- Month -', cal_ok: 'Confirm',
      cal_pick_ym: 'Please choose a year and a month.', cal_need_place: 'First choose a place on the map.',
      cal_no_pdf: 'PDF creation is not available.', cal_busy: 'Creating PDF…', cal_done: 'PDF created.',
      cal_fail: 'Could not create the PDF.',
      search_ph: 'Search city or address…', search_btn: 'Search', searching: 'Searching…',
      not_found: 'No place found. Try a more specific city or address.',
      search_failed: 'Search failed. Check your internet connection.',
      lat: 'Latitude', lng: 'Longitude', city: 'City', calc_btn: 'Calculate times',
      map_hint: 'Double-click the map or drag the marker to change the place.',
      map_label: 'Map', calc_fail: 'Could not calculate the times for this place.',
      zone_fallback: 'Time zone of this place was not found; your device time zone is used.',
      bad_coords: 'Invalid latitude or longitude.',
      locating: 'Finding your location…',
      geo_denied: 'Your location is not available. The default place is shown.',
      moon_title: 'Moon sighting', moon_now: 'Illumination now', moon_rise: 'Moonrise',
      moon_set: 'Moonset', moon_sunset: 'Illumination at sunset',
      moon_visible: 'In this place the Hijri month {cur} has {len} days. At sunset on its last day the new crescent of {next} is {illum} illuminated and visible for {dur} minutes (sunset to moonset).',
      moon_hidden: 'In this place the Hijri month {cur} has {len} days. At sunset on its last day the new crescent of {next} ({illum} illuminated) is not visible.',
      moon_start: 'The first day of {next} in this place is {weekday}, {gd} {gm} {gy}, which is {sd} {sm} {sy} (Solar Hijri).',
      moon_follow_official: 'The start or end of {cur} was aligned with the neighbouring official month; this month is {len} days.',
      moon_odeh: 'Crescent visibility is estimated with the Odeh V-criterion; it is an estimate, not an official announcement.',
      privacy_link: 'Privacy',
      moon_official_same: 'The length of {cur} ({len} days) follows the official announcement.',
      moon_official_len: 'The length of {cur} was set to {len} days by the official announcement; the site’s astronomical prediction was {plen} days.',
      moon_official_shift: 'The start of {cur} was set by the official announcement and differs from the site’s astronomical prediction by {n} day(s).',
      moon_why_short: 'The crescent cannot be seen at sunset on day {d}, so {cur} has {len} days.',
      moon_best: 'Best time to see the new crescent of {next} in this place: sunset on {weekday}, {gd} {gm}, at {time} (about {mins} minutes after sunset), about {alt}° above the horizon, {dir}. {how}',
      moon_best_naked: 'Visible to the naked eye.',
      moon_best_aid: 'Visible with an optical aid, and possibly to the naked eye.',
      moon_best_optical: 'Visible only with an optical aid.',
      moon_best_none: 'At sunset on {weekday}, {gd} {gm}, the new crescent of {next} is not visible in this place.',
      moon_best_tip: 'You need a clear, unobstructed horizon in that direction.',
      moon_alt: 'Moon, {p}% illuminated',
      dir: '{deg}° {side} of {card}',
      qibla: 'Qibla: {deg}° from north, clockwise', qibla_label: 'Qibla direction',
      adhan_title: 'Adhan sound', r_moazen: 'Moazenzadeh Ardebili', r_abather: 'Abather Alhalwachi', r_sobhdel: 'Hossein Sobhdel', r_najafi: 'Farid Najafi', auto_label: 'Automatic adhan and dua playback',
      auto_hint: 'For automatic playback, keep this page open and click it once.',
      playing: 'Playing {name}', time_for: 'It is time for {name}. Press play.',
      adhan_fajr: 'Fajr adhan', adhan_dhuhr: 'Dhuhr adhan', adhan_maghrib: 'Maghrib adhan',
      save_btn: 'Save defaults', save_q: 'Your current settings (map location, adhan voice, automatic adhan and dua playback, language, and dark/light theme) will be saved in this browser as your defaults and loaded automatically next time. Your previously saved defaults will be replaced. Save them?',
      yes: 'Yes', no: 'No', saved: 'Defaults saved.',
      save_fail: 'Could not save. Browser storage is not available.', no_change: 'Nothing was saved.',
      donate_title: 'Click here to support the costs of this website', donate: 'Donation',
      copyright: '© 2026 azangoo.com · All rights reserved',
      dua_off_auto: 'Automatic adhan playback is off', dua_off: 'Daily dua playback is off', dua_nolist: 'The dua list could not be read', dua_nomonth: 'This Hijri month has no daily dua', dua_passed: 'Today’s dua has passed',
      dua_timer: 'Dua of the day ({day}) starts at {start}, before the {adhan}.', dua_loading: 'Daily dua: loading…',
      dua_opt: 'Automatic daily dua before the adhan',
      terms_link: 'Terms and conditions',
      city_list_btn: 'Browse cities',
      cities_title: 'Popular cities', city_aurora: 'Aurora, Canada', city_tehran: 'Tehran, Iran',
      gps_btn: 'Use my current location', gps_denied: 'Location access is blocked. Allow it in your browser settings (next to the site address) and try again.',
      theme_dark: 'Dark', theme_light: 'Light',
      official_mark: '(official)', predicted_mark: '(predicted)',
      ram_suhur: 'Until end of suhur (Fajr): {h} h {m} min {s} s', ram_iftar: 'Until iftar (maghrib): {h} h {m} min {s} s', ram_remind: 'Remind me 10 minutes before suhur and iftar', ram_remind_suhur: '10 minutes left until the end of suhur (Fajr).', ram_remind_iftar: '10 minutes left until iftar.', ram_iftar_now: 'It is time for iftar.', ram_no_notif: 'Allow browser notifications to get reminders.',
      loc_text: 'To show the prayer times for your place, may we read your current location? It is used only in your browser and is not stored anywhere.', loc_yes: 'Allow', loc_no: 'Not now', pick_place: 'Double-click the map or search for a city to choose a place.',
      annual_btn: 'Annual calendar', ann_title: 'Hijri months of the year', ann_hijri: 'Hijri month', ann_greg: 'Start (Gregorian)', ann_shamsi: 'Start (Solar Hijri)', ann_len: 'Length', ann_days: 'days',
      months_all: 'All months', cal_pick_greg: 'Choose year and month (Gregorian):', cal_pick_shamsi: 'Choose year and month (Solar Hijri):',
      dir_n: 'N', dir_s: 'S', dir_e: 'E', dir_w: 'W',
      asr: 'Asr adhan', isha: 'Isha adhan', adhan_asr: 'Asr adhan', adhan_isha: 'Isha adhan', adhan_fajr_next: 'Tomorrow’s Fajr',
      countdown: 'Time until {name}: {h} h {m} min {s} s',
      about_btn: 'About us',
      about_title: 'About Azangoo',
      about_p1: 'We launched Azangoo in 2011, back when it ran on Google Maps. When Google stopped providing us with its map service, offering prayer times on Azangoo became difficult.',
      about_p2: 'This year, in 2026, by God’s grace we were given the chance once again to serve you, dear worshippers, this time with a fresh design, modern features, and a page that works comfortably on your phone.',
      about_p3: 'Our purpose is simple: that every worshipper, anywhere in the world, can see the prayer times for their own place at a glance, and that the adhan and supplications gently remind them of standing before their Lord. So we calculate the prayer times for the place you choose on the map, and alongside them we offer the qibla direction, the sound of the adhan, the daily and Ramadan supplications, the crescent moon sighting and a calendar, in Persian, English, Urdu and Arabic.',
      about_p4: 'Azangoo is not affiliated with any organization, institution, party or group, governmental or non-governmental, anywhere in the world.',
      about_p5: 'We hope we have been able to render some service, however small, to those who pray. Without the grace and mercy of God Almighty and the care of the Master of the Age, Imam al-Mahdi (may God hasten his relief), this work would not have been possible for us. Finally, we humbly ask for your prayers: please do not deprive us of them at the time of adhan and prayer, and never forget to pray for the hastening of the relief of our master, the Imam of the Age.',
      about_p6: 'Your comments and suggestions are always welcome through “Contact us”.',
      contact_btn: 'Contact us', contact_text: 'For any question, suggestion or feedback you can contact us by email:', copy_btn: 'Copy email', copied: 'Copied', close_btn: 'Close',
      clock_zone: 'Local time', lang_toggle: 'اردو',
      qibla_tag: 'Qibla', logo_alt: 'Azangoo', page_title: 'Azangoo prayer times',
      pdf_title: 'Prayer times', pdf_day: 'Day', pdf_greg: 'Gregorian', pdf_shamsi: 'Solar Hijri', pdf_hijri: 'Hijri',
      pdf_fajr: 'Fajr', pdf_sunrise: 'Sunrise', pdf_dhuhr: 'Dhuhr', pdf_asr: 'Asr', pdf_sunset: 'Sunset',
      pdf_maghrib: 'Maghrib', pdf_isha: 'Isha', pdf_midnight: 'Midnight',
 dates_label: 'Date and time', tiles_label: 'Date and time'
    },
    ur: {
      dua_timer_sahar: 'رمضان کی سحری کی دعا {start} پر {adhan} سے پہلے شروع ہوگی۔',
      dua_timer_iftar: 'رمضان کی افطار کی دعا {start} پر {adhan} سے پہلے شروع ہوگی۔',
      adhan_now: 'اذان چل رہی ہے…', adhan_muted: 'براؤزر آواز روک رہا ہے، اس لیے اذان بغیر آواز شروع ہوئی؛ آواز سننے کے لیے صفحے پر ایک بار ٹیپ کریں۔',
      times_title: 'آج کے اوقات نماز', imsak: 'امساک', fajr: 'فجر کی اذان', sunrise: 'طلوع آفتاب',
      dhuhr: 'ظہر کی اذان', sunset: 'غروب آفتاب', maghrib: 'مغرب کی اذان', midnight: 'نصف شب',
      fajr_next: 'کل کی فجر کی اذان',
      cal_title: 'اوقات نماز کا کیلنڈر', cal_greg: 'عیسوی', cal_shamsi: 'شمسی',
      cal_pick: 'سال اور مہینہ منتخب کریں:', cal_year: '- سال -', cal_month: '- مہینہ -', cal_ok: 'تصدیق',
      cal_pick_ym: 'براہ کرم سال اور مہینہ منتخب کریں۔', cal_need_place: 'پہلے نقشے پر جگہ منتخب کریں۔',
      cal_no_pdf: 'PDF بنانے کی سہولت دستیاب نہیں ہے۔', cal_busy: 'PDF بنایا جا رہا ہے…', cal_done: 'PDF بن گئی۔',
      cal_fail: 'PDF نہیں بن سکی۔',
      search_ph: 'شہر یا پتہ تلاش کریں…', search_btn: 'تلاش', searching: 'تلاش ہو رہی ہے…',
      not_found: 'کوئی جگہ نہیں ملی۔ شہر کا نام یا پتہ زیادہ واضح لکھیں۔',
      search_failed: 'تلاش ناکام رہی۔ انٹرنیٹ کنکشن چیک کریں۔',
      lat: 'عرض بلد', lng: 'طول بلد', city: 'شہر', calc_btn: 'اوقات معلوم کریں',
      map_hint: 'جگہ بدلنے کے لیے نقشے پر ڈبل کلک کریں یا نشان کو کھینچیں۔',
      map_label: 'نقشہ', calc_fail: 'اس جگہ کے اوقات نہیں نکالے جا سکے۔',
      zone_fallback: 'اس جگہ کا ٹائم زون نہیں ملا؛ آپ کے آلے کا وقت استعمال ہوا۔',
      bad_coords: 'عرض بلد یا طول بلد درست نہیں ہے۔', locating: 'آپ کا مقام تلاش ہو رہا ہے…',
      geo_denied: 'موجودہ مقام دستیاب نہیں۔ پہلے سے طے شدہ جگہ دکھائی جا رہی ہے۔',
      moon_title: 'چاند کا مشاہدہ', moon_now: 'ابھی روشنی کا فیصد', moon_rise: 'چاند کا طلوع',
      moon_set: 'چاند کا غروب', moon_sunset: 'غروب کے وقت روشنی کا فیصد',
      moon_visible: 'اس جگہ ہجری مہینہ {cur} {len} دن کا ہے۔ اس کے آخری دن غروب آفتاب پر {next} کا نیا ہلال {illum} روشن ہے اور {dur} منٹ (غروب آفتاب سے چاند کے غروب تک) نظر آتا ہے۔',
      moon_hidden: 'اس جگہ ہجری مہینہ {cur} {len} دن کا ہے۔ اس کے آخری دن غروب آفتاب پر {next} کا نیا ہلال ({illum} روشن) نظر نہیں آتا۔',
      moon_start: '{next} کا پہلا دن اس جگہ {weekday}، {gd} {gm} {gy} ہے، جو شمسی تاریخ {sd} {sm} {sy} ہے۔',
      moon_follow_official: '{cur} کا آغاز یا اختتام ساتھ والے سرکاری مہینے کے اعلان سے ہم آہنگ کیا گیا ہے؛ اس مہینے کے {len} دن ہیں۔',
      moon_odeh: 'ہلال کی رؤیت کا اندازہ معیارِ عودہ (Odeh V-criterion) سے لگایا جاتا ہے؛ یہ اندازہ ہے، سرکاری اعلان نہیں۔',
      privacy_link: 'رازداری',
      moon_official_same: '{cur} کی لمبائی ({len} دن) سرکاری اعلان کے مطابق ہے۔',
      moon_official_len: '{cur} کی لمبائی سرکاری اعلان کے مطابق {len} دن مقرر ہوئی، جبکہ سائٹ کے فلکیاتی حساب میں یہ {plen} دن تھی۔',
      moon_official_shift: '{cur} کا آغاز سرکاری اعلان کے مطابق مقرر ہوا اور سائٹ کے فلکیاتی حساب سے {n} دن مختلف ہے۔',
      moon_why_short: 'دن {d} کے غروب آفتاب پر ہلال نظر نہیں آتا، اس لیے {cur} کے {len} دن ہیں۔',
      moon_best: '{next} کا ہلال دیکھنے کا بہترین وقت اس جگہ: {weekday} {gd} {gm} کی شام، وقت {time} (غروب آفتاب سے تقریباً {mins} منٹ بعد)، افق سے تقریباً {alt} درجہ اوپر، {dir}۔ {how}',
      moon_best_naked: 'ننگی آنکھ سے نظر آتا ہے۔',
      moon_best_aid: 'دوربین سے نظر آتا ہے اور ممکن ہے ننگی آنکھ سے بھی نظر آ جائے۔',
      moon_best_optical: 'صرف دوربین سے نظر آتا ہے۔',
      moon_best_none: '{weekday} {gd} {gm} کے غروب آفتاب پر {next} کا ہلال اس جگہ نظر نہیں آتا۔',
      moon_best_tip: 'ہلال دیکھنے کے لیے اس سمت میں افق کھلا اور رکاوٹ سے پاک ہونا چاہیے۔',
      moon_alt: 'چاند، {p} فیصد روشن',
      dir: 'جہت {card}، {deg} درجہ {side} کی طرف',
      qibla: 'قبلہ: شمال سے {deg}° گھڑی کی سمت', qibla_label: 'قبلہ کی سمت',
      adhan_title: 'اذان کی آواز', r_moazen: 'موذن زادہ اردبیلی', r_abather: 'اباذر الحلواجی', r_sobhdel: 'حسین صبحدل', r_najafi: 'فرید نجفی', auto_label: 'خودکار اذان اور دعا چلائیں',
      auto_hint: 'خودکار پلے کے لیے یہ صفحہ کھلا رہنا چاہیے اور ایک بار اس پر کلک ہونا چاہیے۔',
      playing: '{name} چل رہی ہے', time_for: '{name} کا وقت ہو گیا ہے۔ چلانے کے لیے پلے دبائیں۔',
      adhan_fajr: 'فجر کی اذان', adhan_dhuhr: 'ظہر کی اذان', adhan_maghrib: 'مغرب کی اذان',
      save_btn: 'پیش فرض محفوظ کریں', save_q: 'آپ کی موجودہ ترتیبات (نقشے پر مقام، اذان کی آواز، خودکار اذان اور دعا، زبان اور گہرا/روشن تھیم) اسی براؤزر میں پیش فرض کے طور پر محفوظ ہوں گی اور اگلی بار خودبخود لوڈ ہوں گی۔ پہلے سے محفوظ پیش فرض بدل جائیں گے۔ کیا محفوظ کریں؟',
      yes: 'ہاں', no: 'نہیں', saved: 'پیش فرض محفوظ ہو گئے۔',
      save_fail: 'محفوظ نہیں ہو سکا۔ براؤزر اسٹوریج دستیاب نہیں۔', no_change: 'کچھ محفوظ نہیں کیا گیا۔',
      donate_title: 'اس ویب سائٹ کے اخراجات میں مدد کے لیے یہاں کلک کریں', donate: 'عطیہ',
      copyright: '© 2026 azangoo.com · All rights reserved',
      dua_off_auto: 'خودکار اذان بند ہے', dua_off: 'روزانہ دعا بند ہے', dua_nolist: 'دعاؤں کی فہرست نہیں پڑھی جا سکی', dua_nomonth: 'اس ہجری مہینے میں روزانہ دعا نہیں ہے', dua_passed: 'آج کی دعا گزر چکی ہے',
      dua_timer: 'دن کی دعا ({day}) {start} پر {adhan} سے پہلے شروع ہوگی۔', dua_loading: 'روزانہ دعا: لوڈ ہو رہی ہے…',
      dua_opt: 'اذان سے پہلے روزانہ دعا خودکار چلائیں',
      terms_link: 'شرائط استعمال',
      city_list_btn: 'شہروں کی فہرست',
      cities_title: 'مقبول شہر', city_aurora: 'اورورا، کینیڈا', city_tehran: 'تہران، ایران',
      gps_btn: 'میرا موجودہ مقام', gps_denied: 'مقام تک رسائی بند ہے۔ براؤزر کی ترتیبات میں اجازت دیں (ویب سائٹ کے پتے کے ساتھ) اور دوبارہ کوشش کریں۔',
      theme_dark: 'گہرا', theme_light: 'روشن',
      official_mark: '(سرکاری اعلان)', predicted_mark: '(پیش گوئی)',
      ram_suhur: 'سحری کے اختتام (فجر) تک: {h} گھنٹے {m} منٹ {s} سیکنڈ', ram_iftar: 'افطار تک: {h} گھنٹے {m} منٹ {s} سیکنڈ', ram_remind: 'سحری اور افطار سے ۱۰ منٹ پہلے یاد دلائیں', ram_remind_suhur: 'سحری کے اختتام میں ۱۰ منٹ باقی ہیں۔', ram_remind_iftar: 'افطار میں ۱۰ منٹ باقی ہیں۔', ram_iftar_now: 'افطار کا وقت ہو گیا ہے۔', ram_no_notif: 'یاد دہانی کے لیے براؤزر کی اطلاعات کی اجازت دیں۔',
      loc_text: 'آپ کی جگہ کے مطابق اوقات نماز دکھانے کے لیے کیا ہم آپ کا موجودہ مقام پڑھ سکتے ہیں؟ یہ صرف آپ کے براؤزر میں استعمال ہوتا ہے اور کہیں محفوظ نہیں ہوتا۔', loc_yes: 'اجازت دیں', loc_no: 'ابھی نہیں', pick_place: 'نقشے پر ڈبل کلک کریں یا شہر تلاش کریں۔',
      annual_btn: 'سالانہ کیلنڈر', ann_title: 'اس سال کے ہجری مہینے', ann_hijri: 'ہجری مہینہ', ann_greg: 'آغاز (عیسوی)', ann_shamsi: 'آغاز (شمسی)', ann_len: 'مہینے کی لمبائی', ann_days: 'دن',
      months_all: 'تمام مہینے', cal_pick_greg: 'سال اور مہینہ منتخب کریں (عیسوی):', cal_pick_shamsi: 'سال اور مہینہ منتخب کریں (شمسی):',
      dir_n: 'شمال', dir_s: 'جنوب', dir_e: 'مشرق', dir_w: 'مغرب',
      asr: 'عصر کی اذان', isha: 'عشا کی اذان', adhan_asr: 'عصر کی اذان', adhan_isha: 'عشا کی اذان', adhan_fajr_next: 'کل کی فجر کی اذان',
      countdown: '{name} تک: {h} گھنٹے {m} منٹ {s} سیکنڈ باقی',
      about_btn: 'ہمارے بارے میں',
      about_title: 'اذان گو کے بارے میں',
      about_p1: 'ہم نے اذان گو کا آغاز ۲۰۱۱ء میں کیا تھا؛ اُس وقت یہ گوگل میپ پر چلتا تھا۔ جب گوگل نے ہمیں اپنی نقشہ سروس دینا بند کر دی تو اذان گو پر اوقاتِ نماز پیش کرنا مشکل ہو گیا۔',
      about_p2: 'اس سال، ۲۰۲۶ء میں، اللہ تعالیٰ نے اپنے فضل و کرم سے ہمیں ایک بار پھر موقع عطا فرمایا کہ ہم آپ محترم نمازیوں کی خدمت کر سکیں؛ اس بار نئے ڈیزائن، جدید سہولتوں اور ایسے صفحے کے ساتھ جو موبائل پر بھی آسانی سے کھلتا اور چلتا ہے۔',
      about_p3: 'اذان گو کا مقصد سادہ ہے: دنیا کے کسی بھی کونے میں رہنے والا نمازی ایک ہی نظر میں اپنے مقام کے اوقاتِ نماز دیکھ سکے، اور اذان اور دعائیں اسے اپنے رب کے حضور کھڑے ہونے کی یاد دلائیں۔ اسی لیے ہم نقشے پر آپ کے منتخب کردہ مقام کے اوقاتِ نماز نکالتے ہیں، اور ساتھ ہی قبلے کی سمت، اذان کی آواز، روزانہ اور رمضان کی دعائیں، ہلال کا مشاہدہ اور کیلنڈر فارسی، انگریزی، اردو اور عربی میں فراہم کرتے ہیں۔',
      about_p4: 'اذان گو کا دنیا میں کہیں بھی کسی سرکاری یا غیر سرکاری تنظیم، ادارے، جماعت یا گروہ سے کوئی تعلق نہیں ہے۔',
      about_p5: 'ہمیں امید ہے کہ ہم نمازیوں کی کوئی چھوٹی سی خدمت انجام دے سکے ہیں۔ بلاشبہ اللہ تعالیٰ کے لطف و کرم اور حضرت ولیِ عصر (عج) کی توجہ کے بغیر ہمارے لیے یہ کام ممکن نہ تھا۔ آخر میں آپ نمازیوں سے دعا کی درخواست ہے؛ اذان اور نماز کے وقت ہمیں اپنی دعاؤں سے محروم نہ رکھیں، اور ہمارے مولا امامِ زمانہ (عج) کے ظہور میں تعجیل کی دعا کو ہرگز نہ بھولیں۔',
      about_p6: '«ہم سے رابطہ کریں» کے ذریعے آپ کی رائے اور تجاویز ہمارے لیے باعثِ مسرت ہوں گی۔',
      contact_btn: 'ہم سے رابطہ کریں', contact_text: 'کسی بھی سوال، تجویز یا تنقید کے لیے آپ اس ای میل پر ہم سے رابطہ کر سکتے ہیں:', copy_btn: 'ای میل کاپی کریں', copied: 'کاپی ہو گیا', close_btn: 'بند کریں',
      clock_zone: 'مقامی وقت', lang_toggle: 'فارسی',
      qibla_tag: 'قبلہ', logo_alt: 'اذان گو', page_title: 'اذان گو',
      dates_label: 'تاریخ اور وقت', tiles_label: 'تاریخ اور وقت',
      pdf_title: 'اوقات نماز', pdf_day: 'دن', pdf_greg: 'عیسوی', pdf_shamsi: 'شمسی', pdf_hijri: 'ہجری',
      pdf_fajr: 'فجر', pdf_sunrise: 'طلوع', pdf_dhuhr: 'ظہر', pdf_asr: 'عصر', pdf_sunset: 'غروب',
      pdf_maghrib: 'مغرب', pdf_isha: 'عشا', pdf_midnight: 'نصف شب'
    },
    ar: {
      dua_timer_sahar: 'يبدأ دعاء سحور شهر رمضان في {start} قبل {adhan}.',
      dua_timer_iftar: 'يبدأ دعاء إفطار شهر رمضان في {start} قبل {adhan}.',
      adhan_now: 'جارٍ تشغيل الأذان…', adhan_muted: 'بدأ الأذان بدون صوت لأن المتصفح يمنع الصوت؛ انقر على الصفحة مرة واحدة لسماعه.',
      times_title: 'أوقات الصلاة اليوم',
      imsak: 'الإمساك',
      fajr: 'أذان الفجر',
      sunrise: 'شروق الشمس',
      dhuhr: 'أذان الظهر',
      sunset: 'غروب الشمس',
      maghrib: 'أذان المغرب',
      midnight: 'منتصف الليل',
      fajr_next: 'فجر الغد',
      cal_title: 'تقويم أوقات الصلاة',
      cal_greg: 'ميلادي',
      cal_shamsi: 'شمسي',
      cal_pick: 'اختر السنة والشهر:',
      cal_year: '- السنة -',
      cal_month: '- الشهر -',
      cal_ok: 'تأكيد',
      cal_pick_ym: 'يرجى اختيار السنة والشهر.',
      cal_need_place: 'اختر المكان أولاً على الخريطة.',
      cal_no_pdf: 'إنشاء ملف PDF غير متاح.',
      cal_busy: 'جارٍ إنشاء ملف PDF…',
      cal_done: 'تم إنشاء ملف PDF.',
      cal_fail: 'تعذّر إنشاء ملف PDF.',
      search_ph: 'ابحث عن مدينة أو عنوان…',
      search_btn: 'بحث',
      searching: 'جارٍ البحث…',
      not_found: 'لم يتم العثور على مكان. اكتب اسم المدينة أو العنوان بشكل أدق.',
      search_failed: 'فشل البحث. تحقق من اتصال الإنترنت.',
      lat: 'خط العرض',
      lng: 'خط الطول',
      city: 'المدينة',
      calc_btn: 'احسب الأوقات',
      map_hint: 'انقر نقرًا مزدوجًا على الخريطة أو اسحب المؤشر لتغيير المكان.',
      map_label: 'الخريطة',
      calc_fail: 'تعذّر حساب الأوقات لهذا المكان.',
      zone_fallback: 'لم يُعثر على المنطقة الزمنية لهذا المكان؛ استُخدم توقيت جهازك.',
      bad_coords: 'خط العرض أو الطول غير صالح.',
      locating: 'جارٍ تحديد موقعك…',
      geo_denied: 'موقعك الحالي غير متاح. يُعرض المكان الافتراضي.',
      moon_title: 'رؤية الهلال',
      moon_now: 'نسبة الإضاءة الآن',
      moon_rise: 'طلوع القمر',
      moon_set: 'غروب القمر',
      moon_sunset: 'نسبة الإضاءة عند الغروب',
      moon_visible: 'في هذا المكان يبلغ الشهر الهجري {cur} {len} يومًا. عند غروب الشمس في آخر يوم يُرى هلال {next} بنسبة إضاءة {illum} لمدة {dur} دقيقة (من غروب الشمس إلى غروب القمر).',
      moon_hidden: 'في هذا المكان يبلغ الشهر الهجري {cur} {len} يومًا. عند غروب الشمس في آخر يوم لا يُرى هلال {next} (نسبة إضاءته {illum}).',
      moon_start: 'أول أيام {next} في هذا المكان هو {weekday}، {gd} {gm} {gy}، الموافق {sd} {sm} {sy} (التقويم الشمسي الهجري).',
      moon_follow_official: 'نُسِّق بدء شهر {cur} أو نهايته مع الشهر الرسمي المجاور له؛ ويبلغ طوله {len} يومًا.',
      moon_odeh: 'تُقدَّر رؤية الهلال بمعيار عودة (Odeh V-criterion)؛ وهو تقدير وليس إعلانًا رسميًا.',
      privacy_link: 'الخصوصية',
      moon_official_same: 'طول شهر {cur} ({len} يومًا) وفق الإعلان الرسمي.',
      moon_official_len: 'حُدد طول شهر {cur} بـ {len} يومًا وفق الإعلان الرسمي، بينما كان الحساب الفلكي للموقع يتوقع {plen} يومًا.',
      moon_official_shift: 'حُدد بدء شهر {cur} وفق الإعلان الرسمي ويختلف عن الحساب الفلكي للموقع بمقدار {n} يوم.',
      moon_why_short: 'لا يُرى الهلال عند غروب الشمس في اليوم {d}، لذا يكون شهر {cur} {len} يومًا.',
      moon_best: 'أفضل وقت لرؤية هلال {next} في هذا المكان: مساء {weekday} {gd} {gm}، الساعة {time} (بعد غروب الشمس بحوالي {mins} دقيقة)، على ارتفاع نحو {alt}° فوق الأفق، {dir}. {how}',
      moon_best_naked: 'يُرى بالعين المجردة.',
      moon_best_aid: 'يُرى بالمنظار، وقد يُرى بالعين المجردة.',
      moon_best_optical: 'يُرى بالمنظار فقط.',
      moon_best_none: 'عند غروب الشمس مساء {weekday} {gd} {gm} لا يُرى هلال {next} في هذا المكان.',
      moon_best_tip: 'يلزم أن يكون الأفق في ذلك الاتجاه مفتوحًا وخاليًا من العوائق.',
      moon_alt: 'القمر، مضاء بنسبة {p}%',
      dir: '{deg}° {side} من {card}',
      qibla: 'القبلة: {deg}° من الشمال باتجاه عقارب الساعة',
      qibla_label: 'اتجاه القبلة',
      adhan_title: 'صوت الأذان',
      r_moazen: 'موذن‌زاده أردبيلي',
      r_abather: 'أباذر الحلواجي',
      r_sobhdel: 'حسين صبحدل',
      r_najafi: 'فريد نجفي',
      auto_label: 'تشغيل الأذان والدعاء تلقائيًا',
      auto_hint: 'للتشغيل التلقائي يجب أن تبقى هذه الصفحة مفتوحة وأن تنقر عليها مرة واحدة.',
      playing: 'جارٍ تشغيل {name}',
      time_for: 'حان وقت {name}. اضغط على التشغيل.',
      adhan_fajr: 'أذان الفجر',
      adhan_dhuhr: 'أذان الظهر',
      adhan_maghrib: 'أذان المغرب',
      save_btn: 'حفظ الإعدادات الافتراضية',
      save_q: 'سيتم حفظ إعداداتك الحالية (المكان على الخريطة، صوت الأذان، التشغيل التلقائي للأذان والدعاء، اللغة، والمظهر الداكن/الفاتح) كإعدادات افتراضية في هذا المتصفح وتحميلها تلقائيًا في المرة القادمة. ستحل محل إعداداتك الافتراضية المحفوظة سابقًا. هل تريد الحفظ؟',
      yes: 'نعم',
      no: 'لا',
      saved: 'تم حفظ الإعدادات الافتراضية.',
      save_fail: 'تعذّر الحفظ. مساحة تخزين المتصفح غير متاحة.',
      no_change: 'لم يُحفظ أي شيء.',
      donate_title: 'انقر هنا للمساهمة في تكاليف هذا الموقع',
      donate: 'تبرع',
      copyright: '© 2026 azangoo.com · All rights reserved',
      dua_off_auto: 'التشغيل التلقائي للأذان متوقف', dua_off: 'تشغيل الدعاء اليومي متوقف', dua_nolist: 'تعذّر قراءة قائمة الأدعية', dua_nomonth: 'لا يوجد دعاء يومي في هذا الشهر الهجري', dua_passed: 'انتهى وقت دعاء اليوم',
      dua_timer: 'يبدأ دعاء اليوم ({day}) في {start} قبل {adhan}.', dua_loading: 'الدعاء اليومي: جارٍ التحميل…',
      dua_opt: 'تشغيل الدعاء اليومي تلقائيًا قبل الأذان',
      terms_link: 'شروط الاستخدام',
      city_list_btn: 'تصفح المدن',
      cities_title: 'مدن شائعة', city_aurora: 'أورورا، كندا', city_tehran: 'طهران، إيران',
      gps_btn: 'استخدام موقعي الحالي', gps_denied: 'الوصول إلى الموقع محظور. اسمح به من إعدادات المتصفح (بجانب عنوان الموقع) وحاول مرة أخرى.',
      theme_dark: 'داكن', theme_light: 'فاتح',
      official_mark: '(إعلان رسمي)', predicted_mark: '(توقع)',
      ram_suhur: 'حتى نهاية السحور (الفجر): {h} ساعة و{m} دقيقة و{s} ثانية', ram_iftar: 'حتى الإفطار (المغرب): {h} ساعة و{m} دقيقة و{s} ثانية', ram_remind: 'ذكّرني قبل السحور والإفطار بعشر دقائق', ram_remind_suhur: 'بقي عشر دقائق على انتهاء السحور (الفجر).', ram_remind_iftar: 'بقي عشر دقائق على الإفطار.', ram_iftar_now: 'حان وقت الإفطار.', ram_no_notif: 'اسمح بإشعارات المتصفح لتصلك التذكيرات.',
      loc_text: 'لعرض أوقات الصلاة الصحيحة لمكانك، هل نسمح بقراءة موقعك الحالي؟ يُستخدم الموقع في متصفحك فقط ولا يُحفظ في أي مكان.', loc_yes: 'أسمح', loc_no: 'ليس الآن', pick_place: 'انقر نقرًا مزدوجًا على الخريطة أو ابحث عن مدينة لاختيار المكان.',
      annual_btn: 'التقويم السنوي', ann_title: 'أشهر السنة الهجرية', ann_hijri: 'الشهر الهجري', ann_greg: 'البداية (ميلادي)', ann_shamsi: 'البداية (شمسي)', ann_len: 'طول الشهر', ann_days: 'يوم',
      months_all: 'كل الشهور', cal_pick_greg: 'اختر السنة والشهر (ميلادي):', cal_pick_shamsi: 'اختر السنة والشهر (شمسي):',
      dir_n: 'شمال',
      dir_s: 'جنوب',
      dir_e: 'شرق',
      dir_w: 'غرب',
      countdown: 'حتى {name}: {h} ساعة و{m} دقيقة و{s} ثانية متبقية',
      about_btn: 'من نحن',
      about_title: 'عن أذان گو',
      about_p1: 'أطلقنا موقع «أذان گو» عام ٢٠١١م، وكان يعمل آنذاك على خرائط غوغل. ثم أوقفت غوغل خدمة الخرائط عنّا، فأصبح تقديم أوقات الصلاة في «أذان گو» أمرًا صعبًا.',
      about_p2: 'وفي هذا العام ٢٠٢٦م، منّ الله المنّان علينا مرة أخرى بأن نكون في خدمتكم أيها المصلّون الكرام، وهذه المرة بتصميم جديد وإمكانات عصرية وصفحة يسهل عرضها واستخدامها على الهاتف المحمول.',
      about_p3: 'هدفنا من «أذان گو» بسيط: أن يتمكن كل مصلٍّ، في أي مكان من العالم، من معرفة أوقات الصلاة في مكانه بنظرة واحدة، وأن يذكّره الأذان والدعاء بالوقوف بين يدي ربّه. ولهذا نحسب أوقات الصلاة للمكان الذي تختاره على الخريطة، ونوفّر إلى جانبها اتجاه القبلة وصوت الأذان وأدعية اليوم وأدعية شهر رمضان ورؤية الهلال والتقويم، بأربع لغات: الفارسية والإنجليزية والأردية والعربية.',
      about_p4: '«أذان گو» غير تابع لأي جهة أو مؤسسة أو منظمة أو جماعة، حكومية كانت أو غير حكومية، في أي مكان من العالم.',
      about_p5: 'نأمل أن نكون قد قدّمنا خدمة، ولو يسيرة، للمصلّين. ولا شك أنه لولا لطف الله تعالى ورحمته وعناية الحجة المهدي (عجّل الله فرجه الشريف) لما تيسّر لنا هذا العمل. وفي الختام نلتمس منكم أيها المصلّون الأعزاء الدعاء؛ فلا تحرمونا من دعائكم عند الأذان والصلاة، ولا تنسوا الدعاء بتعجيل فرج مولانا إمام الزمان (عجّل الله فرجه الشريف).',
      about_p6: 'يسعدنا أن نسمع آراءكم واقتراحاتكم عبر «اتصل بنا».',
      contact_btn: 'اتصل بنا',
      contact_text: 'لأي سؤال أو اقتراح أو ملاحظة يمكنك التواصل معنا عبر البريد الإلكتروني:',
      copy_btn: 'نسخ البريد',
      copied: 'تم النسخ',
      close_btn: 'إغلاق',
      clock_zone: 'التوقيت المحلي',
      lang_toggle: 'English',
      qibla_tag: 'القبلة',
      logo_alt: 'اذان گو',
      page_title: 'أذان گو - أوقات الصلاة',
      pdf_title: 'أوقات الصلاة',
      pdf_day: 'اليوم',
      pdf_greg: 'ميلادي',
      pdf_shamsi: 'شمسي',
      pdf_hijri: 'هجري',
      pdf_fajr: 'الفجر',
      pdf_sunrise: 'الشروق',
      pdf_dhuhr: 'الظهر',
      pdf_asr: 'العصر',
      pdf_sunset: 'الغروب',
      pdf_maghrib: 'المغرب',
      pdf_isha: 'العشاء',
      pdf_midnight: 'منتصف الليل',
      dates_label: 'التاريخ والوقت',
      tiles_label: 'التاريخ والوقت',
      asr: 'أذان العصر',
      isha: 'أذان العشاء',
      adhan_asr: 'أذان العصر',
      adhan_isha: 'أذان العشاء',
      adhan_fajr_next: 'فجر الغد'
    }
  };

  var NAMES = {
    fa: {
      weekdays: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
      greg: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
      shamsi: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
      hijri: ['محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعده', 'ذی‌الحجه'],
      card: { N: 'شمال', E: 'شرق', S: 'جنوب', W: 'غرب' },
      side: { N: 'شمال', E: 'شرق', S: 'جنوب', W: 'غرب' }
    },
    en: {
      weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      greg: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      shamsi: ['Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar', 'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'],
      hijri: ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha’ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi’dah', 'Dhu al-Hijjah'],
      card: { N: 'north', E: 'east', S: 'south', W: 'west' },
      side: { N: 'north', E: 'east', S: 'south', W: 'west' }
    },
    ur: {
      weekdays: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
      greg: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
      shamsi: ['فروردین', 'اردی بہشت', 'خرداد', 'تیر', 'مرداد', 'شہریور', 'مہر', 'آبان', 'آذر', 'دی', 'بہمن', 'اسفند'],
      hijri: ['محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ'],
      card: { N: 'شمال', E: 'مشرق', S: 'جنوب', W: 'مغرب' },
      side: { N: 'شمال', E: 'مشرق', S: 'جنوب', W: 'مغرب' }
    },
    ar: {
      weekdays: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      greg: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      shamsi: ['فروردين', 'أرديبهشت', 'خرداد', 'تير', 'مرداد', 'شهريور', 'مهر', 'آبان', 'آذر', 'دي', 'بهمن', 'إسفند'],
      hijri: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'],
      card: { N: 'شمال', E: 'شرق', S: 'جنوب', W: 'غرب' },
      side: { N: 'شمال', E: 'شرق', S: 'جنوب', W: 'غرب' }
    }
  };

  var FA = '۰۱۲۳۴۵۶۷۸۹';
  var AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';

  /* read the saved language once D and LANGS exist */
  try {
    var saved = JSON.parse(localStorage.getItem('azangoo-defaults'));
    if (saved && saved.lang && D[saved.lang]) lang = saved.lang;
  } catch (e) { lang = 'fa'; }

  function t(key, vars) {
    var s = (D[lang] && D[lang][key]) || D.fa[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  /* numbers: Persian digits in Persian, plain digits in English */
  function num(x) {
    var s = String(x), dg = info(lang).digits;
    if (dg === 'latin') return s;
    var set = dg === 'arabic' ? AR_DIGITS : FA;
    return s.replace(/\d/g, function (d) { return set[+d]; }).replace(/\./g, '٫');
  }
  /* Persian and Arabic-Indic digits, Persian decimal sign and comma -> plain numbers for parsing */
  function toAscii(s) {
    return String(s).replace(/[۰-۹٠-٩]/g, function (d) {
      var i = FA.indexOf(d); return String(i >= 0 ? i : AR_DIGITS.indexOf(d));
    })
      .replace(/٫/g, '.').replace(/٬|،/g, ',').replace(/[−–]/g, '-').trim();
  }
  function names(kind) { return NAMES[lang][kind]; }
  function percent(x) { return num(x) + (info(lang).digits === 'latin' ? '%' : '٪'); }
  function isRtl() { return info(lang).rtl; }

  function apply() {
    if (typeof document === 'undefined') return;
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isRtl() ? 'rtl' : 'ltr');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      /* "attribute:key" - several pairs can be separated by ";" (for example "title:gps_btn;aria-label:gps_btn") */
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length > 1) el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
    });
    /* city links: only the current language, with the city and country in that language */
    document.querySelectorAll('a.city-link').forEach(function (a) {
      a.setAttribute('href', lang + '/prayer-times/' + a.getAttribute('data-country') + '/' + a.getAttribute('data-slug') + '/index.html');
      a.setAttribute('lang', lang);
      a.textContent = a.getAttribute('data-' + lang) || a.getAttribute('data-fa');
    });
    var termsLink = document.querySelector('a.terms-link');
    if (termsLink) termsLink.setAttribute('href', lang + '/terms/index.html');
    var privLink = document.querySelector('a.privacy-link');
    if (privLink) privLink.setAttribute('href', lang + '/privacy/index.html');
    var listBtn = document.getElementById('cityListLink');
    if (listBtn) listBtn.setAttribute('href', lang + '/prayer-times/index.html');
    var logo = document.querySelector('img.logo-img');
    if (logo) {
      var key = logo.getAttribute('data-src-' + lang) ? lang : 'fa';   /* Urdu uses the Persian logo */
      logo.setAttribute('src', logo.getAttribute('data-src-' + key));
      logo.setAttribute('srcset', logo.getAttribute('data-srcset-' + key));
    }
    var sel = document.getElementById('langSelect');
    if (sel) {
      if (!sel.options.length) {
        var head = document.createElement('option');          /* always shown as the default text */
        head.value = ''; head.textContent = 'Languages';
        sel.appendChild(head);
        LANGS.forEach(function (x) {
          var o = document.createElement('option');
          o.value = x.code; o.textContent = x.label;
          sel.appendChild(o);
        });
      }
      sel.value = '';
    }
    document.title = t('page_title');
  }

  function set(l) {
    lang = D[l] ? l : 'fa';                    /* switching does not save; only the defaults button does */
    apply();
    if (root.dispatchEvent && typeof CustomEvent !== 'undefined') root.dispatchEvent(new CustomEvent('azan:langchange', { detail: { lang: lang } }));
  }

  var api = { t: t, num: num, toAscii: toAscii, names: names, percent: percent, apply: apply, set: set, isRtl: isRtl, langs: LANGS,
              current: function () { return lang; } };
  root.AzanLang = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document !== 'undefined') {
    var wire = function () {
      apply();
      var sel = document.getElementById('langSelect');
      if (sel) sel.addEventListener('change', function () {
        var chosen = sel.value;
        if (!chosen) return;
        set(chosen);
        sel.value = chosen;                                     /* show the chosen language for a moment */
        setTimeout(function () { sel.value = ''; }, 1000);      /* then back to the "Languages" text */
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
    else wire();
  }
})(typeof window !== 'undefined' ? window : globalThis);
