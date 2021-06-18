(function (App) {
    'use strict';

    var AnimeCollection = App.Model.Collection.extend({
        model: App.Model.Anime,
        popid: '_id',
        type: 'animes',
        getProviders: function () {
            return {
                torrents: App.Config.getProviderForType('anime')
            };
        },
    });

    App.Model.AnimeCollection = AnimeCollection;
})(window.App);
