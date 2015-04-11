app.models.Account = Backbone.Model.extend({

    initialize: function() {},

    onLogin: function(obj) {
        localStorage.setItem('displayname', obj.displayName);
        localStorage.setItem('email', obj.email);
        //try sending the details to the DB
        var self = this;
        $.ajax({
            type: "POST",
            url: env.url + 'wp-admin/admin-ajax.php?action=postUserData',
            data: obj,
            success: function(data) {

            }
        })
        document.getElementById('fn').value = localStorage.getItem('displayname');
        document.getElementById('email').value = localStorage.getItem('email');
        app.router.navigate("home", {
            trigger: true
        });
    },

    success: function(e) {
        //do nothing
    },

    login: function() {
        window.plugins.googleplus.login({}, this.onLogin,
            function(msg) {
                window.analytics.trackException("Login Failed " + msg, true);
                app.router.navigate("home", {
                    trigger: true
                });
            }
        );
    },

    logout: function() {
        window.plugins.googleplus.logout(
            function(msg) {
                //logged out
            }
        );
    },

    trySilentLogin: function() {
        window.plugins.googleplus.trySilentLogin({}, this.onLogin,
            function(msg) {
                app.router.login();
            }
        );
    },

});



app.models.Bite = Backbone.Model.extend({

    urlRoot: env.url + 'wp-admin/admin-ajax.php?action=getBite&id=',

    defaults: {
        isSaved: false,
        isRead: false,
        post_title: '',
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
            "indianexpress.com": "The Indian Express",
            "mrunal.org": "Mrunal",
            "gktoday.in": "GKToday",
            "insightsonindia.com": "Insights",
            "hindustantimes.com": "HT",
            "http://pib.nic.in" : "PIB",
            "http://en.wikipedia.org": "Wiki",
            "nytimes.com": "NYT",
            "ccrtindia.gov.in": "ccrt",
            "thediplomat.com": "The Diplomat",
            "downtoearth.org.in": "Down to Earth",
            "idsa.in": "idsa",
            "frontline.in": "Frontline",
            "business-standard.com": "Business Stan",
            "thehindubusinessline.com": "The Hindu BL",
            "livemint.com": "Live Mint"
        };
        for (str in sourceMap) {
            if (link != null && link.indexOf(str) > -1) {
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


    tagToClassName: function(tag) {
        var tagClassMap = {
            "mrunal": "badge-mrunal",
            "gktoday": "badge-gktoday",
            "forumias": "badge-forumias",
            "wiki": 'badge-wiki',
            "pib": 'badge-pib',
            "insights": 'badge-insights',
            "upsc": 'badge-upsc',
            "civils": 'badge-civils'
        }
        if (tagClassMap[tag] != null) {
            return tagClassMap[tag];
        }
        return 'badge-primary';
    },

    initialize: function() {
        if(!this.get('discuss'))
            this.set('discuss', null);
        this.set('ccolor', this.categoryColorMap[this.get('category')]);
        this.set('tagclass', this.tagToClassName(this.get('tags')));
        this.set('source', this.parseSourceName(this.get('link')));
        this.on('change:category', function(model) {
            this.set('ccolor', this.categoryColorMap[this.get('category')]);
        });
        this.on('change:tags', function(model) {
            this.set('tagclass', this.tagToClassName(this.get('tags')));
        });
        this.on('change:link', function(model) {
            this.set('source', this.parseSourceName(this.get('link')));
        });
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
        return -Date.parse(model.get('post_date'))
    },

    error: function(xhr, msg, url) {
        window.analytics.trackException(xhr.status + ", " + msg + ", url-" + url, false);
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
                    localStorage.setItem('minDate', data[data.length - 1].post_date);
                    localStorage.setItem('maxDate', data[0].post_date);
                }
            },
            error: function(xhr, msg) {
                self.error(xhr, msg, url);
            }
        });
    },

    fetchLatest: function() {
        var url = env.url + 'wp-admin/admin-ajax.php?action=getMoreBites&maxDate=' + localStorage.getItem('maxDate');
        var self = this;
        $.ajax({
            url: url,
            dataType: "json",
            success: function(data) {
                if (data && data.length > 0) {
                    console.log("search success: " + data.length);
                    self.add(data);
                    self.save();
                    localStorage.setItem('maxDate', data[data.length - 1].post_date);
                    /* check for min and update that too */
                    /*var minDate = localStorage.getItem('minDate');
                    if (minId == null || (minId != null && parseInt(data[0].id) < parseInt(minId))) {
                        localStorage.setItem('minId', data[0].id);
                    }*/
                    for (bite in data) {
                        (self.get({
                            'id': data[bite].id
                        })).set('added', true);
                    }
                } else {
                    $('#loadLatestErr').show();
                    setTimeout(function() {
                        $("#loadLatestErr").hide();
                    }, 5000);
                }
            },
            error: function(xhr, msg) {
                self.error(xhr, msg, url);
            }
        });
    },

    fetchPrevious: function() {
        var url = env.url + 'wp-admin/admin-ajax.php?action=getMoreBites&minDate=' + localStorage.getItem('minDate');
        var self = this;
        $.ajax({
            url: url,
            dataType: "json",
            success: function(data) {
                if (data && data.length > 0) {
                    console.log("search success: " + data.length);
                    self.add(data);
                    self.save();
                    localStorage.setItem('minDate', data[data.length - 1].post_date);
                    for (bite in data) {
                        (self.get({
                            'id': data[bite].id
                        })).set('added', true);
                    }
                    /*var maxId = localStorage.getItem('maxId');
                    if (maxId == null || (maxId != null && parseInt(maxId) < parseInt(data[0].id))) {
                        localStorage.setItem('maxId', data[0].id);
                    }*/
                } else {
                    $('#loadPreviousErr').show();
                    setTimeout(function() {
                        $("#loadPreviousErr").hide();
                    }, 5000);
                }
            },
            error: function(xhr, msg) {
                self.error(xhr, msg, url);
            }
        });
    },

    textSearch : function(letters){
        if(letters == "") return this;
        var pattern = new RegExp(letters,"gi");
        var filteredList = _(this.filter(function(data) {
            return pattern.test(data.get("post_title"));
        }));
        return new app.models.BiteCollection(filteredList.__wrapped__);
    }
});

var account = new app.models.Account();
var allBites = new app.models.BiteCollection();
var activeBites;