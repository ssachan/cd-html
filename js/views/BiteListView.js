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
        this.$el.append(this.template({
            'fs': localStorage.getItem('fs')
        }));
        _.each(this.model.models, function(bite) {
            this.$el.append(new app.views.BiteListItemView({
                model: bite
            }).render().el);
        }, this);

        this.$el.append('<li class="table-view-divider"><button id="loadPrevious" class="btn btn-primary">Load Previous</button><span id="loadPreviousErr" class="badge" style="margin-left: 20px;display:none">No more old bites!</span></li>');
        return this;
    },

    events: {
        "touchend #loadLatest": "loadLatest",
        "touchend #loadPrevious": "loadPrevious",
        "touchend #font-small": "toggleFontSizeToSmall",
        "touchend #font-large": "toggleFontSizeToLarge",
    },

    loadLatest: function() {
        this.model.fetchLatest();
    },

    loadPrevious: function() {
        this.model.fetchPrevious();
    },
    toggleFontSizeToSmall: function(e) {
        e.preventDefault()
        if (localStorage.getItem('fs') == 'small') {
            return;
        }
        $('body').css('font-size', '1.2em');
        localStorage.setItem('fs', 'small');
    },
    toggleFontSizeToLarge: function(e) {
        e.preventDefault()
        if (localStorage.getItem('fs') == 'large') {
            return;
        }
        $('body').css('font-size', '1.8em');
        localStorage.setItem('fs', 'large');
    }
});

app.views.BiteListItemView = Backbone.View.extend({

    tagName: "li",

    className: "table-view-cell",

    initialize: function() {
        this.model.on("change:added", this.animate, this);
        this.model.on("change:isRead", this.read, this);
    },

    render: function() {
        this.el.style.cssText = 'border-left:7px solid ' + this.model.get('ccolor') + ';';
        this.$el.html(this.template(this.model.attributes));
        return this;
    },

    animate: function() {
        this.$el.animate({
            'background': 'rgba(87,173,104,0.1)',
            'color': '#468c54'
        }, 2000);
    },

    read: function() {
        this.$el.css('background', '#fff');
    }
});