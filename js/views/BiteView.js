app.views.BiteView = Backbone.View.extend({

    className: 'content-padded',

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },

    events: {
        "touchend .save": "save",
        "touchend .icon.whatsapp": "whatsappShare"
    },

    save: function() {
        this.model.get('isSaved') == false ? this.model.set('isSaved', true) : this.model.set('isSaved', false);
        window.analytics.trackEvent('WhatsApp Share', '', 'id-' + this.model.id);
    },

    makeSafe: function(str) {
        var text = str.replace(/(<([^>]+)>)/ig, '');
        text = encodeURI(text);
        text = text.replace(/%20/g, ' ').replace(/%[a-zA-Z0-9][a-zA-Z0-9]/g, '');
        return text = (text + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    },

    whatsappShare: function() {
        console.log(this.makeSafe(this.model.get('post_content')));
        window.plugins.socialsharing.shareViaWhatsApp(this.makeSafe(this.model.get('post_content')), null, this.model.get('link'), function() {
            console.log('share ok')
        }, function(errormsg) {
            alert(errormsg)
        });
        window.analytics.trackEvent('WhatsApp Share', '', 'id-' + this.model.id);
    },

    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});