(function($) {
    var initLayout = function($sections, options) {
        var $previous, $current;

        var settings = {
            animate: true,
            direction: 'left',
            easing: 'linear',
            duration: 800,
            offset: 0
        };

        $.extend(settings, options);

        var setSection = function($section, options) {
            // Return if section is same
            if($sections.filter('.current').get(0) === $section.get(0)) { return; }

            var s = $.extend({}, settings, options);

            var dir = s.direction;
            var dirHorizontal = dir === 'left' || dir === 'right';

            var back = $previous && $previous.get(0) === $section.get(0);

            $previous = $sections.filter('.current').addClass('previous').removeClass('current');
            $current = $section.addClass('current');

            var css = {
                prev: {
                    from: {},
                    to: {
                        left: dirHorizontal ? (dir === 'left'   ? (-100+s.offset)+'%' : (100-s.offset)+'%') : '0%',
                        top: !dirHorizontal ? (dir === 'up'     ? (-100+s.offset)+'%' : (100-s.offset)+'%') : '0%'
                    }
                },
                next: {
                    from: back ? {} : {
                        left: dirHorizontal ? (dir === 'left'   ? '100%' : '-100%') : '0%',
                        top: !dirHorizontal ? (dir === 'up'     ? '100%' : '-100%') : '0%'
                    },
                    to: {
                        left: dirHorizontal ? (dir === 'left'   ? s.offset+'%' : -s.offset+'%') : '0%',
                        top: !dirHorizontal ? (dir === 'up'     ? s.offset+'%' : -s.offset+'%') : '0%'
                    }
                }
            };

            $previous.stop().css(css.prev.from)[s.animate ? 'animate' : 'css'](css.prev.to, s.duration, s.easing);
            $current.stop().css(css.next.from)[s.animate ? 'animate' : 'css'](css.next.to, s.duration, s.easing);
        };

        var setOffset = function(offset) {

        };

        return {
            setSection: setSection,
            setOffset: setOffset
        };
    };

    $(function() {
        var layout = initLayout($('.section'));

        layout.setSection($('.home.section'), { animate: false });

        $('.home.section').click(function() {
           layout.setSection($('.scores.section'), { offset: 20 });
        });

        $('.scores.section').click(function() {
           layout.setSection($('.home.section'), { direction: 'right' });
        });

        $(document).keyup(function() {
            layout.setOffset(40);
        });
    });
})(jQuery);