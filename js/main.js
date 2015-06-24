'use strict'

var pages = [
  { name: 'splash', subpages: [] },
  { name: 'about', subpages: [] }, 
  { name: 'location', subpages: [] },
  { name: 'rush',  subpages: ['schedule'] },
  { name: 'house',  subpages: [] },
  { name: 'brothers',  subpages: ['seniors', 'juniors', 'sophomores', 'graduates'] },
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

$(document).ready(function() {
  $('#fullpage').fullpage({
      afterLoad: afterLoad,
      onLeave: onLeave,
      anchors: allPages,
      slidesNavigation: true,
      slidesNavPosition: 'bottom',
      animateAnchor: false
  });

  for(var i = 0; i < allPages.length; i++) {
    var page = allPages[i];
    console.log(page);
    $('#sidebar-' + page).click((function(p) {
      window.location = '#' + p;
    }).bind(this, page));
  }
});

function afterLoad(anchorLink, index) {
  index--;
  console.log(anchorLink, index);

  sidebarLoad(index);
  highlightLoad(index);
}

function onLeave(index, nextIndex, direction) {
  index--;
  nextIndex--;
  console.log(index, nextIndex, direction);

  sidebarTransition(index, nextIndex);
  highlightLoad(nextIndex);
}

function sidebarLoad(index) {
  if(index == 0) {
    $('#sidebar').css('display', 'none');
  } else {
    $('body').append($('#sidebar'));
    $('#sidebar').css('height', '100%');
    $('#sidebar').css('display', 'initial');
  }
}

function sidebarTransition(index, nextIndex) {
  // 0 -> + : fixed to next section
  // + -> + : fixed to window
  // + -> 0 : fixed to current section
  // height is tricky since Firefox
  if(index == 0) {
    $('#page-' + allPages[nextIndex]).parent().append($('#sidebar'));
    $('#sidebar').css('height', $('#page-' + allPages[nextIndex]).height());
  } else if(nextIndex == 0) {
    $('#page-' + allPages[index]).parent().append($('#sidebar'));
    $('#sidebar').css('height', $('#page-' + allPages[index]).height());
  } else {
    $('body').append($('#sidebar'));
    $('#sidebar').css('height', '100%');
  }

  if(nextIndex != 0) {
    $('#sidebar').css({display: 'initial'});
  }
}

function highlightLoad(index) {
  $("#sidebar-entries li").removeClass("highlighted").removeClass("selected");
  $(".sidebar-submenu li").removeClass("highlighted").removeClass("selected");
  if(index == 0) {
    return;
  }

  var parent = parentMap[index];
  var parentSelector = $("#sidebar-" + allPages[parent]).parent().addClass("highlighted");
  if(index == parent) {
    parentSelector.addClass("selected");
  } else {
    $("#sidebar-" + allPages[index]).addClass("selected");
  }
}
