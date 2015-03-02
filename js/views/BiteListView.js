app.views.BiteListView = Backbone.View.extend({

    tagName: 'ul',

    className: 'table-view',

    initialize: function() {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", this.render, this);
    },

    render: function() {
        this.$el.empty();
        this.$el.append('<li class="table-view-divider"><button id="loadLatest" class="btn btn-positive">Load Latest</button><span id="loadLatestErr" class="badge" style="margin-left: 20px;display:none">Nothing new added!</span><span class="pull-right font-pref large">A</span><span class="pull-right font-pref small">A</span></li>');
        _.each(this.model.models, function(bite) {
            this.$el.append(new app.views.BiteListItemView({
                model: bite
            }).render().el);
        }, this);
        this.$el.append('<li class="table-view-divider"><button id="loadPrevious" class="btn btn-positive">Load Previous</button><span id="loadPreviousErr" class="badge" style="margin-left: 20px;display:none">No more old bites!</span></li>');
        return this;
    },

    events: {
        "touchend #loadLatest": "loadLatest",
        "touchend #loadPrevious": "loadPrevious",
        "touchend .font-pref.small": "toggleFontSizeToSmall",
        "touchend .font-pref.large": "toggleFontSizeToLarge",
    },

    loadLatest: function() {
        this.model.fetchLatest();
    },

    loadPrevious: function() {
        this.model.fetchPrevious();
    },
    toggleFontSizeToSmall: function(e) {
        if (localStorage.getItem('fs') == 'small') {
            return;
        }
        $('body').css('font-size', '1.2em');
        localStorage.setItem('fs', 'small');
        $('.font-pref.small').addClass('selected');
        $('.font-pref.large').removeClass('selected');
    },
    toggleFontSizeToLarge: function() {
        if (localStorage.getItem('fs') == 'large') {
            return;
        }
        $('body').css('font-size', '1.8em');
        localStorage.setItem('fs', 'large');
        $('.font-pref.large').addClass('selected');
        $('.font-pref.small').removeClass('selected');
    }
});

app.views.BiteListItemView = Backbone.View.extend({

    tagName: "li",

    className: "table-view-cell",

    initialize: function() {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render: function() {
        this.el.style.cssText = 'border-left:7px solid ' + this.model.get('ccolor') + ';';
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});