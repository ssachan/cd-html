app.views.BiteListView = Backbone.View.extend({

    tagName:'ul',

    className:'table-view',

    initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", this.render, this);
    },

    render:function () {
        this.$el.empty();
        this.$el.append('<li class="table-view-divider"><button id="loadLatest" class="btn btn-positive">Load Latest</button><span id="loadLatestErr" class="badge" style="margin-left: 20px;display:none">No new bites, try again later !</span></li>');
        _.each(this.model.models, function (bite) {
            this.$el.append(new app.views.BiteListItemView({model:bite}).render().el);
        }, this);
        this.$el.append('<li class="table-view-divider"><button id="loadPrevious" class="btn btn-positive">Load Previous</button><span id="loadPreviousErr" class="badge" style="margin-left: 20px;display:none">No more old bites!</span></li>');
        return this;
    },

     events: {
        "touchend #loadLatest": "loadLatest",
        "touchend #loadPrevious": "loadPrevious"
    },

    loadLatest:function(){
        this.model.fetchLatest();
    },

    loadPrevious:function(){
        this.model.fetchPrevious();
    }


});

app.views.BiteListItemView = Backbone.View.extend({

    tagName:"li",

    className: "table-view-cell",

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        this.el.style.cssText = 'border-left:7px solid '+this.model.get('ccolor')+';';
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});