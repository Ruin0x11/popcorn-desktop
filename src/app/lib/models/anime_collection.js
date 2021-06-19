(function (App) {
    'use strict';

    var AnimeCollection = App.Model.Collection.extend({
        model: App.Model.Anime,
        popid: '_id',
        type: 'animes',
        getProviders: function () {
            return {
                torrents: App.Config.getProviderForType('anime'),
                // Some anime entries are actually movies, so we need to add
                // the Trakt metadata provider.
                metadata: App.Config.getProviderForType('metadata')
            };
        },
    });

    App.Model.AnimeCollection = AnimeCollection;
})(window.App);
