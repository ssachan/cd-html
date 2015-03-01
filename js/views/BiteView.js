app.views.BiteView = Backbone.View.extend({

    className :'content-padded',

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },

    events: {
        "touchend .save": "save",
        "touchend .ws": "whatsappShare"
    },

    save: function() {
        this.model.get('isSaved') == false ? this.model.set('isSaved', true) : this.model.set('isSaved', false);
    },

    whatsappShare: function() {
        //window.plugins.socialsharing.shareViaWhatsApp(app.safe_tags_regex(this.model.get('post_content')), null, this.model.get('link'), function() {console.log('share ok')}, function(errormsg){alert(errormsg)}); 
        //window.analytics.trackEvent('WhatsApp Share', 'touch', 'id-'+this.model.get('id'));

    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});