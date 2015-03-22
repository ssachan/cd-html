app.routers.AppRouter = Backbone.Router.extend({

    routes: {
        "": "index",
        "login": "login",
        "home": "home",
        "bite/:id": "bite",
        "savedlist": "savedList",
        "unreadlist": "unreadList"
    },

    initialize: function() {
        //console.log('init');
        //allBites.fetchLatest();
        var fSize = localStorage.getItem('fs');
        if (fSize == null) {
            localStorage.setItem('fs', 'small');
        } else {
            if (fSize == 'large') $('body').css('font-size', '1.8em');
            else $('body').css('font-size', '1.2em')
        }
    },

    index: function() {
        //alert('yo');
        //account.trySilentLogin();
        this.home();
    },

    login: function() {
        $('.bar-main').hide();
        app.SplashScreenView = new app.views.SplashScreenView({
            model: account,
            el: $('#cid')
        });
        app.SplashScreenView.render();
        window.analytics.trackView('Login');
        //$('#cid').html(app.SplashScreenView.render().el);
    },

    home: function() {
        $('.bar-main').show();
        $('#cid').removeClass('splash');
        if (localStorage.getItem('minDate') == null && localStorage.getItem('maxDate') == null) {
            //app being loaded for the first time.
            allBites.firstFetch();
        } else {
            allBites.fetch();
        }
        activeBites = allBites;
        app.BiteListView = new app.views.BiteListView({
            model: activeBites
        });
        $('#cid').html(app.BiteListView.render().el);
        window.analytics.trackView('Latest');
    },

    savedList: function() {
        $('.bar-main').show();
        $('#cid').removeClass('splash');
        $('#settingsModal').removeClass('active');
        activeBites = new app.models.BiteCollection(allBites.where({
            isSaved: true
        }));
        app.BiteListView = new app.views.BiteListView({
            model: activeBites
        });
        $('#cid').html(app.BiteListView.render().el);
        $('.table-view-divider').hide();
        window.analytics.trackView('Bookmarked');
    },

    unreadList: function() {
        $('.bar-main').show();
        $('#cid').removeClass('splash');
        $('#settingsModal').removeClass('active');
        activeBites = new app.models.BiteCollection(allBites.where({
            isRead: false
        }));
        app.BiteListView = new app.views.BiteListView({
            model: activeBites
        });
        $('#cid').html(app.BiteListView.render().el);
        $('.table-view-divider').hide();
    },

    bite: function(id) {
        $('.bar-main').show();
        $('#cid').removeClass('splash');
        var bite;
        if (activeBites == null) {
            bite = new app.models.Bite({
                id: id
            });
            bite.fetch({
                ajaxSync: true
            });
        } else {
            bite = activeBites.get({
                id: id
            });
        }
        $('#cid').html(new app.views.BiteView({
            model: bite
        }).render().$el);
        $('body, html, #cid, .content-padded').scrollTop(0);
        var nextModel = (activeBites) ? activeBites.at(activeBites.indexOf(bite) + 1) : null;
        var previousModel = (activeBites) ? activeBites.at(activeBites.indexOf(bite) - 1) : null;
        if (nextModel) {
            $('#cid').append('<a href="#bite/' + nextModel.id + '" class="circle-nav navigate-right circle-large circle-right"></a>');
            $('#cid').append('<a href="#bite/' + nextModel.id + '" class="circle-nav navigate-right circle-large circle-left"></a>');
        }
        if (previousModel) {
            $('#cid').append('<a href="#bite/' + previousModel.id + '" class="circle-nav navigate-left circle-small circle-right"></a>');
            $('#cid').append('<a href="#bite/' + previousModel.id + '" class="circle-nav navigate-left circle-small circle-left"></a>');
        }
        bite.set('isRead', true);
        window.analytics.trackView('Flashcard');
    }
});