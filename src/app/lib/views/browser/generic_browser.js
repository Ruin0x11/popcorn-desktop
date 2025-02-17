(function (App) {
    'use strict';

    /**
     * Manage browsing:
     *  * Create filter views
     *  * Create movie list
     *  * Fetch new movie collection and pass them to the movie list view
     *  * Show movie detail
     *  * Start playing a movie
     */
    var PCTBrowser = Marionette.View.extend({
        template: '#browser-tpl',
        className: 'main-browser',
        regions: {
            FilterBar: '.filter-bar-region',
            ItemList: '.list-region'
        },
        events: {
            'click .retry-button': 'onFilterChange',
            'click .online-search': 'onlineSearch',
            'click .change-api': 'changeApi',
            'click #search-more-item': 'onlineSearch',
            'mouseover #search-more-item': 'onlineSearchHov',
            'mouseover #load-more-item': 'onlineSearchHov'
        },

        initialize: function () {
            this.filter = new App.Model.Filter(this.filters);

            if (Settings.defaultFilters === 'custom' || Settings.defaultFilters === 'remember') {
                this.filter.set(this.getSavedFilter());
            }

            this.collection = new this.collectionModel([], {
                filter: this.filter
            });

            this.collection.fetch();

            this.listenTo(this.filter, 'change', this.onFilterChange);

        },

        onAttach: function () {
            this.bar = new App.View.FilterBar({
                model: this.filter
            });

            this.showChildView('FilterBar', this.bar);

            this.showChildView('ItemList', new App.View.List({
                collection: this.collection
            }));

            if (!isNaN(startupTime)) {
                win.debug('Butter %s startup time: %sms', Settings.version, (window.performance.now() - startupTime).toFixed(3)); // started in database.js;
                startupTime = 'none';
                if (parseInt(AdvSettings.get('bigPicture'))) {
                    if (AdvSettings.get('bigPicture') !== 100) {
                        win.zoomLevel = Math.log(AdvSettings.get('bigPicture')/100) / Math.log(1.2);
                    } else if (!AdvSettings.get('disclaimerAccepted') && ScreenResolution.QuadHD) {
                        AdvSettings.set('bigPicture', 140);
                        win.zoomLevel = Math.log(1.4) / Math.log(1.2);
                    }
                } else {
                    if (ScreenResolution.QuadHD) {
                        AdvSettings.set('bigPicture', 140);
                        win.zoomLevel = Math.log(1.4) / Math.log(1.2);
                    } else {
                        AdvSettings.set('bigPicture', 100);
                    }
                }
                App.vent.trigger('app:started');
            }
        },

        onFilterChange: function () {
            if (Settings.defaultFilters === 'remember' || curSetDefaultFilters) {
                this.saveFilter();
            }

            this.collection = new this.collectionModel([], {
                filter: this.filter
            });
            App.vent.trigger('show:closeDetail');
            this.collection.fetch();

            this.showChildView('ItemList', new App.View.List({
                collection: this.collection
            }));
        },

        onlineSearch: function () {
            switch (App.currentview) {
            case 'movies':
                Settings.OnlineSearchCategory = 'Movies';
                break;
            case 'shows':
                Settings.OnlineSearchCategory = 'TV Series';
                break;
            case 'anime':
                Settings.OnlineSearchCategory = 'Anime';
                break;
            default:
            }

            $('#filterbar-torrent-collection').click();
            $('.torrent-collection-container #online-input').val(this.collection.filter.keywords);
        },

        changeApi: function () {
            App.vent.trigger('settings:show');
            switch (App.currentview) {
            case 'movies':
                $('#customMoviesServer')[0].scrollIntoView({block: 'center'});
                $('#customMoviesServer')[0].focus();
                break;
            case 'shows':
                $('#customSeriesServer')[0].scrollIntoView({block: 'center'});
                $('#customSeriesServer')[0].focus();
                break;
            case 'anime':
                $('#customAnimeServer')[0].scrollIntoView({block: 'center'});
                $('#customAnimeServer')[0].focus();
                break;
            default:
            }
        },

        onlineSearchHov: function () {
            $('.item.selected').removeClass('selected');
        },

        focusSearch: function (e) {
            this.bar.focusSearch();
        },

        currentView: function () {
            var view = App.currentview;

            if (!view) {
                var activetab;
                var tabs = {
                    'TV Series': 'shows',
                    'Movies': 'movies',
                    'Anime': 'anime'
                };

                if (AdvSettings.get('startScreen') === 'Last Open') {
                    activetab = AdvSettings.get('lastTab');
                } else {
                    activetab = AdvSettings.get('startScreen');
                }

                view = tabs[activetab] || 'movies';
            }

            return view;
        },

        saveFilter: function () {
            var filters = AdvSettings.get('filters') || {};
            filters[this.currentView()] = this.filter.pick('sorter', 'genre', 'type', 'order', 'rating');
            AdvSettings.set('filters', filters);
        },

        getSavedFilter: function () {
            var filters = AdvSettings.get('filters') || {};
            return filters[this.currentView()] || this.filter.pick('sorter', 'genre', 'type', 'order', 'rating');
        }
    });

    App.View.PCTBrowser = PCTBrowser;
})(window.App);
