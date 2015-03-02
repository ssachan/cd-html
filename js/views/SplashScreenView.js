app.views.SplashScreenView = Backbone.View.extend({

    initialize: function() {
         $('.bar-main').hide();
    },

    render: function() {
    	this.$el.addClass('splash');
        this.$el.html('<button class="btn btn-negative btn-block gp">Login using Google+</button>');
        return this;
    },

    events: {
        "touchend .gp": "login",
    },

    login: function() {
        this.model.login();
    },

});