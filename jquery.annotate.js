//http://www.vfstech.com/?p=79
(function() {jQuery.fn['bounds'] = function () {
    var bounds = {
        left: Number.POSITIVE_INFINITY,
        top: Number.POSITIVE_INFINITY,
        right: Number.NEGATIVE_INFINITY,
        bottom: Number.NEGATIVE_INFINITY,
        width: Number.NaN,
        height: Number.NaN
    };

    this.each(function (i,el) {
        var elQ = $(el);
        var off = elQ.offset();
        off.right = off.left + $(elQ).width();
        off.bottom = off.top + $(elQ).height();

        if (off.left < bounds.left)
        bounds.left = off.left;

        if (off.top < bounds.top)
        bounds.top = off.top;

        if (off.right > bounds.right)
        bounds.right = off.right;

        if (off.bottom > bounds.bottom)
        bounds.bottom = off.bottom;
    });

    bounds.width = bounds.right - bounds.left;
    bounds.height = bounds.bottom - bounds.top;
    return bounds;
}})();

(function($){
		var methods = {
			'init': function(options){
				var t = $(this),
                    data = t.data('annotate');					
                    
                if ( ! data ){
                    var settings = {
						add: '', 
						tpl: '',
						container: t,
						dblclick: false,
						confirmDelete: 'Are you sure?',
                        opt_draggable: {containment: 'parent', stack: '.annotate'},
						opt_resizable: {start:function(){$(this).annotate('front');}, maxWidth: 200, maxHeight: 250, minHeight: 100, minWidth:100, autoHide: true, containment: 'parent'}
                    };
                    if(options) {
                        data = $.extend(settings, options);
                    }
                    $(this).data('annotate', settings);
                }
                data = $(this).data('annotate');
								
				tpl = $(data.tpl);
				t.droppable({accept:'.annotate'});
				if("undefined" != typeof(data.add)){
					$(data.add).click(function(e){
						t.annotate('add');
					});
				}
				if(data.dblclick){
					t.dblclick(function(e){
						$(this).annotate('add', {top:e.pageY, left:e.pageX});
					});
				}
			},
			'add': function(options){
				var data = $(this).data('annotate');
				var clone = $(data.tpl).clone();
				clone.attr('id', '').appendTo(data.container);
				clone.draggable(data.opt_draggable);
				clone.resizable(data.opt_resizable);
				clone.addClass('annotate-note');
				
				if("undefined" == typeof(options)){
					var options = {};
				};
				if("undefined" == typeof(options.top)) options.top = 0;
				if("undefined" == typeof(options.bottom)) options.bottom = 0;
				
				clone.css({'top':options.top, 'left':options.left});
				
				if(options.content) clone.find('textarea').val(options.content);
				if(options.height) clone.css('height', options.height);
				if(options.width) clone.css('width', options.width);
				if(options.zIndex) clone.css('z-index', options.zIndex);
				
				clone.find('a.annotate-close').click(function(){
				    if($(this).parents('.annotate').find('textarea').val() == '' || !data.confirmDelete || ( data.confirmDelete && confirm(data.confirmDelete)) ){
				        $(this).parents('.annotate').remove();   
				    }
				});
				clone.hover(function(){$(this).find('.annotate-close').css('display', 'inline'); },
				    function(){$(this).find('.annotate-close').css('display', 'none'); });
                clone.click(function(){
                    $(this).annotate('front');
                });               
				
			},
			'front':function(){
			    $('.annotate').css({'z-index':1});
                $(this).css({'z-index':100});
			},
			'serialize':function(){
			    var sdata = [];
			    $('.annotate-note').each(function(){
			        var a = $(this);
			        var bounds = a.bounds();
			        bounds.content = a.find('textarea').val();
			        bounds.zIndex = a.css('z-index');
    		        sdata.push(bounds);
			    });
			    return sdata;
			},
			'load':function(sdata){
			    var t = $(this);
			    $.each(sdata, function(){
			        t.annotate('add', this);
			    });
			},
			'reset':function(){
			    var data = $(this).data('annotate');
			    $(data.container).find('.annotate').remove();
			}
		
			
		}
		
		$.fn.annotate = function(method){
			if ( methods[method] ) {
			  return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
			  return methods.init.apply( this, arguments );
			} else {
			  if(console.log) console.log( 'Method ' +  method + ' does not exist on jQuery.annotate' );
			}
			
			return this;
			
		};
		
	})(jQuery);