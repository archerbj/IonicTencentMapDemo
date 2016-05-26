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
            Notification('hide');
            if (scope.center && scope.center.lat) {
                _init_map(scope.center);
                return;
            } else {
                throw new Error('define center object for qq-map !!!')
            }

        }, 2000);
    }

    function init_map(scope, element, attrs, location) {
        /**
         * Render Map and Center it.
         * @type {[type]}
         */
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

        /**
         * Add a marker for the Center
         */
        var marker = new qq.maps.Marker({ map: map });
        var position = new qq.maps.LatLng(scope.center.lat, scope.center.lng);
        marker.setPosition(position);
        var anchor = new qq.maps.Point(0, 36),
            size = new qq.maps.Size(36, 36),
            origin = new qq.maps.Point(0, 0),
            markerIcon = new qq.maps.MarkerImage("/img/map/4.png", size, origin, anchor);
        marker.setIcon(markerIcon);
        marker.setTitle("Marker Title");

        // qq.maps.event.addListener(marker, 'click', function() {
        //     var title = 'title';
        //     // var content = '<img src="' + cfg.server + topics[n].goods_pics[0] + '" />';
        //     var content = '';
        //     // content += '<h3>';

        //     content += '<span class="assertive float-right">现价：￥ ' + 'bar' + '</span>&nbsp;';
        //     // content += '</h3>';

        //     var confirmPopup = $ionicPopup.confirm({
        //         title: title,
        //         cancelText: 'X 关闭',
        //         cancelType: 'button-positive',
        //         okText: '前往查看 >',
        //         okType: 'button-royal',
        //         template: content
        //     });

        //     confirmPopup.then(function(res) {
        //         if (res) {
        //             console.log('closed.')
        //         }
        //     });
        // });
    }

    return {
        scope: {
            center: '=',
            markers: "=",
            circles: '='
        },
        link: link
    };
});
