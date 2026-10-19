/* 宇奇引擎官网 · 交互 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lang = function () { return root.getAttribute("data-lang") === "en" ? "en" : "zh"; };
  var t = function (zh, en) { return lang() === "en" ? en : zh; };

  /* ---------- language ---------- */
  function applyLang(l) {
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l === "en" ? "en" : "zh-CN");
    var title = root.getAttribute("data-title-" + l);
    if (title) document.title = title;
    try { localStorage.setItem("yuqi-lang", l); } catch (e) {}
  }
  $$("[data-set-lang]").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-set-lang")); });
  });
  applyLang(lang());

  /* ---------- nav ---------- */
  var nav = $(".nav");
  var menuBtn = $(".menu-btn");
  var mobileMenu = $(".mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.querySelector("use").setAttribute("href", open ? "#i-close" : "#i-menu");
    });
    $$("a", mobileMenu).forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.querySelector("use").setAttribute("href", "#i-menu");
      });
    });
  }

  /* ---------- nav scrollspy ---------- */
  var spyLinks = $$(".nav-links a[href^='#'], .nav-links a[href^='index.html#']");
  if (spyLinks.length && "IntersectionObserver" in window) {
    var spyMap = {};
    spyLinks.forEach(function (a) {
      var id = a.getAttribute("href").split("#")[1];
      if (id) (spyMap[id] = spyMap[id] || []).push(a);
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.remove("active"); });
        (spyMap[e.target.id] || []).forEach(function (a) { a.classList.add("active"); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(spyMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    /* fire well before the element reaches reading position — content
       should already be settled by the time the eye lands on it */
    }, { rootMargin: "0px 0px -14% 0px", threshold: 0.04 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- scroll-driven effects ---------- */
  var hero = $(".hero");
  var pxLayers = hero ? [
    [".grid-bg", 0.08],
    [".chip-a", -0.09],
    [".chip-b", -0.14]
  ].map(function (p) { return [$(p[0], hero), p[1]]; }).filter(function (p) { return p[0]; }) : [];
  var flowPin = $(".flow-pin");
  var flowBar = $(".flow-bar i");
  var flowSteps = $$(".fstep");
  var flowVis = $$(".fvis");
  var showcase = $(".showcase");
  var ticking = false;

  function smooth(x) { return x * x * (3 - 2 * x); }

  var flowPinH = 0; /* offsetHeight is layout-stable between resizes —
                     cache it instead of re-reading every frame */
  var lastStep = -1, lastFp = "";

  function onScroll() {
    ticking = false;
    var vh = window.innerHeight;
    var y = window.scrollY || window.pageYOffset;

    /* ---- reads first: every layout read AFTER a style write forces a
       synchronous style+layout recalc, so keep them on separate sides ---- */
    var pr = null, fpH = 0;
    if (flowPin) {
      pr = flowPin.getBoundingClientRect();
      if (pr.bottom > -80 && pr.top < vh + 80) {
        if (!flowPinH) flowPinH = flowPin.offsetHeight;
        fpH = flowPinH;
      } else {
        pr = null; /* offscreen: skip all scrub work for this frame */
      }
    }
    var sr = null, sH = 0;
    if (showcase) {
      sr = showcase.getBoundingClientRect();
      if (sr.bottom > -80 && sr.top < vh + 80) sH = showcase.offsetHeight;
      else sr = null;
    }

    /* ---- writes ---- */
    if (nav) nav.classList.toggle("scrolled", y > 8);

    /* hero layered parallax — gentle drift on grid and floating chips */
    if (pxLayers.length && !reduceMotion && y < vh * 1.5) {
      pxLayers.forEach(function (p) {
        var v = (y * p[1]).toFixed(1) + "px";
        if (p[2] !== v) { p[0].style.setProperty("--py", v); p[2] = v; }
      });
    }

    /* pinned flow: scroll scrubs the active step; falls back to
       progressive lighting when the pin is disabled (mobile) */
    if (pr) {
      var pinned = fpH > vh * 1.2;
      var fp;
      if (pinned) {
        fp = clamp(-pr.top / (fpH - vh), 0, 1);
      } else {
        fp = clamp((vh * 0.82 - pr.top) / (pr.height * 0.9 + vh * 0.1), 0, 1);
      }
      if (reduceMotion) fp = pr.top < vh ? 1 : 0;
      var fpv = fp.toFixed(3);
      if (flowBar && fpv !== lastFp) { flowBar.style.setProperty("--fp", fpv); lastFp = fpv; }
      var n = flowSteps.length - 1;
      var cur = clamp(Math.floor(fp * (n + 1) + 0.0001), 0, n);
      flowSteps.forEach(function (s, i) {
        s.classList.toggle("lit", fp >= i / n - 0.02);
        s.classList.toggle("on", i === cur);
      });
      flowVis.forEach(function (v, i) { v.classList.toggle("on", i === cur); });
      if (cur !== lastStep) { flowPin.setAttribute("data-step", cur); lastStep = cur; }
    }

    if (sr) updateShowcase(vh, sr, sH);
  }
  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", function () { flowPinH = 0; requestTick(); });

  /* ---------- showcase: sticky zoom + tabs ---------- */
  var zoomImgs = $$(".zoom-img");
  var callouts = $$(".callout");
  var activeShot = zoomImgs.length ? zoomImgs[0].getAttribute("data-shot") : null;

  function updateShowcase(vh, r, sH) {
    var mobile = window.innerWidth <= 760;
    var total = (sH || showcase.offsetHeight) - vh;
    var p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
    var z = mobile || reduceMotion ? 0 : smooth(clamp((p - 0.12) / 0.58, 0, 1));
    zoomImgs.forEach(function (img) { img.style.setProperty("--z", z.toFixed(3)); });
    callouts.forEach(function (c) {
      c.classList.toggle("show", !mobile && c.getAttribute("data-shot") === activeShot && z > 0.72);
    });
  }

  $$(".tabs [role=tab]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      activeShot = tab.getAttribute("data-shot");
      $$(".tabs [role=tab]").forEach(function (x) {
        x.setAttribute("aria-selected", x === tab ? "true" : "false");
      });
      zoomImgs.forEach(function (img) {
        if (img.getAttribute("data-shot") === activeShot) img.removeAttribute("hidden");
        else img.setAttribute("hidden", "");
      });
      requestTick();
    });
  });

  /* ---------- status demo ---------- */
  var STATES = {
    read: { cls: "st-read", zh: "读取中", en: "Reading" },
    ok: { cls: "st-ok", zh: "已确认", en: "Confirmed" },
    warn: { cls: "st-warn", zh: "待确认", en: "Pending" },
    na: { cls: "st-na", zh: "不可用", en: "Unavailable" }
  };
  function chipHTML(k) {
    var s = STATES[k];
    return '<i></i><span class="zh">' + s.zh + '</span><span class="en">' + s.en + "</span>";
  }
  var demo = $(".status-demo");
  var demoTimers = [];
  function setItem(item, k) {
    var chip = $(".st", item);
    chip.className = "st " + STATES[k].cls;
    chip.innerHTML = chipHTML(k);
    item.setAttribute("data-state", k);
    item.classList.toggle("is-ok", k === "ok");
    var rchip = $(".reason-chip", item);
    if (rchip) {
      rchip.className = "reason-chip chip-" + k;
      if (k === "read") {
        rchip.innerHTML = '<span class="zh">⟳ 检索接口中…</span><span class="en">⟳ Querying APIs…</span>';
      } else {
        var rzh = item.getAttribute("data-reason-zh") || STATES[k].zh;
        var ren = item.getAttribute("data-reason-en") || STATES[k].en;
        rchip.innerHTML = '<span class="zh">' + rzh + '</span><span class="en">' + ren + '</span>';
      }
    }
    var tg = $(".toggle", item);
    if (tg) {
      tg.classList.toggle("on", k === "ok");
      tg.classList.toggle("locked", k !== "ok");
    }
    var why = $(".why", item);
    if (why) why.hidden = k === "read";
    updateFoot();
  }
  function updateFoot() {
    if (!demo) return;
    var items = $$(".demo-item", demo);
    var c = { ok: 0, warn: 0, na: 0, read: 0 };
    items.forEach(function (it) { c[it.getAttribute("data-state") || "read"]++; });
    var set = function (k, v) { var el = $('[data-count="' + k + '"]', demo); if (el) el.textContent = v; };
    set("ok", c.ok + "/" + items.length);
    set("warn", c.warn);
    set("na", c.na);
    set("read", c.read);
  }
  function runDemo() {
    if (!demo) return;
    demoTimers.forEach(clearTimeout);
    demoTimers = [];
    var items = $$(".demo-item", demo);
    items.forEach(function (it) { setItem(it, "read"); });
    items.forEach(function (it, i) {
      var delay = reduceMotion ? 0 : parseInt(it.getAttribute("data-delay") || 900 + i * 650, 10);
      demoTimers.push(setTimeout(function () { setItem(it, it.getAttribute("data-final")); }, delay));
    });
  }
  if (demo) {
    $$(".demo-item", demo).forEach(function (it) { setItem(it, "read"); });
    if ("IntersectionObserver" in window) {
      var dio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { runDemo(); dio.disconnect(); }
        });
      }, { threshold: 0.45 });
      dio.observe(demo);
    } else runDemo();
    var replay = $(".replay", demo);
    if (replay) replay.addEventListener("click", runDemo);
    $$(".why", demo).forEach(function (w) {
      w.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var open = w.getAttribute("aria-expanded") === "true";
        $$(".why", demo).forEach(function (x) { x.setAttribute("aria-expanded", "false"); });
        w.setAttribute("aria-expanded", open ? "false" : "true");
      });
    });
    document.addEventListener("click", function () {
      $$(".why", demo).forEach(function (x) { x.setAttribute("aria-expanded", "false"); });
    });
  }

  /* legend rows highlight matching items inside the demo panel */
  if (demo && window.matchMedia("(hover: hover)").matches) {
    $$(".legend-row[data-k]").forEach(function (row) {
      var k = row.getAttribute("data-k");
      row.addEventListener("pointerenter", function () {
        demo.setAttribute("data-focus", k);
        row.classList.add("hl");
      });
      row.addEventListener("pointerleave", function () {
        demo.removeAttribute("data-focus");
        row.classList.remove("hl");
      });
    });
  }

  /* ---------- cursor spotlight on cards ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    var spotRaf = 0, spotEv = null;
    document.addEventListener("pointermove", function (e) {
      spotEv = e;
      if (spotRaf) return;
      spotRaf = requestAnimationFrame(function () {
        spotRaf = 0;
        var ev = spotEv;
        var t2 = ev && ev.target && ev.target.closest ? ev.target.closest(".card, .step-card, .list-card, .ver, .fit-card") : null;
        if (!t2) return;
        var r = t2.getBoundingClientRect();
        t2.style.setProperty("--mx", (ev.clientX - r.left) + "px");
        t2.style.setProperty("--my", (ev.clientY - r.top) + "px");
      });
    }, { passive: true });
  }

  /* ---------- terminal typing loop (flow step 1) ---------- */
  var termBody = $("[data-term]");
  if (termBody) {
    var tLines = $$("p", termBody);
    var tIdx = 0, tTimer = null;
    function termStep() {
      if (tIdx < tLines.length) {
        tLines[tIdx++].classList.add("on");
        tTimer = setTimeout(termStep, 640);
      } else {
        tTimer = setTimeout(termReset, 2800);
      }
    }
    function termReset() {
      tLines.forEach(function (p) { p.classList.remove("on"); });
      tIdx = 0;
      tTimer = setTimeout(termStep, 600);
    }
    if (reduceMotion) {
      tLines.forEach(function (p) { p.classList.add("on"); });
    } else if ("IntersectionObserver" in window) {
      var tio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !tTimer) tTimer = setTimeout(termStep, 300);
          else if (!e.isIntersecting && tTimer) { clearTimeout(tTimer); tTimer = null; }
        });
      }, { threshold: 0.3 });
      tio.observe(termBody);
    } else termStep();
  }

  /* ---------- copy ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 1800);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (res, rej) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? res() : rej(); } catch (e) { rej(e); }
      document.body.removeChild(ta);
    });
  }
  $$(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = $(btn.getAttribute("data-copy"));
      if (!src) return;
      copyText(src.textContent.replace(/\u00a0/g, " ").trim()).then(function () {
        btn.classList.add("done");
        toast(t("已复制到剪贴板", "Copied to clipboard"));
        setTimeout(function () { btn.classList.remove("done"); }, 1600);
      }, function () { toast(t("复制失败，请手动选择", "Copy failed — please select manually")); });
    });
  });

  /* ---------- live GitHub stars ---------- */
  var starEls = $$("[data-stars]");
  function paintStars(n) { starEls.forEach(function (el) { el.textContent = Number(n).toLocaleString("en-US"); }); }
  if (starEls.length && window.fetch) {
    var cached = null;
    try { cached = JSON.parse(sessionStorage.getItem("yuqi-stars") || "null"); } catch (e) {}
    if (cached && Date.now() - cached.t < 30 * 60 * 1000) paintStars(cached.n);
    else {
      fetch("https://api.github.com/repos/ZYY817/YuqiEngine", { headers: { Accept: "application/vnd.github+json" } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (j && typeof j.stargazers_count === "number") {
            paintStars(j.stargazers_count);
            try { sessionStorage.setItem("yuqi-stars", JSON.stringify({ n: j.stargazers_count, t: Date.now() })); } catch (e) {}
          }
        })
        .catch(function () {});
    }
  }

  /* ---------- latest release: auto-refresh tag, links, size & date ---------- */
  function pickAsset(assets, re) {
    for (var i = 0; i < assets.length; i++) {
      if (re.test(assets[i].name || "")) return assets[i];
    }
    return null;
  }
  function paintRelease(rel) {
    if (!rel || !rel.tag_name) return;
    var assets = rel.assets || [];
    var setup = pickAsset(assets, /setup.*\.exe$/i) || pickAsset(assets, /\.exe$/i);
    var zip = pickAsset(assets, /\.zip$/i);
    $$("[data-rel-tag]").forEach(function (el) { el.textContent = rel.tag_name; });
    if (rel.published_at) {
      var d = String(rel.published_at).slice(0, 10);
      $$("[data-rel-date]").forEach(function (el) { el.textContent = d; });
    }
    [
      [setup, "setup"],
      [zip, "zip"]
    ].forEach(function (pair) {
      var a = pair[0], k = pair[1];
      if (!a || !a.browser_download_url) return;
      $$("[data-rel-" + k + "]").forEach(function (el) { el.href = a.browser_download_url; });
      $$("[data-rel-" + k + "-name]").forEach(function (el) { el.textContent = a.name; });
      if (a.size) {
        var mb = (a.size / 1048576).toFixed(1) + " MB";
        $$("[data-rel-" + k + "-size]").forEach(function (el) { el.textContent = mb; });
      }
    });
  }
  if ($$("[data-rel-tag]").length && window.fetch) {
    var rc = null;
    try { rc = JSON.parse(sessionStorage.getItem("yuqi-release") || "null"); } catch (e) {}
    if (rc && rc.d && Date.now() - rc.t < 30 * 60 * 1000) paintRelease(rc.d);
    else {
      fetch("https://api.github.com/repos/ZYY817/YuqiEngine/releases?per_page=5", { headers: { Accept: "application/vnd.github+json" } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          var rel = null;
          if (j && j.length) {
            for (var i = 0; i < j.length; i++) { if (!j[i].draft) { rel = j[i]; break; } }
          }
          if (rel) {
            paintRelease(rel);
            try {
              sessionStorage.setItem("yuqi-release", JSON.stringify({
                t: Date.now(),
                d: {
                  tag_name: rel.tag_name,
                  published_at: rel.published_at,
                  assets: (rel.assets || []).map(function (a) {
                    return { name: a.name, size: a.size, browser_download_url: a.browser_download_url };
                  })
                }
              }));
            } catch (e) {}
          }
        })
        .catch(function () {});
    }
  }

  /* ---------- embedded app UI: scale, lazy-load & offscreen sleep ---------- */
  var embeds = $$(".app-embed");
  var DESIGN_W = 1280;
  var liveMq = window.matchMedia ? window.matchMedia("(max-width: 760px)") : null;
  function fitEmbed(em, loadNow) {
    var ifr = $("iframe", em);
    if (!ifr) return;
    var small = liveMq ? liveMq.matches : window.innerWidth <= 760;
    em.classList.toggle("fallback", small);
    if (small) return;
    if (loadNow && !ifr.src && ifr.getAttribute("data-src")) {
      ifr.src = ifr.getAttribute("data-src");
    }
    if (!ifr.src) return;
    var k = (em.clientWidth / DESIGN_W).toFixed(4);
    if ("zoom" in ifr.style) {
      ifr.style.zoom = k; /* crisp: re-layouts at target size, no raster blur */
      ifr.style.transform = "";
    } else {
      ifr.style.zoom = "";
      ifr.style.transform = "scale(" + k + ")";
    }
  }
  function fitEmbeds() { embeds.forEach(function (em) { fitEmbed(em, false); }); }

  /* pause the iframe's animations while scrolling or out of view —
     via the Web Animations API so no style recalculation is triggered.
     (The previous stylesheet injection forced a whole-document style
     recalc inside the app on every scroll start/stop.) */
  function sleepEmbed(em, sleep) {
    var ifr = $("iframe", em);
    if (!ifr || !ifr.src) return;
    try {
      var d = ifr.contentDocument;
      if (!d) return;
      if (d.getAnimations) {
        var anims = d.getAnimations({ subtree: true });
        for (var i = 0; i < anims.length; i++) {
          if (sleep) anims[i].pause(); else anims[i].play();
        }
      } else {
        /* fallback for engines without getAnimations */
        var st = d.getElementById("yuqi-sleep");
        if (sleep && !st) {
          st = d.createElement("style");
          st.id = "yuqi-sleep";
          st.textContent = "*,*::before,*::after{animation-play-state:paused!important;transition:none!important}";
          d.head.appendChild(st);
        } else if (!sleep && st) {
          st.remove();
        }
      }
    } catch (e) {}
  }

  /* freeze everything animatable while the user is actively scrolling:
     page-level animations get animation-play-state:paused via the
     .is-scrolling class, and each live iframe gets its animations and
     transitions halted. Scrolling on a weak GPU is then pure compositing. */
  var scrollFreezeT = null;
  var scrollingNow = false;
  function refreshSleep(em) { sleepEmbed(em, scrollingNow || !!em._offscreen); }
  function setScrolling(on) {
    if (on === scrollingNow) return;
    scrollingNow = on;
    document.documentElement.classList.toggle("is-scrolling", on);
    embeds.forEach(refreshSleep);
  }
  window.addEventListener("scroll", function () {
    setScrolling(true);
    if (scrollFreezeT) clearTimeout(scrollFreezeT);
    scrollFreezeT = setTimeout(function () { setScrolling(false); }, 180);
  }, { passive: true });

  /* ambient animations that survive past their scroll stop also sleep
     when their section leaves the viewport (.anim-off → paused in CSS) */
  if ("IntersectionObserver" in window) {
    var ambIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("anim-off", !e.isIntersecting); });
    }, { rootMargin: "120px" });
    $$(".ticker, .ver.primary, .term, .hero, .app-embed").forEach(function (el) { ambIo.observe(el); });
  }

  if (embeds.length) {
    embeds.forEach(function (em) {
      fitEmbed(em, false);
      /* the hero iframe boots a whole app on the main thread — defer its
         first load to the first idle moment so the page itself paints and
         becomes interactive before that work starts */
      if (em.getAttribute("data-embed") === "hero") {
        var defer = window.requestIdleCallback || function (fn) { return setTimeout(fn, 800); };
        defer(function () { fitEmbed(em, true); }, { timeout: 1600 });
      }
    });

    if ("IntersectionObserver" in window) {
      var loadIo = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            fitEmbed(e.target, true);
            loadIo.unobserve(e.target);
          }
        });
      }, { rootMargin: "500px" });
      /* poster mode: the static screenshot stays until the user explicitly
         asks for the live app — a second full boot never runs uninvited */
      $$(".embed-load").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var em = btn.closest(".app-embed");
          if (!em) return;
          em.classList.remove("poster");
          fitEmbed(em, true);
        });
      });
      var sleepIo = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          e.target._offscreen = !e.isIntersecting;
          refreshSleep(e.target);
        });
      }, { rootMargin: "80px" });
      embeds.forEach(function (em) {
        /* the hero embed loads on idle (above) — don't let the loader
           observer pull it back to page-start */
        if (em.getAttribute("data-embed") !== "hero" && !em.classList.contains("poster")) loadIo.observe(em);
        sleepIo.observe(em);
      });
    } else {
      embeds.forEach(function (em) { fitEmbed(em, true); });
    }
    window.addEventListener("resize", fitEmbeds);
    if (liveMq && liveMq.addEventListener) liveMq.addEventListener("change", fitEmbeds);
  }

  /* ---------- back to top ---------- */
  var toTop = $("#toTop");
  if (toTop) {
    toTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  onScroll();
})();
