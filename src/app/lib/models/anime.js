(function (App) {
    'use strict';

    var Anime = App.Model.Show.extend({
        idAttribute: '_id', // Kitsu ID
    });

    App.Model.Anime = Anime;
})(window.App);
