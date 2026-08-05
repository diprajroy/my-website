(function(){
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

  const buttons = $$(".filter-btn");
  const items = $$(".gallery-item");

  function setActive(btn){
    buttons.forEach(b => b.classList.toggle("active", b === btn));
  }

  function filter(category){
    items.forEach(card => {
      const cat = card.getAttribute("data-category") || "all";
      const show = category === "all" || cat === category;
      card.style.display = show ? "block" : "none";
    });
  }

  // Lightbox
  const lightbox = $("#lightbox");
  const lbImg = $("#lightboxImg");
  const lbTitle = $("#lightboxTitle");
  const btnPrev = $("#lbPrev");
  const btnNext = $("#lbNext");
  const btnClose = $("#lbClose");
  const btnDownload = $("#lbDownload");

  let currentIndex = -1;
  const visibleItems = () => items.filter(i => i.style.display !== "none");

  function openLightbox(index){
    const vis = visibleItems();
    if(index < 0 || index >= vis.length) return;
    currentIndex = index;

    const card = vis[currentIndex];
    const img = $("img", card);
    const title = card.getAttribute("data-title") || img.alt || "Design";

    lbImg.src = img.getAttribute("data-full") || img.src;
    lbImg.alt = title;
    lbTitle.textContent = title;
    btnDownload.href = img.getAttribute("data-full") || img.src;

    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox(){
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
    currentIndex = -1;
  }

  function next(delta){
    const vis = visibleItems();
    if(!vis.length) return;
    currentIndex = (currentIndex + delta + vis.length) % vis.length;
    openLightbox(currentIndex);
  }

  // Bind filter buttons
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-filter");
      setActive(btn);
      filter(cat);
    });
  });

  // Bind cards (open)
  function bindCardOpen(){
    const vis = visibleItems();
    vis.forEach((card, idx) => {
      const openBtn = $(".js-open", card);
      const img = $("img", card);

      const open = (e) => {
        e.preventDefault();
        // recompute index against current visible list (in case of filter changes)
        const fresh = visibleItems();
        const newIdx = fresh.indexOf(card);
        openLightbox(newIdx);
      };

      openBtn?.addEventListener("click", open);
      img?.addEventListener("click", open);
    });
  }

  // Re-bind after filtering (simple approach)
  function rebind(){
    // remove old handlers by cloning nodes
    items.forEach(card => {
      const clone = card.cloneNode(true);
      card.replaceWith(clone);
    });
  }

  // Because we clone nodes, refresh references:
  function refresh(){
    // Rebuild references
    const newItems = $$(".gallery-item");
    items.length = 0;
    newItems.forEach(i => items.push(i));
    bindCardOpen();
  }

  // Initial binding
  bindCardOpen();

  // If you want cloning-safe rebind on every filter click:
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      rebind();
      refresh();
    }, {capture:false});
  });

  // Lightbox controls
  btnPrev.addEventListener("click", () => next(-1));
  btnNext.addEventListener("click", () => next(1));
  btnClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if(e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if(!lightbox.classList.contains("open")) return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowLeft") next(-1);
    if(e.key === "ArrowRight") next(1);
  });

  // Default state
  const defaultBtn = buttons.find(b => b.dataset.filter === "all") || buttons[0];
  if(defaultBtn){ setActive(defaultBtn); filter(defaultBtn.dataset.filter); }
})();
