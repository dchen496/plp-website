'use strict'

var pages = [
  { name: 'splash', subpages: [] },
  { name: 'about', subpages: [] },
  { name: 'location', subpages: [] },
//  { name: 'rush-schedule', subpages: [] },
  { name: 'house',  subpages: [] },
  { name: 'brothers',  subpages: ['the-brotherhood', 'seniors', 'juniors', 'sophomores', 'graduates'] },
  { name: 'rush', subpages: [] },
  { name: 'alumni',  subpages: [] },
  { name: 'contact', subpages: [] }
];

var allPages;
var parentMap;

function initializePages() {
  allPages = [];
  parentMap = [];
  for(var i = 0; i < pages.length; i++) {
    var parent = allPages.length;
    parentMap[allPages.length] = parent;
    allPages.push(pages[i].name);
    for(var j = 0; j < pages[i].subpages.length; j++) {
      parentMap[allPages.length] = parent;
      allPages.push(pages[i].name + "-" + pages[i].subpages[j]);
    }
  }
};

initializePages();

// prevent scrolling to different places concurrently
var scrollLock = null;
$(document).ready(function() {
  $('#fullpage').fullpage({
      afterLoad: afterLoad,
      onLeave: onLeave,
      anchors: allPages,
      slidesNavigation: true,
      slidesNavPosition: 'bottom',
      animateAnchor: false,
      responsiveWidth: 1080,
      responsiveHeight: 580
  });

  createHiddenNavbar();

  for(var i = 0; i < allPages.length; i++) {
    var page = allPages[i];
    $('.navbar-' + page).click((function(j) {
      if (scrollLock == null) {
        $.fn.fullpage.silentMoveTo(j+1);
        toggleHiddenNavbar(true);
      }
    }).bind(this, i));
  }

  $('.clickable-face img').on('mouseover', function() {
    $(this).css('filter', 'saturate(150%)');
  }).on('mouseout', function() {
    $(this).css('filter', '');
  });

  $('#page-splash').click(function() {
    window.location = '#about';
  });
});

function afterLoad(anchorLink, index) {
  index--;

  navbarLoad(index);
  highlightLoad(index);
  scrollLock = null;
}

function onLeave(index, nextIndex, direction) {
  index--;
  nextIndex--;

  if (scrollLock != null) {
    return false;
  }
  scrollLock = nextIndex;

  navbarTransition(index, nextIndex);
  highlightLoad(nextIndex);
}

var hiddenNavbarShowing = false;
function createHiddenNavbar() {
  var bar = $('#navbar').clone();
  bar.attr('id', 'hidden-navbar');
  bar.css('display', 'none');
  bar.appendTo('body');

  $('#navbar-toggle').click(function() {
    toggleHiddenNavbar();
  });
  $('#navbar-dimmer').click(function() {
    toggleHiddenNavbar(true);
  });
}

function toggleHiddenNavbar(hideOnly) {
  if (hiddenNavbarShowing) {
    $('#hidden-navbar').css('display', 'none');
    $('#navbar-dimmer').css('display', 'none');
    $('#navbar-toggle-button-closed').css('display', 'inline');
    $('#navbar-toggle-button-open').css('display', 'none');
  } else {
    $('#hidden-navbar').css('display', 'block');
    $('#navbar-dimmer').css('display', 'block');
    $('#navbar-toggle-button-open').css('display', 'inline');
    $('#navbar-toggle-button-closed').css('display', 'none');
  }
  hiddenNavbarShowing = !hiddenNavbarShowing;
}


function navbarLoad(index) {
  if(index == 0) {
   // $('#navbar').css('display', 'none');
  } else {
    $('body').append($('#navbar'));
    $('#navbar').css('height', '100%');
    $('#navbar').css('display', 'initial');
  }
}

function navbarTransition(index, nextIndex) {
  // 0 -> + : fixed to next section
  // + -> + : fixed to window
  // + -> 0 : fixed to current section
  // height is tricky since Firefox
  /*if(index == 0) {
    $('#page-' + allPages[nextIndex]).parent().append($('#navbar'));
    $('#navbar').css('height', $('#page-' + allPages[nextIndex]).height());
  } else if(nextIndex == 0) {
    $('#page-' + allPages[index]).parent().append($('#navbar'));
    $('#navbar').css('height', $('#page-' + allPages[index]).height());
  } else {
  */
    $('body').append($('#navbar'));
    $('#navbar').css('height', '100%');
  //}

  if(nextIndex != 0) {
    $('#navbar').css({display: 'initial'});
  }
}

function highlightLoad(index) {
  $(".navbar-entries li").removeClass("highlighted").removeClass("selected");
  $(".navbar-submenu li").removeClass("highlighted").removeClass("selected");
  if(index == 0) {
    return;
  }

  var parent = parentMap[index];
  var parentSelector = $(".navbar-" + allPages[parent]).parent().addClass("highlighted");
  if(index == parent) {
    parentSelector.addClass("selected");
  } else {
    $(".navbar-" + allPages[index]).addClass("selected");
  }
}
