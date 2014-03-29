/*global jQuery */

(function ($) {
    'use strict';

    $(window).on('scroll', function () {
        var elems = [],
            scrollTop = $(document).scrollTop(),
            viewportHeight = $(window).height();

        $.each($.cache, function () {
            if (this.events && this.events.inview) {
                elems.push(this.handle.elem);
            }
        });

        if (elems.length) {
            $(elems).each(function () {
                var $this = $(this),
                    height = $this.height(),
                    top = $this.offset().top,
                    inview = $this.data('inview') || false;

                if ((scrollTop + viewportHeight) < top || scrollTop > (top + height)) {
                    if (inview) {
                        $this.data('inview', false);
                        $this.trigger('inview', [false]);
                    }
                } else if (scrollTop < (top + height)) {
                    if (!inview) {
                        $this.data('inview', true);
                        $this.data('inview-data', {height: height, top: top, viewportHeight: viewportHeight});
                        $this.trigger('inview', [true]);
                    }
                }
            });
        }
    });

    $(function () {
        $(window).trigger('scroll');
    });
}(jQuery));


/* **********************************************
     Begin main.js
********************************************** */

/*global $ */

function validateEmail(email) {
    'use strict';
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var TNW = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

    core: {
        emailSignup: function (e) {
            'use strict';
            e.preventDefault();

            var $form = $(this),
                data = $form.serialize(),
                email = $form.find('input[name="email"]').first().val(),
                xhr;

            if (validateEmail(email)) {
                // Submit data
                xhr = $.post($form.attr('action'), data, 'json');
                $('button[type="submit"]', $form).attr('disabled', true);

                // Send subscriber to MailChimp
                $.when(xhr).then(function (data) {
                    if (data.success) {
                        alert('Thank you!');
                        $('button[type="submit"]', $form).removeAttr('disabled');
                    } else {
                        alert('Something failed. Please try again.');
                    }
                });
            } else {
                alert('Invalid email address. Please try again.');
            }
        }
    },

    nav: {
        duration: 300,

        init: function () {
            'use strict';
            $('#nav-toggle').on('click', TNW.nav.onToggle);
            $('#menu .has-sub > a').on('click', TNW.nav.onExpand);

            $(document).on('mediaquerychange', function (e, mq) {
                if (['m', 'l', 'xl'].indexOf(mq) !== -1) {
                    // Remove expanded state when not on mobile/tablet
                    $('#menu').find('li').removeClass('expanded');
                }
            });

            $(window).on('scroll', function () {
                $('#top')[($(window).scrollTop() > $(window).height() && !TNW.isMobile) ? 'addClass' : 'removeClass']('shrink');
            });
        },

        initScroll: function () {
            'use strict';
            var menuHeight = $('#menu').outerHeight(),
                topHeight = $('#top').outerHeight(),
                viewportHeight = $(window).height();

            if (topHeight > viewportHeight) {
                $('#menu').addClass('scroll').height(viewportHeight - (topHeight - menuHeight));
            } else {
                $('#menu').removeClass('scroll').height('auto');
            }
        },

        onExpand: function (e) {
            'use strict';
            e.preventDefault();
            var $li = $(this).closest('li'),
                $ul = $(this).siblings('ul').first(),
                isExpanded = $ul.is(':visible');

            if (['xs', 's', 'm'].indexOf($(document).getMediaQuery()) !== -1) {
                // Collapse previous
                $li.siblings('.has-sub.expanded').removeClass('expanded').children('ul').slideUp(TNW.nav.duration, TNW.nav.initScroll);

                // Expand current
                $li[isExpanded ? 'removeClass' : 'addClass']('expanded');
                $ul[isExpanded ? 'slideUp' : 'slideDown'](TNW.nav.duration, TNW.nav.initScroll);
            }
        },

        onToggle: function (e) {
            'use strict';
            e.preventDefault();
            $(this).toggleClass('active');
            $('#menu')[$(this).is('.active') ? 'slideDown' : 'slideUp'](TNW.nav.duration, function () {
                TNW.nav.initScroll();

                // Collapse all sub-menus
                if ($(this).not(':visible')) {
                    $(this).find('.has-sub').removeClass('expanded').find('ul').hide();
                }
            });
        }
    }
};

/* **********************************************
     Begin jquery.mediaquerychange.js
********************************************** */

/*global jQuery */

/*
 * jquery.mediaquerychange.js
 * https://github.com/oscaralexander/mediaquerychange
 * Copyright (c) 2013, The Next Web - Alexander Griffioen <alexander@thenextweb.com>
 *
 * License: GPL v3
 */

