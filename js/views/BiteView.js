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
        window.analytics.trackEvent('Bookmark', 'touch', 'id-' + this.model.id);
    },

    makeSafe: function(str) {
        var text = str.replace(/<ol>/ig, '').replace(/<\/ol>/ig, '').replace(/<ul>/ig, '').replace(/<\/ul>/ig, '').replace(/<hr\/>/ig, '');
        var text = text.replace(/<li>/ig, '# ');
        var text = text.replace(/<\/li>/ig, '\r\n');
        return text.split('<hr','1');
        var text = text.replace(/(<([^>]+)>)/ig, '');
        text = encodeURI(text);
        text = text.replace(/%20/g, ' ').replace(/%[a-zA-Z0-9][a-zA-Z0-9]/g, '');
        return text = (text + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    },

    whatsappShare: function() {
        window.plugins.socialsharing.shareViaWhatsApp('## ' + this.model.get('post_title') + ' ##\r\n' + this.makeSafe(this.model.get('post_content')), null, this.model.get('link'), function() {
            console.log('share ok')
        }, function(msg) {
            window.analytics.trackException("Sharing Failed, "+msg+", id-"+this.model.id, true);
        });
        window.analytics.trackEvent('WhatsApp Share', 'touch', 'id-' + this.model.id);
    },

    render: function() {
        //console.log('## ' + this.model.get('post_title') + ' ##\r\n' + this.makeSafe(this.model.get('post_content')));
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});