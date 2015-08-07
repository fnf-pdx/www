function onScroll_fn() {
    var siteWindow = $( window ),
        siteHeader = $( ".js-navbar" )

    siteWindow.scroll(function() {
        if ( siteWindow.scrollTop() == 0) {
            siteHeader.removeClass( "scrollNav" );
        } else {
            siteHeader.addClass( "scrollNav");
        }
    });
}

/* Thanks to CSS Tricks for pointing out this bit of jQuery
http://css-tricks.com/equal-height-blocks-in-rows/
It's been modified into a function called at page load and then each time the page is resized. One large modification was to remove the set height before each new calculation. */

equalheight = function(container){

var currentTallest = 0,
     currentRowStart = 0,
     rowDivs = new Array(),
     $el,
     topPosition = 0;
 $(container).each(function() {

   $el = $(this);
   $($el).height('auto')
   topPostion = $el.position().top;

   if (currentRowStart != topPostion) {
     for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
       rowDivs[currentDiv].height(currentTallest);
     }
     rowDivs.length = 0; // empty the array
     currentRowStart = topPostion;
     currentTallest = $el.height();
     rowDivs.push($el);
   } else {
     rowDivs.push($el);
     currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
  }
   for (currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
     rowDivs[currentDiv].height(currentTallest);
   }
 });
}

$(window).load(function() {
  equalheight('.skill');
});

$(window).resize(function(){
  equalheight('.skill');
});


$( function() {
    // init controller
    var controller = new ScrollMagic.Controller();

    // change behaviour of controller to animate scroll instead of jump
    controller.scrollTo(function (newpos) {
        TweenMax.to(window, 0.5, {scrollTo: {y: newpos}});
    });

    //  bind scroll to anchor links
    $(document).on("click", "a[href^='#']", function (e) {
        var id = $(this).attr("href");
        if ($(id).length > 0) {
            e.preventDefault();

            // trigger scroll
            controller.scrollTo(id);

                // if supported by the browser we can even update the URL.
            if (window.history && window.history.pushState) {
                history.pushState("", document.title, id);
            }
        }
    });

    var skillTween1 = TweenMax.staggerFromTo('#animation-1', 1,
        {opacity: 0, scale: 0},
        {delay: 0, opacity: 1, scale: 1, ease: Back.easeOut});

    var skillTween2 = TweenMax.staggerFromTo('#animation-2', 1,
        {opacity: 0, scale: 0},
        {delay: .2, opacity: 1, scale: 1, ease: Back.easeOut});

    var skillTween3 = TweenMax.staggerFromTo('#animation-3', 1,
        {opacity: 0, scale: 0},
        {delay: .4, opacity: 1, scale: 1, ease: Back.easeOut});


    // build scene
    var scene = new ScrollMagic.Scene({triggerElement: ".js-triggerSkillAnimation"})
        .setTween(skillTween1)
        .addTo(controller);

    var scene = new ScrollMagic.Scene({triggerElement: ".js-triggerSkillAnimation"})
        .setTween(skillTween2)
        .addTo(controller);

    var scene = new ScrollMagic.Scene({triggerElement: ".js-triggerSkillAnimation"})
        .setTween(skillTween3)
        .addTo(controller);


    onScroll_fn();

});





