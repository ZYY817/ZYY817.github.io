/* 宇奇引擎官网 · 线性图标集（24×24，1.6px 描边） */
(function () {
  var s = {
    ymark: '<path d="M12 12L5 6.5M12 12l7-5.5M12 12v8"/>',
    game: '<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7.5 10.5v4M5.5 12.5h4"/><path d="M15.5 11.3h.01M17.8 13.6h.01" stroke-width="2.4"/>',
    memory: '<rect x="3" y="7" width="18" height="9" rx="1.6"/><path d="M7 10.5h2v2H7zM11 10.5h2v2h-2zM15 10.5h2v2h-2z"/><path d="M6 16v3M10 16v3M14 16v3M18 16v3"/>',
    audio: '<path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z"/><path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 6.8a7.4 7.4 0 0 1 0 10.4"/>',
    gauge: '<path d="M4.5 17a8 8 0 1 1 15 0"/><path d="M12 16l3.6-4.6"/><path d="M12 16h.01" stroke-width="3"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9.5 2.5V6M14.5 2.5V6M9.5 18v3.5M14.5 18v3.5M2.5 9.5H6M2.5 14.5H6M18 9.5h3.5M18 14.5h3.5"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8.5 20h7M12 16v4"/>',
    network: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2v4.8M12 12l-5.4 5.4M12 12l5.4 5.4"/>',
    mouse: '<rect x="6.5" y="3" width="11" height="18" rx="5.5"/><path d="M12 7v3"/>',
    shield: '<path d="M12 3l7.5 3v5.2c0 4.4-3.1 8-7.5 9.8-4.4-1.8-7.5-5.4-7.5-9.8V6L12 3z"/>',
    shieldCheck: '<path d="M12 3l7.5 3v5.2c0 4.4-3.1 8-7.5 9.8-4.4-1.8-7.5-5.4-7.5-9.8V6L12 3z"/><path d="M8.8 12.2l2.2 2.2 4.3-4.4"/>',
    sliders: '<path d="M4 7h9M18 7h2M4 17h3M12 17h8"/><circle cx="15.5" cy="7" r="2.3"/><circle cx="9.5" cy="17" r="2.3"/>',
    layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9.5 9v11"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M12 13.2v3l2 1.2"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    trash: '<path d="M4 7h16M9.5 3.5h5M6 7l1 13h10l1-13M10 11v5.5M14 11v5.5"/>',
    chip: '<rect x="4" y="4" width="16" height="16" rx="2.2"/><path d="M8 9h8M8 12.5h8M8 16h4.5"/>',
    pulse: '<path d="M3 12h4l2.5-6 5 12 2.5-6h4"/>',
    backup: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/><path d="M12 8.5V12l2.6 1.8"/>',
    flag: '<path d="M5.5 21V4M5.5 4.5h11l-2 4 2 4h-11"/>',
    wrench: '<path d="M14.8 3.6a4.6 4.6 0 0 0-4.6 6L3.8 16a2 2 0 0 0 2.8 2.8L13 12.4a4.6 4.6 0 0 0 6-4.6l-2.9 2.9-2.8-.7-.7-2.8 2.2-3.6z"/>',
    cores: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
    power: '<path d="M12 3v8.5"/><path d="M6.6 6.8a7.6 7.6 0 1 0 10.8 0"/>',
    box: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/>',
    fileZip: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5M10 7h1M10 10h1M10 13h1M9.5 16h2v2h-2z"/>',
    download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14"/>',
    arrow: '<path d="M5 12h14M13.5 6.5L19 12l-5.5 5.5"/>',
    arrowUpRight: '<path d="M7 17L17 7M9 7h8v8"/>',
    check: '<path d="M5 12.5l4.2 4.2L19 7"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8.3 12.3l2.5 2.5 5-5.2"/>',
    copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6h.01" stroke-width="2"/>',
    alert: '<path d="M12 3.5L2.8 19.5h18.4L12 3.5z"/><path d="M12 10v4.2M12 16.9h.01" stroke-width="2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    menu: '<path d="M4 8h16M4 16h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    refresh: '<path d="M20 11.5A8 8 0 0 0 6.3 6.3L4 8.5M4 4v4.5h4.5M4 12.5a8 8 0 0 0 13.7 5.2L20 15.5M20 20v-4.5h-4.5"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5M14 10.5V5.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.6a6 6 0 0 1-4.6-2.2L3.6 16a1.6 1.6 0 0 1 2.4-2.1L8 15.5"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8L12 3.5z"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
    code: '<path d="M8.5 7.5L4 12l4.5 4.5M15.5 7.5L20 12l-4.5 4.5M13.5 5l-3 14"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21M12 3C9.5 5.6 8.2 8.6 8.2 12S9.5 18.4 12 21"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12.5 15H17"/>',
    package: '<path d="M4 7.5L12 3.5l8 4v9l-8 4-8-4v-9z"/><path d="M8 5.5l8 4M12 11.5v9M4 7.5l8 4 8-4"/>',
    play: '<path d="M7.5 5.2v13.6L19 12z"/>'
  };
  var gh =
    '<path d="M12 .8C5.8.8.8 5.8.8 12c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.5v-2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.4.1-3 0 0 .9-.3 3.1 1.1a10.8 10.8 0 0 1 5.6 0c2.1-1.4 3.1-1.1 3.1-1.1.6 1.6.2 2.7.1 3 .7.8 1.2 1.8 1.2 3 0 4.3-2.6 5.2-5.1 5.5.4.4.8 1 .8 2.1v3.1c0 .3.2.7.8.5 4.5-1.5 7.7-5.7 7.7-10.7C23.2 5.8 18.2.8 12 .8z"/>';
  var out = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">';
  for (var k in s) out += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + s[k] + "</symbol>";
  out += '<symbol id="i-github" viewBox="0 0 24 24">' + gh + "</symbol></svg>";
  document.body.insertAdjacentHTML("afterbegin", out);
})();
