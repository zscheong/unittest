(function($) {
    /****************************
     * 
     * Item Parameters
     * seq: compulsory, int
     * hasThumbnail: optional, bool
     * hasCaption: optional, bool
     *
     ******************************/

    SliderWidget = function(template) {
        this.template = template;
        this.GetBuildFn = function() {
            return SliderWidgetEngine[this.template];
        };
    };
    var methods = {
        PreProcess: function($scope, $element) {
                //Parse Item Data and Move Items to its Container
                var temp = $element.find('[name="slider-transclude"]');
                var itemList = temp.find("[name='item']");
                var container = $element.find("[name='slider-container'] > .slider-content-container");
                var hasThumb = $scope.options.hasThumb;
                
                //sort the item base on seq
                $.each(itemList, function(i,v) {
                    var itemData = $(v).data();
                    var seq = itemData["seq"];
                    $scope.options.items[seq] = itemData;
                });
                $.each($scope.options.items, function(i,v) {
                    var content = "<div><img src='" + v.src + "'/>";
                    if(hasThumb) { content += "<div u='thumb'>" + v.thumb + "</div>" }
                    content += "</div>";
                    container.append(content);
                });
                
                temp.remove();
                
                var arrowLeft = $element.find(".slider-arrow-left");
                arrowLeft.css({width: "55px", height: "55px", top: "123px", left: "8px"});
                var arrowRight = $element.find(".slider-arrow-right");
                arrowRight.css({width: "55px", height: "55px", top: "123px", right: "8px"});
        }
    };
    var _SlideshowTransitions = [
        //Fade in R
        {
            $Duration: 1200, 
            $During: { $Left: [0.3, 0.7] }, 
            $FlyDirection: 2, 
            $Easing: { 
                $Left: $JssorEasing$.$EaseInCubic, 
                $Opacity: $JssorEasing$.$EaseLinear 
            }, 
            $ScaleHorizontal: 0.3, 
            $Opacity: 2 
        },
        //Fade out L
        { 
            $Duration: 1200, 
            $SlideOut: true, 
            $FlyDirection: 1, 
            $Easing: { 
                $Left: $JssorEasing$.$EaseInCubic, 
                $Opacity: $JssorEasing$.$EaseLinear 
            }, 
            $ScaleHorizontal: 0.3, 
            $Opacity: 2 
        }
    ];
    var options = {
        $AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
        $AutoPlaySteps: 1,                                  //[Optional] Steps to go for each navigation request (this options applys only when slideshow disabled), the default value is 1
        $AutoPlayInterval: 4000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
        $PauseOnHover: 1,                               //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, default value is 1

        $ArrowKeyNavigation: true,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
        $SlideDuration: 500,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
        $MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
        //$SlideWidth: 600,                                 //[Optional] Width of every slide in pixels, default value is width of 'slides' container
        //$SlideHeight: 300,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
        $SlideSpacing: 0, 					                //[Optional] Space between each slide in pixels, default value is 0
        $DisplayPieces: 1,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
        $ParkingPosition: 0,                                //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
        $UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
        $PlayOrientation: 1,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
        $DragOrientation: 3,      
                
        $SlideshowOptions: {                                //[Optional] Options to specify and enable slideshow or not
            $Class: $JssorSlideshowRunner$,                 //[Required] Class to create instance of slideshow
            $Transitions: _SlideshowTransitions,            //[Required] An array of slideshow transitions to play slideshow
            $TransitionsOrder: 1,                           //[Optional] The way to choose transition to play slide, 1 Sequence, 0 Random
            $ShowLink: true                                    //[Optional] Whether to bring slide link on top of the slider when slideshow is running, default value is false
        },
        $BulletNavigatorOptions: {                                //[Optional] Options to specify and enable navigator or not
            $Class: $JssorBulletNavigator$,                       //[Required] Class to create navigator instance
            $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
            $Lanes: 1,                                      //[Optional] Specify lanes to arrange items, default value is 1
            $SpacingX: 10,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
            $SpacingY: 10                                    //[Optional] Vertical space between each item in pixel, default value is 0
        },
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
            $ChanceToShow: 2,                                //[Required] 0 Never, 1 Mouse Over, 2 Always
            $AutoCenter: 2                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
        }
    };
    var thumbOptions = {
        $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
        $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
        $ActionMode: 0,                                 //[Optional] 0 None, 1 act by click, 2 act by mouse hover, 3 both, default value is 1
        $DisableDrag: true                              //[Optional] Disable drag or not, default value is false
    };
    var SliderWidgetEngine = {
        'default': {
            PreBuild: function($scope, $element) {
                methods.PreProcess($scope, $element);
            },
            Build: function($scope, $element) {
                if($scope.options.hasThumb) {
                    options["$ThumbnailNavigatorOptions"] = thumbOptions;
                }
                var jssor_slider = new $JssorSlider$("slider-container", options);
            },
            PostBuild: function($scope, $element) {}
        }
    };
})(jQuery);
