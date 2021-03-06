/**
 * Created by oerder on 30.10.15.
 */
function setTitle(){
    document.title = "Api Manager";
}

//Router.route('/', function () {
//    if(Meteor.userId()) this.render("welcome");
//    else this.render('usernotloggedin');
//    setTitle();
//});

Router.route('/', {
    template: function(){
        if(Meteor.userId()){
            if(Roles.userIsInRole(Meteor.userId(), ['admin']))
                return "admin_dashboard";
            else Router.go("/policy");
        }
        else
            return 'usernotloggedin';
    },
    data: function(){
        return this.params;
    },
    action: function () {
        if (this.ready()) {
            this.render();
        } else {
            this.render('Loading');
        }
    },
    waitOn : function(){
        return Meteor.subscribe('UserAccounts');
    },
    after: setTitle
});


Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/settings/', function () {

    if(Roles.userIsInRole(Meteor.userId(), ['admin']))
        this.render('admin_settings');
    else
        this.render('userrestricted');
    setTitle();
});

Router.route('/user/', function () {
    setTitle();
        this.render('admin_useruebersicht');
});

Router.route('/group/', function () {
    setTitle();
    this.render('admin_gruppenuebersicht');
});

Router.route('/service/', function () {
    setTitle();
    this.render('admin_servicesuebersicht');
});
Router.route('/service/new', function () {
    setTitle();
    this.render('admin_servicesnew');
});
Router.route('/service/:id', {
    template: 'admin_servicedetail',
    data: function(){
        return this.params;
    },
    action: function () {
        if (this.ready()) {
            this.render();
        } else {
            this.render('Loading');
        }
    },
    waitOn : function(){
        return Meteor.subscribe('services');
    },
    after: setTitle
});

Router.route('/exportpolicies/', function () {
    setTitle();
    this.render('admin_exportpolicies');
});


Router.route('/policy/', function () {
    setTitle();
    if(Roles.userIsInRole(Meteor.userId(), ['admin']))
        this.render('admin_policiesuebersicht');
    else
        this.render('user_policiesuebersicht');

});
Router.route('/policy/new', function () {
    setTitle();
    this.render('admin_policiesnew');
});
Router.route('/policy/:id', {
    template: function(){
        if(Roles.userIsInRole(Meteor.userId(), ['admin'])) return 'admin_policiesdetail';
        else return "user_policiesdetail";
    },
    data: function(){
        return this.params;
    },
    action: function () {
        if (this.ready()) {
            this.render();
        } else {
            this.render('Loading');
        }
    },
    waitOn : function(){
        return Meteor.subscribe('services') && Meteor.subscribe('policies');
    },
    after: setTitle
});


Router.route('/membrane/', function () {
    if(Roles.userIsInRole(Meteor.userId(), ['admin']))
        this.render('admin_membraneuebersicht');
    setTitle();
});



Router.route('/subscription/', function () {

    if(Roles.userIsInRole(Meteor.userId(), ['admin']))
        this.render('admin_subscriptionsuebersicht');
    else
        this.render('user_subscriptionsuebersicht');
    setTitle();
});
Router.route('/subscription/new', function () {

    if(Roles.userIsInRole(Meteor.userId(), ['admin']))
        this.render('admin_subscriptionnew');
    else
        this.render('user_subscriptionnew');
    setTitle();
});
Router.route('/subscription/new/:id', {
    template: function() {
        if(Roles.userIsInRole(Meteor.userId(), ['admin']))
            return 'admin_subscriptionnew';
        else return 'user_subscriptionnew';
    },
    data: function(){
        return this.params;
    },
    action: function () {
        if (this.ready()) {
            this.render();
        } else {
            this.render('Loading');
        }
    },
    waitOn : function(){
        return Meteor.subscribe('services') && Meteor.subscribe('policies') && Meteor.subscribe("UserAccounts");
    },
    after: setTitle
});
Router.route('/subscription/:id', {
    template: function() {
        if(Roles.userIsInRole(Meteor.userId(), ['admin']))
            return 'admin_subscriptiondetail';
        else return 'user_subscriptiondetail';
    },
    data: function(){
        return this.params;
    },
    action: function () {
        if (this.ready()) {
            this.render();
        } else {
            this.render('Loading');
        }
    },
    waitOn : function(){
        return Meteor.subscribe('services') && Meteor.subscribe('policies') && Meteor.subscribe("UserAccounts");
    },
    after: setTitle
});
Router.route('/subscribe/:id', {
    template:  'user_subscribe',
    data: function(){
        return this.params;
    },
    action: function () {
        if (this.ready()) {
            this.render();
        } else {
            this.render('Loading');
        }
    },
    waitOn : function(){
        return Meteor.subscribe('services') && Meteor.subscribe('policies') && Meteor.subscribe("UserAccounts");
    },
    after: setTitle
});

Router.route('/user/:id', {
    template: 'admin_userdetail',
    data: function(){
        return this.params;
    },
    action: function () {
        if (this.ready()) {
            this.render();
        } else {
            this.render('Loading');
        }
    },
    waitOn : function(){
        return Meteor.subscribe("UserAccounts") && Meteor.subscribe("groups");
    },
    after: setTitle
});


Router.route('/export', function(){
            //if (Roles.userIsInRole(this.userId, ['admin']) || Roles.userIsInRole(this.userId, ['membrane'])) {

                var filename = 'output' + '.yml';


                var ret = createYAMLobject();


                var headers = {
                    'Content-Type': 'application/x-yaml',
                    'Content-Disposition': "attachment; filename=" + filename
                };

                this.response.writeHead(200, headers);
                return this.response.end(YAML.safeDump(ret));
            //} else  return null;
        },
    {where:"server"}
);



