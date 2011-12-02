(function($) {
    var initLayout = function($container, options) {
        var $current,
            $previous,
            params;

        $sections = $container.find('.section');

        var settings = {
            animate: true,
            direction: 'left',
            easing: 'linear',
            duration: 200,
            offset: 0
        };

        $.extend(settings, options);

        var updateViewportLayout = function() {
            // Scroll container height
            var content = $current.find('.content');
            var height = Math.max($(window).height(), content.outerHeight());
            $container[params.animate ? 'animate' : 'css']({ height: height }, params.duration, params.easing);

            // Section height to window height
            $sections.css({
                width: $container.width(),
                height: $(window).height()
            });
        };

        $sections.scroll(function(e) {
            e.preventDefault();
        });

        $(window).resize(function() {
            params.animate = false;
            updateViewportLayout();
        });

        var updateSectionLayout = function() {
            var p = params;

            var dir = p.direction;
            var dirHorizontal = dir === 'left' || dir === 'right';

            var css = {
                prev: {
                    from: {},
                    to: {
                        left: dirHorizontal ? (dir === 'left'   ? (-100+p.offset)+'%' : (100-p.offset)+'%') : '0%',
                        top: !dirHorizontal ? (dir === 'up'     ? (-100+p.offset)+'%' : (100-p.offset)+'%') : '0%'
                    }
                },
                next: {
                    from: p.back ? {} : {
                        left: dirHorizontal ? (dir === 'left'   ? '100%' : '-100%') : '0%',
                        top: !dirHorizontal ? (dir === 'up'     ? '100%' : '-100%') : '0%'
                    },
                    to: {
                        left: dirHorizontal ? (dir === 'left'   ? p.offset+'%' : -p.offset+'%') : '0%',
                        top: !dirHorizontal ? (dir === 'up'     ? p.offset+'%' : -p.offset+'%') : '0%'
                    }
                }
            };

            $previous.stop().css(css.prev.from)[p.animate ? 'animate' : 'css'](css.prev.to, p.duration, p.easing);
            $current.stop().css(css.next.from)[p.animate ? 'animate' : 'css'](css.next.to, p.duration, p.easing);

            updateViewportLayout();
        };

        var setSection = function($section, options) {
            if($sections.filter('.current').get(0) === $section.get(0)) { return; }

            params = $.extend({}, settings, options);
            params.back = $previous && $previous.get(0) === $section.get(0);

            $previous = $sections.filter('.current').addClass('previous').removeClass('current').trigger('deactivate');
            $current = $section.addClass('current').trigger('activate');

            updateSectionLayout();
        };

        var setOffset = function(offset) {
            params.offset = offset;
            params.animate = false;
            updateSectionLayout();
        };

        return {
            setSection: setSection,
            setOffset: setOffset
        };
    };




    $(function() {
        var layout = initLayout($('.scroll-container'));

        var home = $('.home.section');
        var scores = $('.scores.section');

        var getScoreOffset = function() {
            var homeMargin = ($(window).width() - 980) * 0.5 + 200;
            var homeMarginPercent = (homeMargin / $(window).width()) * 100;
            var offset = homeMarginPercent;
            return parseFloat(offset.toFixed(2));
        };

        scores.on('activate', function() {
            $(window).on('resize.scoreOffset', function() {
                layout.setOffset(getScoreOffset());
            });
        });

        scores.on('deactivate', function() {
            $(window).off('resize.scoreOffset');
        });

        $('.home.section').click(function() {
           layout.setSection($('.scores.section'), { offset: getScoreOffset() });
        });

        $('.scores.section').click(function() {
           layout.setSection($('.home.section'), { direction: 'right' });
        });

        layout.setSection($('.home.section'), { animate: false });
    });
})(jQuery);