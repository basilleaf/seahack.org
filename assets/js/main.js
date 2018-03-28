$(function() {

  // adjusts font for project titles that are too big for their circles
  sh.adjustGridfonts();

  // makes entire grid box clickable (sans js only circle is clickable)
  $('.project-grid').on("click", '.box-content', function(e) {
    var url = $(this).find('a').attr('href');
    if (!e.metaKey) {
      window.location.href = url;
    } else {
      window.open(url);  // user is command clicking, open in new tab/window
    }
  });

  // infinite scroll lazy loading on homepage
  $('.project-grid').jscroll({
    nextSelector: 'a.next:last',
    padding:350,
    loadingHtml:'',
    callback: function() {
      $('a.next').remove();  // it was getting confused
      sh.adjustGridfonts();  // adjusts newly loaded project titles that are too big for their circles
    }
  });

  // handle the scroll-to-stick header behavior
  sh.scrollToStickHeader();

}); // on page load


var sh = {

  header_is_fixed: false,

  isPositionSticky: function(selector){
      // does this browser support position: sticky
      // via https://github.com/bigspotteddog/ScrollToFixed/issues/100
      return ($.inArray($(selector).css('position'), ['-webkit-sticky', '-moz-sticky', '-ms-sticky', '-o-sticky', 'sticky']) != -1);
  },

  getScrollTop: function() {
      scrolltop = $(document).scrollTop();
      return scrolltop;
  },

  fixedHeaderstyle: function(scrolltop) {
    // when scroll top is 30px (50px position header minus 20px padding)
    // turn the background black, else transparent
    scrolltop = sh.getScrollTop();

    if (scrolltop > 29) {
      // page has scrolled so header we infer should be fixed
        if (!sh.header_is_fixed) {
          sh.header_is_fixed = true;
          $('header').addClass('black',300);

          if (!$('.mobile-indicator').is(':visible')) {
            $('.about').css('top','25px');
          }
        }
    } else  {
      // scroll is less than 30, header is released

        if (sh.header_is_fixed) {
          sh.header_is_fixed = false;
          $('header').removeClass('black');

          if (!$('.mobile-indicator').is(':visible')) {
            $('.about').css('top','15px');
          }
          
        }
      }
  },

  scrollToStickHeader: function() {

    $('.about').show();  // it's hidden b/c in chrome it needs a padding adjust

    if(sh.isPositionSticky('.header')) {
      // we can just use css position sticky yay!: just need to handle
      // extra styling on the header when it is fixed
      if ($('.tagline').is(':visible')) {
        // we are on the homepage

        window.setInterval(function() { sh.fixedHeaderstyle(); }, 100);

      } else {
        // this is not the hompeage, make the header stick to top
        $('header').addClass('black');
        $('header').css('marginTop', 0);
      }

    } else {
      // this browser does not suppoer position sticky,
      // init scrollToFixed plugin

      // first of all, do this for chome ¯\_(ツ)_/¯
      $('.about').css('top','35px').show(); // show only after top adjust

      $('.header').scrollToFixed({
          postFixed: function() {
            // fires when header is released
            $(this).css('margin-top', '-210px');
            $(this).css('background-color', 'transparent');
            $('.tagline').css('margin-top', '175px');
            $('.about').css('top','35px');
            dontSetWidth: true;
            marginTop:0;
            },
          preFixed: function() {
            // fires when header first becomes fixed
            $(this).css('margin-top', 0);
            $(this).animate({
              backgroundColor: "black",
            }, 300);
            $('.tagline').css('margin-top', '-35px');
            $('.about').css('top','25px');
            dontSetWidth: true
            marginTop:0;
          },
      }); // scrollToFixed init
    } // end else position sticky
  },

  adjustGridfonts: function() {
    // some projects have long titles and need a bit smaller
    // font when displayed in homepage grid circles
    if ($('.project-grid').length) {
      // do any of our homepage grid project titles need smaller font?

      // todo: this needs different sizes based on screen size
      //
      var needs_small = 23;  // if title larger than this then shrink its font
      var small_font = "1.4em";
      var small_font_mobile = "1.6em"
      var small_font_tablet = "1.1em"
      var small_font_lg_screen = "2.2em"  //////
      var small_font_xl_screen = "3.0em" //////

      var needs_med = 17;  // if title larger than this then shrink its font
      var med_font = "1.7em";
      var med_font_tablet = "1.3em"
      var med_font_lg_screen = "2.2em"  //////
      var med_font_xl_screen = "3.6em" //////

      for (var k in site_posts) {  /* found in head.html */

        title_slug = site_posts[k]['title_slug'];

        if (title_slug.length > needs_small) {
            // this project title is too long, make it use smaller font

          if ($('.mobile-indicator').is(':visible')) {
            $('.project-box .circle h2.' +  title_slug).css({"font-size": small_font_mobile});

          } else if ($('.tablet-indicator').is(':visible')) {
            $('.project-box .circle h2.' +  title_slug).css({"font-size": small_font_tablet});
          }

          else if ($('.xl-indicator').is(':visible')) {
            $('.project-box .circle h2.' +  title_slug).css({"font-size": small_font_xl_screen});
          }

          else if ($('.large-indicator').is(':visible')) {
            $('.project-box .circle h2.' +  title_slug).css({"font-size": small_font_lg_screen});

          } else {
            $('.project-box .circle h2.' +  title_slug).css({"font-size": small_font});
          }

        } else if (title_slug.length > needs_med) {
            // this project title is too long, make it use smaller font

          if ($('.mobile-indicator').is(':visible')) {
            continue;
          }
          else if ($('.tablet-indicator').is(':visible')) {
            $('.project-box .circle h2.' +  title_slug).css({"font-size": med_font_tablet});
          }
          else if ($('.xl-indicator').is(':visible')) {
            $('.project-box .circle h2.' +  title_slug).css({"font-size": med_font_xl_screen});
          }
          else if ($('.large-indicator').is(':visible')) {
            $('.project-box .circle h2.' +  title_slug).css({"font-size": med_font_lg_screen});
          } else {
            $('.project-box .circle h2.' +  title_slug).css({"font-size": med_font});
          }
        }

      } // for
    } // if
  },// method

}