(function ($) {
    'use strict';

    var currentMediaQuery = null;

    function getMediaQuery() {
        // Read content attribute of body::after pseudo-selector
        var mediaQuery = window.getComputedStyle(document.body, ':after').getPropertyValue('content');

        // Strip quotes (IE)
        if (mediaQuery.charAt(0) === '"') {
            mediaQuery = mediaQuery.substring(1, mediaQuery.length - 1);
        }

        return mediaQuery;
    }

    function onResize() {
        var mediaQuery = getMediaQuery();

        if (mediaQuery !== currentMediaQuery) {
            // Fire event if media query has changed
            $(document).trigger('mediaquerychange', [mediaQuery]);

            // Update current media query
            currentMediaQuery = mediaQuery;
        }
    }

    $.fn.getMediaQuery = function () {
        return getMediaQuery() || null;
    };

    $(function () {
        $(window).on('resize', onResize).trigger('resize');
    });
}(jQuery));



/* **********************************************
     Begin jquery.tnwparallax.js
********************************************** */

/*global jQuery */

/*!
 * TNW Parallax
 * Copyright (c) The Next Web, 2013
 * @author Alexander Griffioen <alexander@thenextweb.com>
 * @version 1.0
 */
(function ($) {
    'use strict';

    var defaults = {
            maxHeight: 1.5,
            offsetTop: 66
        },
        pluginName = 'tnwParallax';

    function TNWParallax(element, options) {
        this.$element = $(element);
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    TNWParallax.prototype = {
        $layers: [],
        height: 0,
        numLayers: 0,

        init: function () {
            // Scale layers
            this.$layers = this.$element.children();
            this.increment = (this.options.maxHeight - 1) / this.$layers.length;
            this.numLayers = this.$layers.length;

            // Init visuals
            this.$layers.each(function () {
                var repeat, size;

                if ($(this).hasClass('visual')) {
                    if ($(this).attr('data-parallax-src')) {
                        repeat = $(this).attr('data-parallax-repeat') || 'auto';
                        size = $(this).attr('data-parallax-repeat') ? 'auto' : 'cover';

                        $(this).css({
                            backgroundImage: 'url(' + $(this).attr('data-parallax-src') + ')',
                            backgroundRepeat: repeat,
                            backgroundSize: size
                        });
                    }
                }
            });

            // Toggle .inview class
            this.$element.on('inview', function (e, inview) {
                $(e.currentTarget)[inview ? 'addClass' : 'removeClass']('inview');
            });

            // Set resize handler
            $(window).on('resize', {scope: this}, this.onResize).trigger('resize');
            // this.onResize({data: {scope: this}});

            // Only do parallax stuff on desktop devices
            if (!$('html').hasClass('touch')) {
                $(window).on('scroll', {scope: this}, this.onScroll).trigger('scroll');
            }
        },

        onResize: function (e) {
            var that = e.data.scope;
            that.height = $(window).height();

            // Set height
            if (that.options.height) {
                if (that.options.height < 1) {
                    that.height = $(window).height() * that.options.height;
                } else {
                    that.height = that.options.height;
                }
            }

            // Scale container
            that.$element.height(that.height);

            // Scale layers
            $(that.$layers.get().reverse()).each(function (i) {
                var $content,
                    $contentInner,
                    contentHeight,
                    layerHeight;

                layerHeight = Math.floor(100 + (100 * (that.increment * i)));
                $(this).height(layerHeight + '%');

                if ($(this).hasClass('content')) {
                    $content = $(this);
                    $contentInner = $content.children('.inner').first();

                    if ($contentInner.length) {
                        contentHeight = $contentInner.outerHeight();

                        if ((contentHeight + that.options.offsetTop) > that.height) {
                            that.height = contentHeight + that.options.offsetTop;
                            that.$element.height(that.height);
                            $content.height('100%');
                            $contentInner.css({'margin-top': that.options.offsetTop});
                        } else {
                            $contentInner.css({'margin-top': ((($content.height() - that.options.offsetTop) - contentHeight) * 0.5) + that.options.offsetTop});
                        }
                    }
                }
            });
        },

        onScroll: function (e) {
            var data,
                multiplier,
                that = e.data.scope,
                translateY;

            if (that.$element.hasClass('inview')) {
                data = that.$element.data('inview-data');
                multiplier = $(document).scrollTop() / (data.top + data.height);

                that.$element.children().each(function () {
                    if (that.options.invert) {
                        multiplier = -multiplier;
                    }

                    translateY = Math.round((that.height - $(this).height()) * multiplier);

                    $(this).css({
                        '-webkit-transform': 'translate(0, ' + translateY + 'px)',
                        '-moz-transform': 'translate(0, ' + translateY + 'px)',
                        '-ms-transform': 'translate(0, ' + translateY + 'px)',
                        'transform': 'translate(0, ' + translateY + 'px)'
                    });
                });
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new TNWParallax(this, options));
            }
        });
    };
}(jQuery));


/* **********************************************
     Begin jquery.mediaquerychange.js
********************************************** */

