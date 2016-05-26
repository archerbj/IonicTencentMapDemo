angular.module('starter.directives', [])

.directive('qqMap', function($timeout, $ionicPopup, Notification) {
    var host = location.href.split('#')[0].split('?')[0];

    function addControl(container, style) {
        var control = document.createElement("div");
        control.style.left = style.left + "px";
        control.style.top = style.top + "px";
        control.style.position = "relative";
        control.style.width = "36px";
        control.style.height = "36px";
        control.style.zIndex = "100000";
        control.innerHTML = '<img src="img/map/2.png" />';
        container.appendChild(control);
        return control;
    }

    function link(scope, element, attrs) {
        function _init_map(location) {
            init_map(scope, element, attrs, location);
        }

        Notification.show('加载中...');
        $timeout(function() {
            var location = {
                lat: 39.916527,
                lng: 116.397128
            }
            Notification('hide');
            if (location && location.lat) {
                _init_map(location);
                return;
            }

        }, 2000);
    }

    function init_map(scope, element, attrs, location) {
        var $wrap = element.parent().parent();
        var $element = angular.element(element);
        var container = $element.get(0);
        var width = $wrap.width();
        // var height = $wrap.height() - 44 - 49;
        var height = $wrap.height();
        center = new qq.maps.LatLng(location.lat, location.lng);

        $element.width(width);
        $element.height(height);

        map = new qq.maps.Map(container, {
            center: center,
            zoom: 13,
            zoomControl: true,
            mapTypeControl: false
        });

        var circle = new qq.maps.Circle({
            map: map,
            center: center,
            radius: 3000
        });

        qq.maps.event.addListener(map, 'center_changed', center_changed);

        function center_changed() {
            var latLng = map.getCenter();
            geocoder.getAddress(latLng);
        }
        var geocoder = new qq.maps.Geocoder({
            complete: function(result) {
                $timeout(function() {
                    var c = result.detail.addressComponents;
                    var full_address = c.country + c.province + c.city + c.district + c.street + c.streetNumber + c.town + c.village;
                    // var address = c.streetNumber;
                    // if(!address) {
                    //     address =  c.town + c.village;
                    // }
                    var address = c.district + c.street + c.streetNumber;

                    var location = {};
                    location.api_address = full_address;
                    location.user_edit_address = address;
                    location.lat = result.detail.location.lat;
                    location.lng = result.detail.location.lng;

                    var newCenter = new qq.maps.LatLng(location.lat, location.lng);
                    circle.setCenter(newCenter);
                })
            }
        });
        center_changed();

        // add reset control
        var style = {
            left: 60,
            top: height - 66,
            iconName: '6.png'
        };
        var resetControl = addControl(container, style);
        qq.maps.event.addListener(resetControl, 'click', function() {
            map.panTo(center);
        });

    }

    return {
        scope: {
            state: '=',
            topics: "=*"
        },
        link: link
    };
});
