app.routers.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
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
        //account.trySilentLogin();
        if (localStorage.getItem('minId') == null && localStorage.getItem('maxId') == null) {
            //app being loaded for the first time.
            allBites.firstFetch();
        } else {
            allBites.fetch();
        }
        activeBites = allBites;
    },

    home: function() {
        $('#cid').empty();
        activeBites = allBites;
        app.BiteListView = new app.views.BiteListView({
            model: activeBites
        });
        $('#cid').html(app.BiteListView.render().el);
    },

    savedList: function() {
        $('#cid').empty();
        $('#settingsModal').removeClass('active');
        activeBites = new app.models.BiteCollection(allBites.where({
            isSaved: true
        }));
        app.BiteListView = new app.views.BiteListView({
            model: activeBites
        });
    },

    unreadList: function() {
        $('#cid').empty();
        $('#settingsModal').removeClass('active');
        activeBites = new app.models.BiteCollection(allBites.where({
            isRead: false
        }));
        app.BiteListView = new app.views.BiteListView({
            model: activeBites
        });
    },

    bite: function(id) {
        var bite = activeBites.get({
            id: id
        });
        // Note that we could also 'recycle' the same instance of EmployeeFullView
        // instead of creating new instances
        $('#cid').empty();

        $('#cid').html(new app.views.BiteView({
            model: bite
        }).render().$el);
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

    }

});