/*global jQuery */

/*
 * jquery.mediaquerychange.js
 * https://github.com/oscaralexander/mediaquerychange
 * Copyright (c) 2013, The Next Web - Alexander Griffioen <alexander@thenextweb.com>
 *
 * License: GPL v3
 */

(function ($) {
    'use strict';

    var currentMediaQuery = null;

    function getMediaQuery() {
        // Read content attribute of body::after pseudo-selector
        var mediaQuery = window.getComputedStyle(document.body, ':after').getPropertyValue('content');

        // Strip quotes (IE)
        if (mediaQuery.charAt(0) === '"') {
            mediaQuery = mediaQuery.substring(1, mediaQuery.length - 1);
        }

        return mediaQuery;
    }

    function onResize() {
        var mediaQuery = getMediaQuery();

        if (mediaQuery !== currentMediaQuery) {
            // Fire event if media query has changed
            $(document).trigger('mediaquerychange', [mediaQuery]);

            // Update current media query
            currentMediaQuery = mediaQuery;
        }
    }

    $.fn.getMediaQuery = function () {
        return getMediaQuery() || null;
    };

    $(function () {
        $(window).on('resize', onResize).trigger('resize');
    });
}(jQuery));


/* **********************************************
     Begin jquery.tnwgallery.js
********************************************** */

/*globals jQuery */

/*!
 * TNW Tabs
 * Copyright (c) The Next Web, 2014
 * @author Alexander Griffioen <alexander@thenextweb.com>
 * @version 1.0
 */
(function ($) {
    'use strict';

    var defaults = {
            inertia: 0.02
        },
        pluginName = 'tnwGallery';

    function TNWGallery(element, options) {
        this.$element = $(element);
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    TNWGallery.prototype = {
        $ul: null,
        interval: null,
        numItems: 0,
        stop: true,
        viewportWidth: $(window).width(),
        width: 0,
        xCurrent: 0,
        xTo: 0,

        init: function () {
            this.$ul = this.$element.children('ul').first();
            this.numItems = this.$ul.children().length;
            $(window).on('resize', {scope: this}, this.onResize).trigger('resize');
            this.initMouseEvents();
        },

        initMouseEvents: function () {
            this.$element.on('mouseenter', {scope: this}, this.onMouseEnter);
            this.$element.on('mouseleave', {scope: this}, this.onMouseLeave);
        },

        move: function () {
            this.xCurrent += ((this.xTo - this.xCurrent) * this.options.inertia);
            this.position(this.xCurrent);

            if (this.stop && (Math.abs(this.xTo - this.xCurrent) < 1)) {
                if (this.interval) {
                    clearInterval(this.interval);
                }
            }
        },

        onResize: function (e) {
            var that = e.data.scope;

            that.viewportWidth = $(window).width();
            that.width = 0;

            that.$ul.children().each(function () {
                that.width += $(this).outerWidth(true);
            });

            that.$ul.width(that.width);
            that.width += parseInt(that.$ul.css('padding-left'), 10) + parseInt(that.$ul.css('padding-right'), 10);
            that.position((that.viewportWidth - that.width) * 0.5);
        },

        onMouseEnter: function (e) {
            var that = e.data.scope;

            if (that.width > that.viewportWidth) {
                that.$element.on('mousemove', {scope: that}, that.onMouseMove);
                that.stop = false;
                that.interval = setInterval(function () {
                    that.move();
                }, 0);
            }
        },

        onMouseLeave: function (e) {
            var that = e.data.scope;

            if (that.width > that.viewportWidth) {
                that.$element.off('mousemove');
                that.stop = true;
            }
        },

        onMouseMove: function (e) {
            var that = e.data.scope;
            that.xTo = (that.viewportWidth - that.width) * (e.pageX / that.viewportWidth);
        },

        position: function (x) {
            if ($('html').hasClass('touch')) {
                this.$element.scrollLeft(-x);
            } else {
                this.$ul.css({
                    '-webkit-transform': 'translateX(' + x + 'px)',
                    '-moz-transform': 'translateX(' + x + 'px)',
                    '-ms-transform': 'translateX(' + x + 'px)',
                    'transform': 'translateX(' + x + 'px)'
                });
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new TNWGallery(this, options));
            }
        });
    };
}(jQuery));



$(function () {
    'use strict';
    // Init parallax sections
    // 
    TNW.nav.init();

    $('#home').tnwParallax();
    $(window).trigger('resize');
    setTimeout(function(){
        $(window).trigger('resize');
    }, 100);
   //  $('#header-sub').tnwParallax({height: 0.5});
    //  
    $('.tnw-gallery').tnwGallery();


    $('.tnw-gallery a').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true,
            preload: [1, 1]
        }
    });

    $('#pop-video').magnificPopup({
        type: 'iframe'
    }); 

});