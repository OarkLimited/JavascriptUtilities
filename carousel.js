$.fn.carousel = function (_options) {
    var Carousel = function (element, options) {
        var _defaults = $.extend({
            html: {
                template: "",
                data: {

                }
            },
            items: [],
            events: []
        }, options);

        this.html = _defaults.html;
        this.events = _defaults.events;
        this.items = _defaults.items;
        this.$selector = $(element);
        this.generateCarousel();
    };

    Carousel.prototype.html = {};
    Carousel.prototype.$selector = "";
    Carousel.prototype.items = [];
    Carousel.prototype.events = [];
    Carousel.prototype.currentIndex = 0;
    Carousel.prototype.itemsPerView = 3;
    Carousel.prototype.getView = function () {
        var self = this,
            viewItems = self.items.slice((self.currentIndex || 0), (self.currentIndex + self.itemsPerView)),
            viewItems = viewItems.concat(self.items.slice(0, (self.itemsPerView - viewItems.length)));

        return viewItems;
    };
    Carousel.prototype.generateCarousel = function () {
        var self = this,
            current = [];

        self.getView().forEach(function (item, i) {
            current.push(item);
        });
        if (current.length > 0)
            self.setCurrentCarouselItem(current);
    };
    Carousel.prototype.next = function () {
        var self = this;
        if (self.items.length <= 0)
            return;

        if ((self.items.length - 1) > self.currentIndex) self.currentIndex++;
        else self.currentIndex = 0;
        self.generateCarousel();
    };
    Carousel.prototype.addItems = function (_items) {
        this.items = this.items.concat(_items);
        this.generateCarousel();
    };
    Carousel.prototype.globalDataAndEvents = function () {
        var self = this;

        self.$selector.append(template(self.html.template, self.html.data));
        $.each(self.events, function (i, item) {
            self.$selector[item.type || 'on'](item.event, item.selector.join(','), { instance: self }, item.func);
        });
    };


    /**
     * Sets the Current Carousel Item / Items
     * @param {[object]} - an array of object with the following properties...
     * template - , 
     * data - , 
     * dom - , 
     * events - 
    */
    Carousel.prototype.setCurrentCarouselItem = function (_items) {
        var self = this;

        if (!('push' in _items)) _items = [_items];

        self.$selector.off();
        self.$selector.children().detach();

        _items.forEach(function (_item, i) {
            if (_item.dom) self.$selector.append(_item.dom);
            else self.$selector.append(template(_item.template, _item.data));

            (_item.events || []).forEach(function (_event, j) {
                self.$selector[_event.type || 'on'](_event.event, _event.selector.join(','), { instance: self }, _event.func);
            });
        });


        self.globalDataAndEvents();
    };




    var instance = new Carousel(this[0], _options);
    instance.$selector.data('carousel', instance);
    return instance;
};