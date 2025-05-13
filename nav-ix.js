@ -0,0 +1,317 @@
console.log("%cJK Deep Nav Single Pane Test - spoon+fork git 5-13-25 ",
    "background:blue;color:#fff;padding: 8px;");
  
  function initNavListener() {
  
    // Only run if on desktop
    if (window.innerWidth > 991) {
      // Run on Desktop
      console.log("Desktop menu initialized > 991 ");
  
      const toggleAttr = "[primary-nav-link]";
  
      // Open or toggle submenu
      $(toggleAttr).on("click keydown", function (e) {
        const isClick = e.type === "click";
        const isEnter = e.key === "Enter";
        const isSpace = e.key === " " || e.keyCode === 32;
  
        if (isClick || isEnter || isSpace) {
          if (!isClick) e.preventDefault();
  
          const $this = $(this);
          const $submenu = $this.next(".nav_submenu");
  
          // Toggle the submenu
          const isOpen = $submenu.hasClass("keyboard-open");
  
          // Close all other submenus first
          $(".nav_submenu.keyboard-open").removeClass("keyboard-open");
  
          if (!isOpen) {
            $submenu.addClass("keyboard-open");
            $submenu.find("a, button").first().focus(); // optional
          }
        }
      });
  
      // Close on Escape inside submenu
      $(".nav_submenu").on("keydown", function (e) {
        if (e.key === "Escape") {
          $(this).removeClass("keyboard-open").prev(toggleAttr).focus();
        }
      });
  
      // Click outside to close
      $(document).on("click", function (e) {
        if (
          !$(e.target).closest(".nav_submenu").length &&
          !$(e.target).closest(toggleAttr).length
        ) {
          $(".nav_submenu.keyboard-open").removeClass("keyboard-open");
        }
      });
  
    } /* END Desktop Code */
  
    // Only run if on mobile/tablet
    if (window.innerWidth <= 991) {
      // Run on Tablet and below 
      console.log("Mobile menu initialized <= 991 ");
  
      // Beginning WORKING CODE JK 
  
      /*** VARIABLES ***/
  
      let navButton = $(".nav_button");
      let lines = $(".nav_button_line");
      let backButton = $(".nav_back-button");
      let menuWrap = $(".nav_mobile-pane_position"); /* main menu pane (Level 0) */
      let menuBackground = $(".nav_mobile-background");
  
      let subNavsL1 = $(".nav_submenu[data-nav-level=1]");
      let deepNavsL2 = $(".nav_submenu[data-nav-level=2]");
  
      let deepNavPane = $(".nav_deep-links-wrapper");
  
      let activeSubmenu = null;
      let activeLevel = 0;
  
      let previouslyFocused;
  
      let primaryLinksWrapL0 = $('.nav_primary-links-wrapper');
      let contactButtonMobile = $('#nav-cta-desktop');
  
      /*** Trap focus list ([trap-focus] : 
       * nav_primary-links-wrapper --> all nav_submenu_content
       * nav_deep-links-wrapper --> all nav_submenu_content
       * 
       ***/
  
      /*** ANIMATIONS ***/
  
      /* Show Deepmenu Animation - Level 2 */
      let showDeepMenuL2 = gsap.timeline({
        paused: true,
        defaults: { ease: "power1.inOut", duration: 0.3 },
        onComplete: () => {
          // callback to find the active panel and focus on the first link 
          activeSubmenu.find("a, button").first().focus();
  
        },
        onReverseComplete: () => {
          // Reset and Re-Hide all menu panels
          deepNavsL2.css('display', 'none').hide();
          previouslyFocused.focus();
        }
      });
      showDeepMenuL2.from(deepNavPane, { x: "100%", ease: "power1.inOut", duration: 0.3 });
      showDeepMenuL2.to(deepNavPane, { x: "0%", ease: "power1.inOut", duration: 0.3 });
  
      /* May need to change these to animate the pane only and/or hide the subnavs subnav all in 1 category? */
  
      /* Show Submenu Animation - Level 1 */
  
      let showSubMenuL1 = gsap.timeline({
        paused: true,
        defaults: { ease: "power1.inOut", duration: 0.3 },
        onComplete: () => {
          // callback to find the active panel and focus on the first link 
          activeSubmenu.find("a, button").first().focus();
          backButton.css('display', 'flex').show();
  
        },
        onReverseComplete: () => {
          // Reset and Re-Hide all menu panels
          subNavsL1.css('display', 'none').hide();
          backButton.css('display', 'none').hide();
          previouslyFocused.focus();
  
          // showDeepMenuL2.progress(0); /* ? */
          // showDeepMenuL2.pause(); /* ? */
  
        }
      });
      showSubMenuL1.from(subNavsL1, { x: "100%", ease: "power1.inOut", duration: 0.3 });
      showSubMenuL1.to(subNavsL1, { x: "0%", ease: "power1.inOut", duration: 0.3 });
  
      /* Open Main Menu Animation */
      let showMainMenu = gsap.timeline({
        paused: true,
        defaults: { ease: "power1.inOut", duration: 0.3 },
        onComplete: () => {
          //callback to focus first item in primary menu list for accessibility (Timestamp: 34:00) 
          primaryLinksWrapL0.find("a, button").first().focus();
        },
        onReverseComplete: () => {
          // callback to reset the submenu to main when closing (and not replay it once reset)
          showSubMenuL1.progress(0);
          showSubMenuL1.pause();
          showDeepMenuL2.progress(0);
          showDeepMenuL2.pause();
        }
      });
      showMainMenu.set(menuWrap, { display: "flex" });
      showMainMenu.set(menuBackground, { display: "block" });
      showMainMenu.to(menuWrap, { x: "0%" });
      showMainMenu.from(menuBackground, { opacity: 0 }, "<");
      showMainMenu.to(lines.eq(0), { y: 6, rotate: 45 }, "<");
      showMainMenu.to(lines.eq(2), { y: -6, rotate: -45 }, "<");
      showMainMenu.to(lines.eq(1), { opacity: 0 }, "<");
  
      /*** EVENTS ***/
  
      /* Play Open Main Menu Animation On Click, close (reverse) if open) */
      navButton.on("click", function () {
        if (showMainMenu.progress() === 0) {
          showMainMenu.play();
        } else {
          showMainMenu.reverse();
        }
      });
  
      /* Close menu (reverse open animation) when clicking on background (overlay) */
      menuBackground.on("click", function () {
        showMainMenu.reverse();
      });
  
      /* Close menu (reverse open animation) when clicking Escape key */
  
      $(document).on("keydown", function (e) {
        if (e.key === "Escape") showMainMenu.reverse();
      });
  
      /* Back Button */
  
      backButton.on("click", function () {
        
        if (activeLevel == 2) {
          activeLevel = 1;
          showDeepMenuL2.reverse();
          /* still need to update to previous submenu here */
          
        } else if (activeLevel == 1) {
          activeLevel = null;
          showSubMenuL1.reverse();
          
        }
  
      });
  
      /* Play Show Submenu Animation Level 1 On Click */
  
      $('[data-controls-submenu-level="1"]').on('click', function () {
        // Set the button as the previouslyFocused for use with back button 
        previouslyFocused = $(this);
  
        // Hide all submenus
        subNavsL1.css('display', 'none').hide();
  
        let button = $(this);
        let submenuId = button.attr('aria-controls');
  
        activeSubmenu = $('#' + submenuId);
        activeSubmenu.css('display', 'flex').show()
        activeLevel = activeSubmenu.attr("data-nav-level");
  
        showSubMenuL1.play();
  
      });
  
      /* END Play Show Submenu Animation Level 1 On Click */
  
      /* Play Show DeepMenu Animation Level 2 On Click */
  
      $('[data-controls-submenu-level="2"]').on('click', function () {
        // Set the button as the previouslyFocused for use with back button 
        previouslyFocused = $(this);
  
        // Hide all deep submenus
        deepNavsL2.css('display', 'none').hide();
  
        let button = $(this);
        let submenuId = button.attr('aria-controls');
  
        activeSubmenu = $('#' + submenuId);
        activeSubmenu.css('display', 'flex').show()
        activeLevel = activeSubmenu.attr("data-nav-level");
  
        showDeepMenuL2.play();
  
      });
  
      /* END Play Show Submenu Animation Level 2 On Click */
  
      /* Add "trap-focus" for each menu group. See list with variables above. 
       * Add [focus-back=true] for all except primary nav */
  
      $("[trap-focus]").each(function () {
        let focusBack = $(this).attr("focus-back");
        let lastItem = $(this).find("a, button").last();
  
        let firstItem = $(this).find("a, button").first();
  
        lastItem.on("keydown", function (e) {
          if (e.key === "Tab") {
            e.preventDefault();
            if (focusBack === "true") {
              backButton.focus();
            } else {
              navButton.focus();
            }
          }
        });
  
        backButton.on("keydown", function (e) {
          if (e.key === "Tab") {
            e.preventDefault();
            firstItem.focus();
          }
        });
  
      });
  
    } /*** END Run on Tablet and below ***/
  
  } /*** END initNavListener ***/
  
  // Debounce wrapper on resize
  let resizeTimeout;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initNavListener, 150);
  });
  
  // Run everything once on load
  initNavListener();
  
