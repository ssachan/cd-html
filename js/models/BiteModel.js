app.models.Bite = Backbone.Model.extend({

    defaults: {
        isSaved: false,
        isRead: false
    },

    parseSourceName: function(link) {
        var sourceMap = {
            "thehindu": "The Hindu",
            "telegraghindia": "The Telegraph",
            "economictimes.indiatimes.com": "The Economic Times",
            "reuters.com": "Reuters",
            "timesofindia": "The Times Of India",
            "bbc.com": "BBC",
            "business-standard.com": "Business Standard",
            "indianexpress.com": "The Indian Express"
        };
        for (str in sourceMap) {
            if (link.indexOf(str) > -1) {
                return sourceMap[str];
            }
        }
        return "Link";
    },

    categoryColorMap: {
        "Economics": "#9B30FF",
        "Enviro &amp; Biodiversity": "#41a62a",
        "Geography": "#FFA824",
        "History": "#A02422",
        "Polity": "#4CB7A5",
        "Science &amp; Tech": "#26ADE4",
        "Trivia": "#CD5555",
        "World": "#FF6103",
    },

    initialize: function() {
        this.set('ccolor', this.categoryColorMap[this.get('category')]);
        this.set('source', this.parseSourceName(this.get('link')));
        this.on('change:isSaved', function(model) {
            model.save();
        });
        this.on('change:isRead', function(model) {
            model.save();
        });
    }

});

app.models.BiteCollection = Backbone.Collection.extend({

    model: app.models.Bite,

    localStorage: new Backbone.LocalStorage("bites"),

    save: function() {
        this.models.forEach(function(model) {
            model.save();
        });
    },

    comparator: function(model) {
        return -parseInt(model.id);
    },

    firstFetch: function() {
        var url = env.url + 'wp-admin/admin-ajax.php?action=getMoreBites';
        var self = this;
        $.ajax({
            url: url,
            dataType: "json",
            success: function(data) {
                if (data && data.length > 0) {
                    console.log("search success: " + data.length);
                    self.add(data);
                    self.save();
                    localStorage.setItem('minId', data[data.length - 1].id);
                    localStorage.setItem('maxId', data[0].id);
                }
            },
            error: function(xhr, msg) {
                alert(xhr.status + ", " + msg);
                if (xhr.status == 0 || xhr.status == "0") {
                    alert(xhr.responseText); // always blank, if runs
                }
            }
        });
    },

    fetchLatest: function() {
        var url = env.url + 'wp-admin/admin-ajax.php?action=getMoreBites&maxId=' + localStorage.getItem('maxId');
        var self = this;
        $.ajax({
            url: url,
            dataType: "json",
            success: function(data) {
                if (data && data.length > 0) {
                    console.log("search success: " + data.length);
                    self.add(data);
                    self.save();
                    localStorage.setItem('maxId', data[data.length - 1].id);
                    /* check for min and update that too */
                    var minId = localStorage.getItem('minId');
                    if (minId == null || (minId != null && parseInt(data[0].id) < parseInt(minId))) {
                        localStorage.setItem('minId', data[0].id);
                    }
                } else {
                    $('#loadLatestErr').show();
                    setTimeout(function() {
                        $("#loadLatestErr").hide();
                    }, 5000);

                }
            }
        });
    },

    fetchPrevious: function() {
        var url = env.url + 'wp-admin/admin-ajax.php?action=getMoreBites&minId=' + localStorage.getItem('minId');
        var self = this;
        $.ajax({
            url: url,
            dataType: "json",
            success: function(data) {
                if (data && data.length > 0) {
                    console.log("search success: " + data.length);
                    self.add(data);
                    self.save();
                    localStorage.setItem('minId', data[data.length - 1].id);
                    var maxId = localStorage.getItem('maxId');
                    if (maxId == null || (maxId != null && parseInt(maxId) < parseInt(data[0].id))) {
                        localStorage.setItem('maxId', data[0].id);
                    }
                } else {
                    $('#loadPreviousErr').show();
                    setTimeout(function() {
                        $("#loadPreviousErr").hide();
                    }, 5000);
                }
            }
        });
    }
});

var allBites = new app.models.BiteCollection();
var activeBites;