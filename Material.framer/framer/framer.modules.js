require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"md":[function(require,module,exports){
var App, Body1, Body2, BottomNav, Button, Caption, Dialog, DialogAction, Fab, GridList, Header, Headline, Icon, MenuButton, MenuOverlay, Page, Regular, RowItem, StatusBar, SubheadSecondary, Tile, Title, View, app, icons, ripple, theme, type,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ripple = require('ripple').ripple;

theme = require('theme').theme;

type = require('type');

icons = JSON.parse(Utils.domLoadDataSync("modules/icons.json"));

Framer.Extras.Hints.disable();

exports.theme = theme;

exports.Title = Title = type.Title;

exports.Headline = Headline = type.Headline;

exports.SubheadSecondary = SubheadSecondary = type.SubheadSecondary;

exports.Regular = Regular = type.Regular;

exports.Body2 = Body2 = type.Body2;

exports.Body1 = Body1 = type.Body1;

exports.Caption = Caption = type.Caption;

exports.DialogAction = DialogAction = type.DialogAction;

app = void 0;

exports.App = App = (function(superClass) {
  extend(App, superClass);

  function App(options) {
    var ref, ref1, ref2, ref3, ref4, ref5;
    if (options == null) {
      options = {};
    }
    this._theme = theme;
    this._bottomNav = (ref = options.bottomNav) != null ? ref : void 0;
    this._menuOverlay = (ref1 = options.menuOverlay) != null ? ref1 : void 0;
    this.views = (ref2 = options.views) != null ? ref2 : [];
    App.__super__.constructor.call(this, _.defaults(options, {
      name: 'App',
      size: Screen.size,
      backgroundColor: null
    }));
    app = this;
    this.header = new Header({
      theme: theme,
      index: 999
    });
    this.footer = new Layer({
      name: '.',
      parent: this,
      width: Screen.width,
      height: 48,
      image: 'images/nav_bar.png',
      index: 999,
      y: Align.bottom()
    });
    if (this._bottomNav) {
      this.bottomNav = new BottomNav({
        name: 'Bottom Nav',
        parent: this,
        destinations: (ref3 = this._bottomNav.links) != null ? ref3 : "md.app.bottomNav needs an array of links. Example: [{title: 'Home', icon: 'home', action: -> view.linkTo(home)}]",
        y: this.footer != null ? Align.bottom(-this.footer.height) : Align.bottom(),
        index: 999
      });
    }
    if (this._menuOverlay) {
      this.menuOverlay = new MenuOverlay({
        name: 'Menu Overlay',
        title: (function() {
          if ((ref4 = this._menuOverlay.title) != null) {
            return ref4;
          } else {
            throw 'md.app.menuOverlay needs a title.';
          }
        }).call(this),
        links: (function() {
          if ((ref5 = this._menuOverlay.links) != null) {
            return ref5;
          } else {
            throw "md.app.menuOverlay needs an array of links. Example: [{title: 'Home', icon: 'home', action: -> view.linkTo(home)}]";
          }
        }).call(this)
      });
    }
    this.keyboard = new Layer({
      name: 'Keyboard',
      y: this.maxY,
      image: theme.keyboard.image,
      width: this.width,
      height: 222,
      index: 1000,
      animationOptions: {
        time: .25
      }
    });
    this.keyboard.onTap((function(_this) {
      return function() {
        return _this.hideKeyboard();
      };
    })(this));
  }

  App.prototype.showKeyboard = function() {
    this.keyboard.animate({
      y: Align.bottom()
    });
    return this.keyboard.bringToFront();
  };

  App.prototype.hideKeyboard = function() {
    return this.keyboard.animate({
      y: this.maxY
    });
  };

  return App;

})(Layer);

exports.View = View = (function(superClass) {
  extend(View, superClass);

  function View(options) {
    if (options == null) {
      options = {};
    }
    this.app = app;
    View.__super__.constructor.call(this, _.defaults(options, {
      name: 'View',
      parent: app,
      index: 900,
      animationOptions: {
        time: .2
      }
    }));
    this.onTransitionStart((function(_this) {
      return function(current, next, direction) {
        var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
        _this.app.header.title = (ref = (ref1 = next._header) != null ? ref1.title : void 0) != null ? ref : 'Default';
        _this.app.header.icon = (ref2 = (ref3 = next._header) != null ? ref3.icon : void 0) != null ? ref2 : 'menu';
        _this.app.header.iconAction = (ref4 = (ref5 = next._header) != null ? ref5.iconAction : void 0) != null ? ref4 : function() {
          return null;
        };
        _this.app.header.visible = (ref6 = (ref7 = next._header) != null ? ref7.visible : void 0) != null ? ref6 : true;
        return next._onLoad();
      };
    })(this));
    app.views.push(this);
  }

  View.prototype.newPage = function(options) {
    var page;
    if (options == null) {
      options = {};
    }
    page = new Page(_.defaults(options, {
      contentInset: {
        top: this.app.header.height
      }
    }));
    if (page.contentInset.top < this.app.header.height) {
      page.contentInset = {
        top: page.contentInset.top += this.app.header.height,
        bottom: page.contentInset.bottom,
        left: page.contentInset.left,
        right: page.contentInset.right
      };
    }
    return page;
  };

  View.prototype.addPage = function(page) {
    page.contentInset = {
      top: this.app.header.height
    };
    if (page.contentInset.top < this.app.header.height) {
      page.contentInset = {
        top: page.contentInset.top += this.app.header.height,
        bottom: page.contentInset.bottom,
        left: page.contentInset.left,
        right: page.contentInset.right
      };
    }
    return page;
  };

  View.prototype.linkTo = function(page) {
    if ((page != null) && this.current !== page) {
      return this.showNext(page);
    }
  };

  return View;

})(FlowComponent);

exports.Icon = Icon = (function(superClass) {
  extend(Icon, superClass);

  function Icon(options) {
    var ref, ref1, ref2;
    if (options == null) {
      options = {};
    }
    this._icon = (ref = options.icon) != null ? ref : 'menu';
    this._color = (ref1 = options.color) != null ? ref1 : '#00000';
    this._backgroundColor = (ref2 = options.backgroundColor) != null ? ref2 : null;
    Icon.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      height: 24,
      width: 24,
      backgroundColor: this._backgroundColor
    }));
  }

  Icon.define("icon", {
    get: function() {
      return this._icon;
    },
    set: function(name) {
      var svg;
      this._icon = name;
      svg = (function() {
        if (icons[this._icon]) {
          return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='" + icons[this._icon] + "' fill='" + this._color + "'/></svg>";
        } else {
          throw "Error: icon '" + name + "' was not found. See https://materialdesignicons.com/ for full list of icons.";
        }
      }).call(this);
      return this.html = svg;
    }
  });

  Icon.define("color", {
    get: function() {
      return this._color;
    },
    set: function(color) {
      var svg;
      this._color = new Color(color);
      svg = (function() {
        if (icons[this._icon]) {
          return "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='" + icons[this._icon] + "' fill='" + this._color + "'/></svg>";
        } else {
          throw "Error: icon '" + name + "' was not found. See https://materialdesignicons.com/ for full list of icons.";
        }
      }).call(this);
      return this.html = svg;
    }
  });

  return Icon;

})(Layer);

exports.StatusBar = StatusBar = (function(superClass) {
  extend(StatusBar, superClass);

  function StatusBar(options) {
    if (options == null) {
      options = {};
    }
    StatusBar.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      width: Screen.width,
      height: 24,
      backgroundColor: theme.statusBar.backgroundColor
    }));
    this.items = new Layer({
      name: '.',
      parent: this,
      size: this.size,
      image: theme.statusBar.image,
      invert: theme.statusBar.invert
    });
  }

  return StatusBar;

})(Layer);

exports.Header = Header = (function(superClass) {
  extend(Header, superClass);

  function Header(options) {
    var ref, ref1, ref2, ref3;
    if (options == null) {
      options = {};
    }
    this._title = void 0;
    this._icon = void 0;
    this._iconAction = (ref = options.iconAction) != null ? ref : function() {
      return null;
    };
    Header.__super__.constructor.call(this, _.defaults(options, {
      name: 'Header',
      width: Screen.width,
      height: 80,
      shadowY: 2,
      shadowBlur: 3,
      shadowColor: 'rgba(0,0,0,.24)',
      backgroundColor: theme.header.backgroundColor
    }));
    this.statusBar = new StatusBar({
      name: '.',
      parent: this
    });
    this.titleLayer = new type.Title({
      name: '.',
      parent: this,
      x: 72,
      y: Align.bottom(-14),
      color: theme.header.title,
      text: (ref1 = this.title) != null ? ref1 : "No title"
    });
    this.title = (ref2 = options.title) != null ? ref2 : 'Default Header';
    this.iconLayer = new Icon({
      name: '.',
      parent: this,
      x: 12,
      y: Align.center(12),
      icon: 'menu',
      color: theme.header.icon.color
    });
    this.icon = (ref3 = options.icon) != null ? ref3 : 'menu';
    this.iconLayer.onTap((function(_this) {
      return function() {
        return _this._iconAction();
      };
    })(this));
    this.iconLayer.onTouchStart(function(event) {
      return ripple(app.header, event.point);
    });
  }

  Header.define("title", {
    get: function() {
      return this._title;
    },
    set: function(titleText) {
      this._title = titleText;
      return this.titleLayer.textReplace(this.titleLayer.text, this._title);
    }
  });

  Header.define("icon", {
    get: function() {
      return this._icon;
    },
    set: function(iconName) {
      this._icon = iconName;
      return this.iconLayer.icon = iconName;
    }
  });

  Header.define("iconColor", {
    get: function() {
      return this._icon.color;
    },
    set: function(color) {
      return this.iconLayer.color = color;
    }
  });

  Header.define("iconAction", {
    get: function() {
      return this._iconAction;
    },
    set: function(action) {
      return this._iconAction = action;
    }
  });

  return Header;

})(Layer);

exports.BottomNav = BottomNav = (function(superClass) {
  extend(BottomNav, superClass);

  function BottomNav(options) {
    var destination, i, item, j, len, ref, ref1, ref2, ref3;
    if (options == null) {
      options = {};
    }
    this._destinations = (function() {
      if ((ref = options.destinations) != null) {
        return ref;
      } else {
        throw 'Needs at least one destination.';
      }
    })();
    this._items = [];
    this._initialDestination = (ref1 = options.initialDestination) != null ? ref1 : void 0;
    this._activeDestination = (ref2 = this._initialDestination) != null ? ref2 : this._items[0];
    BottomNav.__super__.constructor.call(this, _.defaults(options, {
      name: 'Bottom Nav',
      y: Align.bottom,
      width: Screen.width,
      height: 56,
      backgroundColor: theme.bottomNav.backgroundColor,
      shadowY: theme.bottomNav.shadowY,
      shadowBlur: theme.bottomNav.shadowBlur,
      shadowColor: theme.bottomNav.shadowColor
    }));
    ref3 = this._destinations;
    for (i = j = 0, len = ref3.length; j < len; i = ++j) {
      destination = ref3[i];
      item = new Layer({
        name: '.',
        parent: this,
        x: this.width / this._destinations.length * i,
        width: this.width / this._destinations.length,
        height: this.height,
        backgroundColor: null
      });
      item.disk = new Layer({
        name: '.',
        parent: item,
        x: Align.center,
        y: Align.center,
        height: this.height,
        width: this.height,
        borderRadius: this.height / 2,
        backgroundColor: null
      });
      item.iconLayer = new Icon({
        name: '.',
        parent: item.disk,
        x: Align.center,
        y: Align.center(-8),
        icon: destination.icon,
        animationOptions: {
          time: .15
        }
      });
      item.labelLayer = new type.Caption({
        name: '.',
        parent: item.disk,
        x: Align.center,
        y: Align.center(14),
        width: this.width,
        textAlign: 'center',
        text: destination.title,
        animationOptions: {
          time: .15
        }
      });
      item.action = destination.action;
      item.disk.onTouchStart(function(event) {
        return ripple(this, event.point, this.parent.iconLayer, new Color(theme.primary).alpha(.3));
      });
      item.onTap(function() {
        return this.parent.activeDestination = this;
      });
      this._items.push(item);
      this.showActive(this._items[0]);
    }
  }

  BottomNav.define("activeDestination", {
    get: function() {
      return this._activeDestination;
    },
    set: function(destination) {
      if (destination === this._activeDestination) {
        return;
      }
      this._activeDestination = destination;
      this._activeDestination.action();
      return this.showActive(this._activeDestination);
    }
  });

  BottomNav.prototype.showActive = function(item) {
    var j, len, ref, results, sib;
    item.labelLayer.animate({
      color: theme.primary,
      opacity: 1
    });
    item.iconLayer.color = theme.primary;
    ref = item.siblings;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      sib = ref[j];
      sib.labelLayer.animate({
        color: '#777'
      });
      results.push(sib.iconLayer.color = '#777');
    }
    return results;
  };

  return BottomNav;

})(Layer);

exports.Page = Page = (function(superClass) {
  extend(Page, superClass);

  function Page(options) {
    var ref, ref1, ref2;
    if (options == null) {
      options = {};
    }
    this._header = (ref = options.header) != null ? ref : {
      title: 'Default',
      visible: true,
      icon: 'menu',
      iconAction: function() {
        return null;
      }
    };
    this._template = options.template;
    this._templateOpacity = (ref1 = options.templateOpacity) != null ? ref1 : .5;
    this._onLoad = (ref2 = options.onLoad) != null ? ref2 : function() {
      return null;
    };
    if (this._header.iconAction) {
      this._header.iconAction = _.bind(this._header.iconAction, this);
    }
    if (this._onLoad) {
      this._onLoad = _.bind(this._onLoad, this);
    }
    Page.__super__.constructor.call(this, _.defaults(options, {
      name: 'Page',
      size: Screen.size,
      scrollHorizontal: false,
      backgroundColor: theme.page.primary.backgroundColor
    }));
    this.contentInset = {
      top: 0,
      bottom: 500
    };
    this.content.backgroundColor = null;
    if (this._template != null) {
      this._template.props = {
        parent: this,
        opacity: this._templateOpacity
      };
    }
    this.sendToBack();
  }

  Page.prototype.update = function() {
    return null;
  };

  return Page;

})(ScrollComponent);

exports.RowItem = RowItem = (function(superClass) {
  extend(RowItem, superClass);

  function RowItem(options) {
    var ref, ref1, ref2;
    if (options == null) {
      options = {};
    }
    this._icon = options.icon;
    this._iconBackgroundColor = (ref = options.iconBackgroundColor) != null ? ref : '#777';
    this._text = (ref1 = options.text) != null ? ref1 : 'Row item';
    this._row = (ref2 = options.row) != null ? ref2 : 0;
    this._y = 32 + (this._row * 48);
    RowItem.__super__.constructor.call(this, _.defaults(options, {
      width: Screen.width,
      y: this._y,
      height: 48,
      backgroundColor: null
    }));
    this.icon = new Layer({
      name: '.',
      parent: this,
      x: 16,
      y: Align.center,
      height: 32,
      width: 32,
      borderRadius: 16,
      backgroundColor: this._iconBackgroundColor,
      image: this._icon
    });
    this.labelLayer = new type.Regular({
      name: '.',
      parent: this,
      x: this.icon.maxX + 16,
      y: Align.center,
      color: theme.text.text,
      text: this._text
    });
  }

  return RowItem;

})(Layer);

MenuButton = (function(superClass) {
  extend(MenuButton, superClass);

  function MenuButton(options) {
    var ref, ref1, ref2;
    if (options == null) {
      options = {};
    }
    this._icon = (ref = options.icon) != null ? ref : 'home';
    this._text = (ref1 = options.text) != null ? ref1 : 'Default';
    this._action = (ref2 = options.action) != null ? ref2 : function() {
      return null;
    };
    MenuButton.__super__.constructor.call(this, _.defaults(options, {
      height: 48,
      width: 304,
      backgroundColor: null
    }));
    this.iconLayer = new Icon({
      name: '.',
      parent: this,
      y: Align.center,
      icon: this._icon,
      color: theme.menuOverlay.text
    });
    this.labelLayer = new type.Regular({
      name: 'label',
      parent: this,
      x: this.iconLayer.maxX + 16,
      y: Align.center(),
      color: theme.menuOverlay.text,
      text: this._text
    });
    this.onTap(this._action);
    this.onTap(function() {
      return Utils.delay(.25, (function(_this) {
        return function() {
          return _this.parent.hide();
        };
      })(this));
    });
  }

  return MenuButton;

})(Layer);

exports.MenuOverlay = MenuOverlay = (function(superClass) {
  extend(MenuOverlay, superClass);

  function MenuOverlay(options) {
    var i, j, len, link, links, ref, ref1, ref2, ref3;
    if (options == null) {
      options = {};
    }
    this._links = (ref = options.links) != null ? ref : [
      {
        title: 'Home',
        icon: 'home',
        action: function() {
          return null;
        }
      }
    ];
    this._title = (ref1 = options.title) != null ? ref1 : 'Menu';
    this._image = (ref2 = options.image) != null ? ref2 : null;
    MenuOverlay.__super__.constructor.call(this, _.defaults(options, {
      height: Screen.height,
      width: 304,
      height: Screen.height,
      visible: false,
      backgroundColor: theme.menuOverlay.backgroundColor,
      animationOptions: {
        curve: "spring(300, 35, 0)"
      }
    }));
    this.scrim = new Layer({
      name: '.',
      size: Screen.size,
      backgroundColor: 'rgba(0,0,0,.6)',
      opacity: 0,
      visible: false,
      animationOptions: {
        time: .25
      }
    });
    this.scrim.onTap((function(_this) {
      return function() {
        return _this.hide();
      };
    })(this));
    this.onSwipeLeftEnd((function(_this) {
      return function() {
        return _this.hide();
      };
    })(this));
    this.header = new Layer({
      name: '.',
      parent: this,
      width: this.width,
      height: 173,
      image: theme.user.image,
      backgroundColor: theme.menuOverlay.header.backgroundColor
    });
    this.titleIcon = new Layer({
      name: '.',
      parent: this.header,
      x: 16,
      y: 40,
      height: 64,
      width: 64,
      borderRadius: 32,
      backgroundColor: theme.menuOverlay.header.icon
    });
    this.subheaderExpand = new Icon({
      name: '.',
      parent: this.header,
      x: Align.right(-16),
      y: Align.bottom(-16),
      icon: 'menu-down',
      color: theme.menuOverlay.subheader.text
    });
    this.subheader = new type.Body1({
      name: '.',
      parent: this.header,
      width: this.width,
      x: 16,
      y: Align.bottom(-18),
      text: this._title,
      color: theme.menuOverlay.subheader.text
    });
    links = [];
    ref3 = this._links;
    for (i = j = 0, len = ref3.length; j < len; i = ++j) {
      link = ref3[i];
      links[i] = new MenuButton({
        name: '.',
        parent: this,
        x: 16,
        y: 189 + (48 * i),
        text: link.title,
        icon: link.icon,
        action: link.action
      });
    }
  }

  MenuOverlay.prototype.show = function() {
    this.bringToFront();
    this.visible = true;
    this.x = -Screen.width;
    this.animate({
      x: 0
    });
    this.scrim.placeBehind(this);
    this.scrim.visible = true;
    return this.scrim.animate({
      opacity: 1
    });
  };

  MenuOverlay.prototype.hide = function() {
    this.animate({
      x: -Screen.width
    });
    this.scrim.animate({
      opacity: 0
    });
    return Utils.delay(.3, (function(_this) {
      return function() {
        _this.visible = false;
        _this.scrim.visible = false;
        _this.sendToBack();
        return _this.scrim.sendToBack();
      };
    })(this));
  };

  return MenuOverlay;

})(Layer);

exports.Dialog = Dialog = (function(superClass) {
  extend(Dialog, superClass);

  function Dialog(options) {
    var button, buttonsY, j, len, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;
    if (options == null) {
      options = {};
    }
    this.close = bind(this.close, this);
    this.open = bind(this.open, this);
    Dialog.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      size: Screen.size,
      color: theme.tint,
      backgroundColor: 'rgba(0, 0, 0, .5)',
      opacity: 0
    }));
    this._title = (ref = options.title) != null ? ref : 'Default Title';
    this._body = (ref1 = options.body) != null ? ref1 : 'Body text goes here.';
    this._acceptText = (ref2 = options.acceptText) != null ? ref2 : 'confirm';
    this._acceptAction = (ref3 = options.acceptAction) != null ? ref3 : function() {
      return null;
    };
    this._declineText = (ref4 = options.declineText) != null ? ref4 : '';
    this._declineAction = (ref5 = options.declineAction) != null ? ref5 : function() {
      return null;
    };
    this.on(Events.Tap, function(event) {
      return event.stopPropagation();
    });
    this.container = new Layer({
      name: 'container',
      parent: this,
      x: Align.center,
      height: 128,
      width: Screen.width - 80,
      backgroundColor: theme.dialog.backgroundColor,
      shadowX: 0,
      shadowY: 7,
      shadowBlur: 30,
      opacity: 0,
      shadowColor: 'rgba(0,0,0,.3)'
    });
    this.title = new type.Title({
      name: '.',
      parent: this.container,
      x: 24,
      y: 20,
      fontSize: 16,
      fontWeight: 500,
      color: theme.text.title,
      text: this._title
    });
    this.body = new type.SubheadSecondary({
      name: 'body',
      parent: this.container,
      x: 24,
      y: 52,
      width: this.container.width - 42,
      text: this._body
    });
    buttonsY = this._body === '' ? 128 : this.body.maxY + 16;
    this.accept = new Button({
      name: '.',
      parent: this.container,
      x: Align.right(-16),
      y: buttonsY,
      text: this._acceptText.toUpperCase(),
      action: this._acceptAction
    });
    if (this._declineText !== '') {
      this.decline = new Button({
        name: '.',
        parent: this.container,
        x: 0,
        y: buttonsY,
        text: this._declineText.toUpperCase(),
        action: this._declineAction
      });
    }
    this.container.height = this.accept.maxY + 12;
    if ((ref6 = this.decline) != null) {
      ref6.maxX = this.accept.x - 16;
    }
    this.container.y = Align.center(16);
    ref7 = [this.accept, this.decline];
    for (j = 0, len = ref7.length; j < len; j++) {
      button = ref7[j];
      if (button != null) {
        button.onTap(this.close);
      }
    }
    this.open();
  }

  Dialog.prototype.open = function() {
    this.animate({
      opacity: 1,
      options: {
        time: .25
      }
    });
    return this.container.animate({
      opacity: 1,
      options: {
        time: .25,
        delay: .05
      }
    });
  };

  Dialog.prototype.close = function() {
    this.container.animate({
      opacity: 0,
      options: {
        time: .25
      }
    });
    this.animate({
      opacity: 0,
      options: {
        time: .25
      }
    });
    return Utils.delay(.5, (function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
  };

  return Dialog;

})(Layer);

exports.Button = Button = Button = (function(superClass) {
  extend(Button, superClass);

  function Button(options) {
    var ref, ref1, ref2;
    if (options == null) {
      options = {};
    }
    this._raised = (ref = options.raised) != null ? ref : false;
    this._type = this._raised ? 'raised' : 'flat';
    this._action = (ref1 = options.action) != null ? ref1 : function() {
      return null;
    };
    Button.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      width: 0,
      height: 36,
      borderRadius: 2,
      backgroundColor: theme.button[this._type].backgroundColor,
      shadowY: theme.button[this._type].shadowY,
      shadowBlur: theme.button[this._type].shadowBlur,
      shadowColor: theme.button[this._type].shadowColor,
      animationOptions: {
        time: .15
      }
    }));
    this.labelLayer = new type.Button({
      name: '.',
      parent: this,
      color: theme.button[this._type].color,
      text: (ref2 = options.text) != null ? ref2 : 'button',
      textTransform: 'uppercase',
      textAlign: 'center',
      animationOptions: {
        time: .15
      },
      padding: {
        left: 16.5,
        right: 16.5,
        top: 9,
        bottom: 11
      }
    });
    this.size = this.labelLayer.size;
    this.x = options.x;
    this.onTouchStart(function(event) {
      this.showTouched();
      return Utils.delay(1, (function(_this) {
        return function() {
          return _this.reset();
        };
      })(this));
    });
    this.onTouchEnd(function(event) {
      this._action();
      return this.reset();
    });
  }

  Button.prototype.showTouched = function() {
    this.labelLayer.animate({
      brightness: 110,
      saturate: 110
    });
    switch (this._type) {
      case 'flat':
        return this.animate({
          backgroundColor: 'rgba(0,0,0,.05)'
        });
      case 'raised':
        ripple(this, event.point, this.labelLayer);
        return this.animate({
          shadowY: 3,
          shadowSpread: 1
        });
    }
  };

  Button.prototype.reset = function() {
    this.labelLayer.animate({
      brightness: 100,
      saturate: 100
    });
    this.backgroundColor = theme.button[this._type].backgroundColor;
    return this.animate({
      shadowY: theme.button[this._type].shadowY,
      shadowSpread: 0
    });
  };

  return Button;

})(Layer);

exports.Fab = Fab = Fab = (function(superClass) {
  extend(Fab, superClass);

  function Fab(options) {
    var ref, ref1, ref2;
    if (options == null) {
      options = {};
    }
    this._raised = (ref = options.raised) != null ? ref : false;
    this._action = (ref1 = options.action) != null ? ref1 : function() {
      return null;
    };
    this._icon = (ref2 = options.icon) != null ? ref2 : 'plus';
    Fab.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      x: Align.right(-16),
      y: Align.bottom(-66),
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.fab.backgroundColor,
      shadowY: 2,
      shadowBlur: 3,
      shadowColor: 'rgba(0,0,0,.25)',
      animationOptions: {
        time: .15
      }
    }));
    if (app.bottomNav != null) {
      this.y -= app.bottomNav.height;
    }
    this.iconLayer = new Icon({
      name: '.',
      parent: this,
      x: Align.center,
      y: Align.center,
      icon: this._icon,
      color: theme.fab.color
    });
    this.onTouchStart(function(event) {
      this.showTouched();
      return Utils.delay(1, (function(_this) {
        return function() {
          return _this.reset();
        };
      })(this));
    });
    this.onTouchEnd(function(event) {
      this._action();
      return this.reset();
    });
  }

  Fab.prototype.showTouched = function() {
    ripple(this, event.point, this.iconLayer);
    return this.animate({
      shadowY: 3,
      shadowSpread: 1
    });
  };

  Fab.prototype.reset = function() {
    return this.animate({
      shadowY: 2,
      shadowSpread: 0
    });
  };

  return Fab;

})(Layer);

exports.GridList = GridList = GridList = (function(superClass) {
  extend(GridList, superClass);

  function GridList(options) {
    var ref, ref1;
    if (options == null) {
      options = {};
    }
    this._columns = (ref = options.columns) != null ? ref : 2;
    GridList.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      width: Screen.width,
      backgroundColor: null
    }));
    this.tiles = [];
    this.tileWidth = (this.width - 24) / this._columns;
    this.tileHeight = (ref1 = options.tileHeight) != null ? ref1 : Screen.width / this._columns;
  }

  GridList.prototype.addTile = function(tile) {
    var ref, ref1;
    tile.i = this.tiles.length;
    this.tiles.push(tile);
    tile.x = 8 + (this.tileWidth + 8) * (tile.i % this._columns);
    tile.y = 8 + (this.tileHeight + 8) * Math.floor(tile.i / this._columns);
    this.height = _.last(this.tiles).maxY;
    if (((ref = this.parent) != null ? (ref1 = ref.parent) != null ? ref1.content : void 0 : void 0) != null) {
      return this.parent.parent.updateContent();
    }
  };

  return GridList;

})(Layer);

exports.Tile = Tile = Tile = (function(superClass) {
  extend(Tile, superClass);

  function Tile(options) {
    var ref, ref1, ref2, ref3, ref4, ref5;
    if (options == null) {
      options = {};
    }
    this._header = (ref = options.header) != null ? ref : false;
    this._footer = (ref1 = options.footer) != null ? ref1 : false;
    if (this._header && this._footer) {
      throw 'Tile cannot have both a header and a footer.';
    }
    this._icon = options.icon;
    this._gridList = (function() {
      if ((ref2 = options.gridList) != null) {
        return ref2;
      } else {
        throw 'Tile needs a grid property.';
      }
    })();
    Tile.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      parent: this._gridList,
      width: this._gridList.tileWidth,
      height: this._gridList.tileHeight
    }));
    if (this._header || this._footer) {
      this.header = new Layer({
        name: '.',
        parent: this,
        y: this._footer ? Align.bottom() : void 0,
        width: this.width,
        height: options.support ? 68 : 48,
        backgroundColor: (ref3 = options.backgroundColor) != null ? ref3 : 'rgba(0,0,0,.5)'
      });
      if (options.title) {
        this.header.title = new type.Regular({
          name: '.',
          parent: this.header,
          x: 8,
          y: options.support ? 12 : Align.center(),
          color: this.color,
          text: (ref4 = options.title) != null ? ref4 : 'Two Line'
        });
        if (options.support) {
          this.header.support = new TextLayer({
            name: '.',
            parent: this.header,
            x: 8,
            y: 35,
            fontSize: 12,
            fontFamily: 'Roboto',
            color: this.color,
            text: (ref5 = options.support) != null ? ref5 : 'Support text'
          });
        }
      }
      if (options.icon) {
        this.header.icon = new Icon({
          name: '.',
          parent: this.header,
          x: Align.right(-12),
          y: options.support ? 20 : Align.center(),
          icon: options.icon,
          color: this.color
        });
      }
    }
    this.i = void 0;
    this._gridList.addTile(this);
  }

  return Tile;

})(Layer);


},{"ripple":"ripple","theme":"theme","type":"type"}],"ripple":[function(require,module,exports){
var ripple;

ripple = function(layer, point, placeBehind, color) {
  var longSide, mask, rippleCircle;
  if (layer == null) {
    throw 'Ripple requires a Layer. Try myLayer.onTouchStart (event) -> ripple(@, event.point)';
  }
  if (point == null) {
    throw 'Ripple requires a point. Try myLayer.onTouchStart (event) -> ripple(@, event.point)';
  }
  mask = new Layer({
    name: '.',
    parent: layer,
    size: layer.size,
    borderRadius: layer.borderRadius,
    backgroundColor: null,
    clip: true,
    opacity: 0,
    animationOptions: {
      time: .15
    }
  });
  if (placeBehind) {
    mask.placeBehind(placeBehind);
  }
  longSide = layer.width > layer.height ? layer.width : layer.height;
  rippleCircle = new Layer({
    name: '.',
    parent: mask,
    x: point.x - 16,
    y: point.y - 16,
    width: 32,
    height: 32,
    borderRadius: longSide
  });
  if (color != null) {
    rippleCircle.props = {
      backgroundColor: color
    };
  } else {
    rippleCircle.props = {
      backgroundColor: layer.backgroundColor,
      saturate: 150,
      brightness: 120,
      opacity: .3
    };
  }
  mask.animate({
    opacity: 1,
    options: {
      time: .15
    }
  });
  rippleCircle.animate({
    x: rippleCircle.x - longSide * 1.3,
    y: rippleCircle.y - longSide * 1.3,
    width: longSide * 2.6,
    height: longSide * 2.6,
    options: {
      time: .5
    }
  });
  Utils.delay(2, function() {
    mask.animate({
      opacity: 0
    });
    return mask.onAnimationEnd(mask.destroy);
  });
  return layer.onTouchEnd(function() {
    mask.animate({
      opacity: 0
    });
    return mask.onAnimationEnd(mask.destroy);
  });
};

exports.ripple = ripple;


},{}],"theme":[function(require,module,exports){
var menuColor, menuInvert, menuTextColor, modifyColor, primaryColor, primaryInvert, secondaryColor, source, theme;

modifyColor = function(color, h, s, l) {
  var clip, newColor;
  clip = _.replace(_.replace(color.toHslString().slice(4, -1), '%', ''), '%', '').split(', ');
  newColor = new Color({
    h: _.parseInt(clip[0]) + h,
    s: (_.parseInt(clip[1]) + s) / 100,
    l: (_.parseInt(clip[2]) + l) / 100,
    a: 1
  });
  return newColor;
};

primaryColor = primary_color.backgroundColor;

primaryInvert = 100 - (primary_invert.opacity * 100);

secondaryColor = secondary_color.backgroundColor;

menuColor = menu_color.backgroundColor;

menuTextColor = menu_text_color.color;

menuInvert = 100 - (menu_invert.opacity * 100);

source = {
  colors: {
    primary: {
      main: primaryColor,
      light: modifyColor(primaryColor, 13, -5, 15),
      dark: modifyColor(primaryColor, -1, -7, -12),
      text: primary_text_color.color,
      invert: primaryInvert
    },
    secondary: {
      main: secondaryColor,
      light: modifyColor(secondaryColor, 13, -5, 15),
      dark: modifyColor(secondaryColor, -1, -7, -12),
      text: secondary_text_color.color
    },
    menu: {
      light: menuColor,
      text: menuTextColor,
      invert: menuInvert
    }
  }
};

theme = {
  tint: source.colors.secondary.main,
  primary: source.colors.primary.main,
  primaryInvert: primaryInvert,
  secondary: source.colors.secondary.main,
  menu: source.colors.menu.light,
  menuInvert: source.colors.menu.invert,
  user: {
    image: void 0
  },
  header: {
    backgroundColor: source.colors.primary.main,
    title: source.colors.primary.text,
    invert: primaryInvert,
    icon: {
      color: source.colors.primary.text
    },
    tabs: {
      backgroundColor: source.colors.primary.light,
      color: source.colors.primary.text,
      selector: source.colors.secondary.main
    }
  },
  statusBar: {
    image: 'images/status_bar.png',
    backgroundColor: source.colors.primary.dark,
    invert: primaryInvert
  },
  bottomNav: {
    backgroundColor: '#FFFFFF',
    shadowY: -2,
    shadowBlur: 6,
    shadowColor: 'rgba(0,0,0,.1)'
  },
  page: {
    primary: {
      backgroundColor: '#E1E2E1'
    },
    secondary: {
      backgroundColor: '#F5F5F6'
    }
  },
  menuOverlay: {
    header: {
      backgroundColor: source.colors.secondary.main,
      icon: source.colors.secondary.light
    },
    subheader: {
      color: source.colors.menu.text
    },
    backgroundColor: source.colors.menu.light,
    text: source.colors.menu.text,
    slider: {
      knob: source.colors.secondary.light,
      fill: source.colors.secondary.dark
    },
    invert: source.colors.menu.invert
  },
  button: {
    flat: {
      backgroundColor: null,
      color: source.colors.secondary.main,
      shadowY: 0,
      shadowColor: 'rgba(0,0,0,.18)',
      shadowBlur: 0
    },
    raised: {
      backgroundColor: source.colors.secondary.main,
      color: source.colors.secondary.text,
      shadowY: 2,
      shadowColor: 'rgba(0,0,0,.18)',
      shadowBlur: 6
    }
  },
  fab: {
    backgroundColor: source.colors.secondary.main,
    color: source.colors.secondary.text,
    invert: primaryInvert
  },
  dialog: {
    backgroundColor: '#FAFAFA'
  },
  text: {
    primary: source.colors.primary.text,
    secondary: source.colors.secondary.text
  },
  table: {
    backgroundColor: '#FFFFFF',
    text: source.colors.primary.text,
    checkBox: {
      backgroundColor: null,
      borderColor: '#D3D3D3'
    },
    selected: {
      backgroundColor: source.colors.secondary.main,
      text: source.colors.primary.text,
      checkBox: {
        backgroundColor: source.colors.secondary.dark,
        borderColor: null
      }
    }
  },
  slider: {
    knob: source.colors.primary.light,
    fill: source.colors.primary.dark
  },
  card: {
    header: source.colors.secondary.dark
  },
  navBar: {
    backgroundColor: '#000000'
  },
  keyboard: {
    image: 'images/keyboard.png'
  }
};

color_pallete.destroy();

exports.theme = theme;


},{}],"type":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Utils.insertCSS("@font-face {\n  font-family: \"Roboto\";\n  src: url(\"fonts/Roboto-Regular.ttf\");");

exports.Headline = (function(superClass) {
  extend(Headline, superClass);

  function Headline(options) {
    Headline.__super__.constructor.call(this, _.defaults(options, {
      fontFamily: 'Roboto',
      fontSize: 24,
      fontWeight: 400,
      lineHeight: 1.3,
      color: 'rgba(0,0,0,.87)'
    }));
  }

  return Headline;

})(TextLayer);

exports.SubheadSecondary = (function(superClass) {
  extend(SubheadSecondary, superClass);

  function SubheadSecondary(options) {
    SubheadSecondary.__super__.constructor.call(this, _.defaults(options, {
      fontFamily: 'Roboto',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.5,
      color: 'rgba(0,0,0,.54)'
    }));
  }

  return SubheadSecondary;

})(TextLayer);

exports.Title = (function(superClass) {
  extend(Title, superClass);

  function Title(options) {
    Title.__super__.constructor.call(this, _.defaults(options, {
      fontFamily: 'Roboto',
      fontSize: 20,
      fontWeight: 500,
      lineHeight: 1.3,
      color: 'rgba(0,0,0,.87)'
    }));
  }

  return Title;

})(TextLayer);

exports.Regular = (function(superClass) {
  extend(Regular, superClass);

  function Regular(options) {
    Regular.__super__.constructor.call(this, _.defaults(options, {
      fontFamily: 'Roboto',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.3,
      color: 'rgba(0,0,0,.87)'
    }));
  }

  return Regular;

})(TextLayer);

exports.Body2 = (function(superClass) {
  extend(Body2, superClass);

  function Body2(options) {
    Body2.__super__.constructor.call(this, _.defaults(options, {
      fontFamily: 'Roboto',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.3,
      color: 'rgba(0,0,0,.87)'
    }));
  }

  return Body2;

})(TextLayer);

exports.Menu = (function(superClass) {
  extend(Menu, superClass);

  function Menu(options) {
    Menu.__super__.constructor.call(this, _.defaults(options, {
      fontFamily: 'Roboto',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.7,
      color: 'rgba(0,0,0,.87)'
    }));
  }

  return Menu;

})(TextLayer);

exports.Body1 = (function(superClass) {
  extend(Body1, superClass);

  function Body1(options) {
    Body1.__super__.constructor.call(this, _.defaults(options, {
      fontFamily: 'Roboto',
      fontSize: 14,
      fontWeight: 400,
      lineHeight: 1.4,
      color: 'rgba(0,0,0,.87)'
    }));
  }

  return Body1;

})(TextLayer);

exports.Caption = (function(superClass) {
  extend(Caption, superClass);

  function Caption(options) {
    Caption.__super__.constructor.call(this, _.defaults(options, {
      fontFamily: 'Roboto',
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.3,
      color: 'rgba(0,0,0,.54)'
    }));
  }

  return Caption;

})(TextLayer);

exports.Button = (function(superClass) {
  extend(Button, superClass);

  function Button(options) {
    Button.__super__.constructor.call(this, _.defaults(options, {
      fontFamily: 'Roboto',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.3,
      color: '#009688',
      letterSpacing: 0.5,
      padding: {
        left: 4,
        right: 4,
        top: 8,
        bottom: 0
      }
    }));
  }

  return Button;

})(TextLayer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXZlcnVpei9MaWJyYXJ5L01vYmlsZSBEb2N1bWVudHMvY29tfmFwcGxlfkNsb3VkRG9jcy9HaXRIdWIvZnJhbWVyLW1kL01hdGVyaWFsLmZyYW1lci9tb2R1bGVzL3R5cGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RldmVydWl6L0xpYnJhcnkvTW9iaWxlIERvY3VtZW50cy9jb21+YXBwbGV+Q2xvdWREb2NzL0dpdEh1Yi9mcmFtZXItbWQvTWF0ZXJpYWwuZnJhbWVyL21vZHVsZXMvdGhlbWUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RldmVydWl6L0xpYnJhcnkvTW9iaWxlIERvY3VtZW50cy9jb21+YXBwbGV+Q2xvdWREb2NzL0dpdEh1Yi9mcmFtZXItbWQvTWF0ZXJpYWwuZnJhbWVyL21vZHVsZXMvcmlwcGxlLmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXZlcnVpei9MaWJyYXJ5L01vYmlsZSBEb2N1bWVudHMvY29tfmFwcGxlfkNsb3VkRG9jcy9HaXRIdWIvZnJhbWVyLW1kL01hdGVyaWFsLmZyYW1lci9tb2R1bGVzL21kLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIyBcdGQ4ODg4ODhQICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRQXG4jIFx0ICAgODggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODhcbiMgXHQgICA4OCAgICBkUCAgICBkUCA4OGQ4ODhiLiAuZDg4ODhiLiAuZDg4ODhiLiA4OGQ4ODhiLiAuZDg4ODhiLiA4OGQ4ODhiLiA4OGQ4ODhiLiBkUCAgICBkUFxuIyBcdCAgIDg4ICAgIDg4ICAgIDg4IDg4JyAgYDg4IDg4JyAgYDg4IDg4JyAgYDg4IDg4JyAgYDg4IDg4JyAgYDg4IDg4JyAgYDg4IDg4JyAgYDg4IDg4ICAgIDg4XG4jIFx0ICAgODggICAgODguICAuODggODguICAuODggODguICAuODggODguICAuODggODggICAgICAgODguICAuODggODguICAuODggODggICAgODggODguICAuODhcbiMgXHQgICBkUCAgICBgODg4OFA4OCA4OFk4ODhQJyBgODg4ODhQJyBgODg4OFA4OCBkUCAgICAgICBgODg4ODhQOCA4OFk4ODhQJyBkUCAgICBkUCBgODg4OFA4OFxuIyBcdCAgICAgICAgICAgICAgLjg4IDg4ICAgICAgICAgICAgICAgICAgICAgLjg4ICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgICAgLjg4XG4jIFx0ICAgICAgICAgIGQ4ODg4UCAgZFAgICAgICAgICAgICAgICAgIGQ4ODg4UCAgICAgICAgICAgICAgICAgICAgZFAgICAgICAgICAgICAgICAgIGQ4ODg4UFxuXG5VdGlscy5pbnNlcnRDU1MoXG5cdFwiXCJcIlxuICAgIEBmb250LWZhY2Uge1xuICAgICAgZm9udC1mYW1pbHk6IFwiUm9ib3RvXCI7XG4gICAgICBzcmM6IHVybChcImZvbnRzL1JvYm90by1SZWd1bGFyLnR0ZlwiKTtcbiAgICBcIlwiXCIpXG5cbmNsYXNzIGV4cG9ydHMuSGVhZGxpbmUgZXh0ZW5kcyBUZXh0TGF5ZXJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGZvbnRGYW1pbHk6ICdSb2JvdG8nXG5cdFx0XHRmb250U2l6ZTogMjRcblx0XHRcdGZvbnRXZWlnaHQ6IDQwMFxuXHRcdFx0bGluZUhlaWdodDogMS4zXG5cdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsLjg3KSdcblxuY2xhc3MgZXhwb3J0cy5TdWJoZWFkU2Vjb25kYXJ5IGV4dGVuZHMgVGV4dExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRmb250RmFtaWx5OiAnUm9ib3RvJ1xuXHRcdFx0Zm9udFNpemU6IDE2XG5cdFx0XHRmb250V2VpZ2h0OiA0MDAsIFxuXHRcdFx0bGluZUhlaWdodDogMS41LFxuXHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLC41NCknXG5cbmNsYXNzIGV4cG9ydHMuVGl0bGUgZXh0ZW5kcyBUZXh0TGF5ZXJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGZvbnRGYW1pbHk6ICdSb2JvdG8nXG5cdFx0XHRmb250U2l6ZTogMjBcblx0XHRcdGZvbnRXZWlnaHQ6IDUwMFxuXHRcdFx0bGluZUhlaWdodDogMS4zXG5cdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsLjg3KSdcbmNsYXNzIGV4cG9ydHMuUmVndWxhciBleHRlbmRzIFRleHRMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0Zm9udEZhbWlseTogJ1JvYm90bydcblx0XHRcdGZvbnRTaXplOiAxNlxuXHRcdFx0Zm9udFdlaWdodDogNDAwXG5cdFx0XHRsaW5lSGVpZ2h0OiAxLjNcblx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwuODcpJ1xuY2xhc3MgZXhwb3J0cy5Cb2R5MiBleHRlbmRzIFRleHRMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0Zm9udEZhbWlseTogJ1JvYm90bydcblx0XHRcdGZvbnRTaXplOiAxNFxuXHRcdFx0Zm9udFdlaWdodDogNTAwXG5cdFx0XHRsaW5lSGVpZ2h0OiAxLjNcblx0XHRcdGNvbG9yOiAncmdiYSgwLDAsMCwuODcpJ1xuY2xhc3MgZXhwb3J0cy5NZW51IGV4dGVuZHMgVGV4dExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRmb250RmFtaWx5OiAnUm9ib3RvJ1xuXHRcdFx0Zm9udFNpemU6IDE0XG5cdFx0XHRmb250V2VpZ2h0OiA1MDBcblx0XHRcdGxpbmVIZWlnaHQ6IDEuN1xuXHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLC44NyknXG5jbGFzcyBleHBvcnRzLkJvZHkxIGV4dGVuZHMgVGV4dExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRmb250RmFtaWx5OiAnUm9ib3RvJ1xuXHRcdFx0Zm9udFNpemU6IDE0XG5cdFx0XHRmb250V2VpZ2h0OiA0MDBcblx0XHRcdGxpbmVIZWlnaHQ6IDEuNFxuXHRcdFx0Y29sb3I6ICdyZ2JhKDAsMCwwLC44NyknXG5jbGFzcyBleHBvcnRzLkNhcHRpb24gZXh0ZW5kcyBUZXh0TGF5ZXJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zKSAtPlxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGZvbnRGYW1pbHk6ICdSb2JvdG8nXG5cdFx0XHRmb250U2l6ZTogMTJcblx0XHRcdGZvbnRXZWlnaHQ6IDQwMFxuXHRcdFx0bGluZUhlaWdodDogMS4zXG5cdFx0XHRjb2xvcjogJ3JnYmEoMCwwLDAsLjU0KSdcbmNsYXNzIGV4cG9ydHMuQnV0dG9uIGV4dGVuZHMgVGV4dExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRmb250RmFtaWx5OiAnUm9ib3RvJ1xuXHRcdFx0Zm9udFNpemU6IDE0XG5cdFx0XHRmb250V2VpZ2h0OiA1MDBcblx0XHRcdGxpbmVIZWlnaHQ6IDEuM1xuXHRcdFx0Y29sb3I6ICcjMDA5Njg4J1xuXHRcdFx0bGV0dGVyU3BhY2luZzogMC41XG5cdFx0XHRwYWRkaW5nOiB7bGVmdDogNCwgcmlnaHQ6IDQsIHRvcDogOCwgYm90dG9tOiAwfSwiLCJcbiMgICBkUCAgIGRQICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiMgICA4OCAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiMgZDg4ODhQIDg4ZDg4OGIuIC5kODg4OGIuIDg4ZDhiLmQ4Yi4gLmQ4ODg4Yi4gLmQ4ODg4Yi5cbiMgICA4OCAgIDg4JyAgYDg4IDg4b29vb2Q4IDg4J2A4OCdgODggODhvb29vZDggWThvb29vby5cbiMgICA4OCAgIDg4ICAgIDg4IDg4LiAgLi4uIDg4ICA4OCAgODggODguICAuLi4gICAgICAgODhcbiMgICBkUCAgIGRQICAgIGRQIGA4ODg4OFAnIGRQICBkUCAgZFAgYDg4ODg4UCcgYDg4ODg4UCdcblxuIyBXaGVuIGxvYWRlZCwgdGhpcyBtb2R1bGUgd2lsbCBhdHRlbXB0IHRvIGNyZWF0ZSBhIG5ldyB0aGVtZSBiYXNlZCBvbiBcbiMgdGhlIERlc2lnbiBNb2RlIHRlbXBsYXRlLiBJdHMgZGVmYXVsdCB2YWx1ZXMgd2lsbCBiZSBmb3IgYSBcIkxpZ2h0XCIgdGhlbWUuXG5cbm1vZGlmeUNvbG9yID0gKGNvbG9yLCBoLCBzLCBsKSAtPlxuXHRjbGlwID0gXy5yZXBsYWNlKF8ucmVwbGFjZShjb2xvci50b0hzbFN0cmluZygpLnNsaWNlKDQsIC0xKSwgJyUnLCAnJyksICclJywgJycpIC5zcGxpdCgnLCAnKVxuXG5cdG5ld0NvbG9yID0gbmV3IENvbG9yKFxuXHRcdGg6IF8ucGFyc2VJbnQoY2xpcFswXSkgKyBoLCBcblx0XHRzOiAoXy5wYXJzZUludChjbGlwWzFdKSArIHMpLzEwMCwgXG5cdFx0bDogKF8ucGFyc2VJbnQoY2xpcFsyXSkgKyBsKS8xMDAsIFxuXHRcdGE6IDEpXG5cdFxuXHRyZXR1cm4gbmV3Q29sb3JcblxucHJpbWFyeUNvbG9yID0gcHJpbWFyeV9jb2xvci5iYWNrZ3JvdW5kQ29sb3JcbnByaW1hcnlJbnZlcnQgPSAxMDAgLSAocHJpbWFyeV9pbnZlcnQub3BhY2l0eSAqIDEwMClcbnNlY29uZGFyeUNvbG9yID0gc2Vjb25kYXJ5X2NvbG9yLmJhY2tncm91bmRDb2xvclxubWVudUNvbG9yID0gbWVudV9jb2xvci5iYWNrZ3JvdW5kQ29sb3Jcbm1lbnVUZXh0Q29sb3IgPSBtZW51X3RleHRfY29sb3IuY29sb3Jcbm1lbnVJbnZlcnQgPSAxMDAgLSAobWVudV9pbnZlcnQub3BhY2l0eSAqIDEwMClcblxuXG5zb3VyY2UgPVxuXHRjb2xvcnM6XG5cdFx0cHJpbWFyeTpcblx0XHRcdG1haW46IHByaW1hcnlDb2xvclxuXHRcdFx0bGlnaHQ6IG1vZGlmeUNvbG9yKHByaW1hcnlDb2xvciwgMTMsIC01LCAxNSlcblx0XHRcdGRhcms6IG1vZGlmeUNvbG9yKHByaW1hcnlDb2xvciwgLTEsIC03LCAtMTIpXG5cdFx0XHR0ZXh0OiBwcmltYXJ5X3RleHRfY29sb3IuY29sb3Jcblx0XHRcdGludmVydDogcHJpbWFyeUludmVydFxuXHRcdHNlY29uZGFyeTpcblx0XHRcdG1haW46IHNlY29uZGFyeUNvbG9yXG5cdFx0XHRsaWdodDogbW9kaWZ5Q29sb3Ioc2Vjb25kYXJ5Q29sb3IsIDEzLCAtNSwgMTUpXG5cdFx0XHRkYXJrOiBtb2RpZnlDb2xvcihzZWNvbmRhcnlDb2xvciwgLTEsIC03LCAtMTIpXG5cdFx0XHR0ZXh0OiBzZWNvbmRhcnlfdGV4dF9jb2xvci5jb2xvclxuXHRcdG1lbnU6XG5cdFx0XHRsaWdodDogbWVudUNvbG9yXG5cdFx0XHR0ZXh0OiBtZW51VGV4dENvbG9yXG5cdFx0XHRpbnZlcnQ6IG1lbnVJbnZlcnRcblxudGhlbWUgPSBcblx0dGludDogc291cmNlLmNvbG9ycy5zZWNvbmRhcnkubWFpblxuXHRwcmltYXJ5OiBzb3VyY2UuY29sb3JzLnByaW1hcnkubWFpblxuXHRwcmltYXJ5SW52ZXJ0OiBwcmltYXJ5SW52ZXJ0XG5cdHNlY29uZGFyeTogc291cmNlLmNvbG9ycy5zZWNvbmRhcnkubWFpblxuXHRtZW51OiBzb3VyY2UuY29sb3JzLm1lbnUubGlnaHRcblx0bWVudUludmVydDogc291cmNlLmNvbG9ycy5tZW51LmludmVydFxuXG5cdHVzZXI6XG5cdFx0aW1hZ2U6IHVuZGVmaW5lZFxuXG5cdGhlYWRlcjogXG5cdFx0YmFja2dyb3VuZENvbG9yOiBzb3VyY2UuY29sb3JzLnByaW1hcnkubWFpblxuXHRcdHRpdGxlOiBzb3VyY2UuY29sb3JzLnByaW1hcnkudGV4dFxuXHRcdGludmVydDogcHJpbWFyeUludmVydFxuXHRcdGljb246XG5cdFx0XHRjb2xvcjogc291cmNlLmNvbG9ycy5wcmltYXJ5LnRleHRcblx0XHR0YWJzOlxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBzb3VyY2UuY29sb3JzLnByaW1hcnkubGlnaHRcblx0XHRcdGNvbG9yOiBzb3VyY2UuY29sb3JzLnByaW1hcnkudGV4dFxuXHRcdFx0c2VsZWN0b3I6IHNvdXJjZS5jb2xvcnMuc2Vjb25kYXJ5Lm1haW5cblx0XG5cdHN0YXR1c0JhcjogXG5cdFx0aW1hZ2U6ICdpbWFnZXMvc3RhdHVzX2Jhci5wbmcnXG5cdFx0YmFja2dyb3VuZENvbG9yOiBzb3VyY2UuY29sb3JzLnByaW1hcnkuZGFya1xuXHRcdGludmVydDogcHJpbWFyeUludmVydFxuXHRcblx0Ym90dG9tTmF2OlxuXHRcdGJhY2tncm91bmRDb2xvcjogJyNGRkZGRkYnXG5cdFx0c2hhZG93WTogLTJcblx0XHRzaGFkb3dCbHVyOiA2XG5cdFx0c2hhZG93Q29sb3I6ICdyZ2JhKDAsMCwwLC4xKSdcblxuXHRwYWdlOlxuXHRcdHByaW1hcnk6XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjRTFFMkUxJ1xuXHRcdHNlY29uZGFyeTpcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJyNGNUY1RjYnXG5cblx0bWVudU92ZXJsYXk6XG5cdFx0aGVhZGVyOlxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBzb3VyY2UuY29sb3JzLnNlY29uZGFyeS5tYWluXG5cdFx0XHRpY29uOiBzb3VyY2UuY29sb3JzLnNlY29uZGFyeS5saWdodFxuXHRcdHN1YmhlYWRlcjpcblx0XHRcdGNvbG9yOiBzb3VyY2UuY29sb3JzLm1lbnUudGV4dFxuXHRcdGJhY2tncm91bmRDb2xvcjogc291cmNlLmNvbG9ycy5tZW51LmxpZ2h0XG5cdFx0dGV4dDogc291cmNlLmNvbG9ycy5tZW51LnRleHRcblx0XHRzbGlkZXI6IFxuXHRcdFx0a25vYjogc291cmNlLmNvbG9ycy5zZWNvbmRhcnkubGlnaHRcblx0XHRcdGZpbGw6IHNvdXJjZS5jb2xvcnMuc2Vjb25kYXJ5LmRhcmtcblx0XHRpbnZlcnQ6IHNvdXJjZS5jb2xvcnMubWVudS5pbnZlcnRcblxuXHRidXR0b246XG5cdFx0ZmxhdDpcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFx0Y29sb3I6IHNvdXJjZS5jb2xvcnMuc2Vjb25kYXJ5Lm1haW5cblx0XHRcdHNoYWRvd1k6IDBcblx0XHRcdHNoYWRvd0NvbG9yOiAncmdiYSgwLDAsMCwuMTgpJ1xuXHRcdFx0c2hhZG93Qmx1cjogMFxuXG5cdFx0cmFpc2VkOlxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBzb3VyY2UuY29sb3JzLnNlY29uZGFyeS5tYWluXG5cdFx0XHRjb2xvcjogc291cmNlLmNvbG9ycy5zZWNvbmRhcnkudGV4dFxuXHRcdFx0c2hhZG93WTogMlxuXHRcdFx0c2hhZG93Q29sb3I6ICdyZ2JhKDAsMCwwLC4xOCknXG5cdFx0XHRzaGFkb3dCbHVyOiA2XG5cblx0ZmFiOlxuXHRcdGJhY2tncm91bmRDb2xvcjogc291cmNlLmNvbG9ycy5zZWNvbmRhcnkubWFpblxuXHRcdGNvbG9yOiBzb3VyY2UuY29sb3JzLnNlY29uZGFyeS50ZXh0XG5cdFx0aW52ZXJ0OiBwcmltYXJ5SW52ZXJ0XG5cblx0ZGlhbG9nOiBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6JyNGQUZBRkEnXG5cdFxuXHR0ZXh0OiBcblx0XHRwcmltYXJ5OiBzb3VyY2UuY29sb3JzLnByaW1hcnkudGV4dFxuXHRcdHNlY29uZGFyeTogc291cmNlLmNvbG9ycy5zZWNvbmRhcnkudGV4dFxuXHRcblx0dGFibGU6XG5cdFx0YmFja2dyb3VuZENvbG9yOiAnI0ZGRkZGRidcblx0XHR0ZXh0OiBzb3VyY2UuY29sb3JzLnByaW1hcnkudGV4dFxuXHRcdGNoZWNrQm94OlxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHRib3JkZXJDb2xvcjogJyNEM0QzRDMnXG5cdFx0c2VsZWN0ZWQ6XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHNvdXJjZS5jb2xvcnMuc2Vjb25kYXJ5Lm1haW5cblx0XHRcdHRleHQ6IHNvdXJjZS5jb2xvcnMucHJpbWFyeS50ZXh0XG5cdFx0XHRjaGVja0JveDpcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBzb3VyY2UuY29sb3JzLnNlY29uZGFyeS5kYXJrXG5cdFx0XHRcdGJvcmRlckNvbG9yOiBudWxsXG5cblx0c2xpZGVyOlxuXHRcdGtub2I6IHNvdXJjZS5jb2xvcnMucHJpbWFyeS5saWdodFxuXHRcdGZpbGw6IHNvdXJjZS5jb2xvcnMucHJpbWFyeS5kYXJrXG5cblx0Y2FyZDpcblx0XHRoZWFkZXI6IHNvdXJjZS5jb2xvcnMuc2Vjb25kYXJ5LmRhcmtcblx0XG5cdG5hdkJhcjpcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwMDAwJ1xuXHRcblx0a2V5Ym9hcmQ6XG5cdFx0aW1hZ2U6ICdpbWFnZXMva2V5Ym9hcmQucG5nJ1xuXG5jb2xvcl9wYWxsZXRlLmRlc3Ryb3koKVxuXG5leHBvcnRzLnRoZW1lID0gdGhlbWVcbiIsIiMgXHQgODg4ODg4YmEgIG9vICAgICAgICAgICAgICAgICAgIGRQXG4jIFx0IDg4ICAgIGA4YiAgICAgICAgICAgICAgICAgICAgICA4OFxuIyBcdGE4OGFhYWE4UCcgZFAgODhkODg4Yi4gODhkODg4Yi4gODggLmQ4ODg4Yi5cbiMgXHQgODggICBgOGIuIDg4IDg4JyAgYDg4IDg4JyAgYDg4IDg4IDg4b29vb2Q4XG4jIFx0IDg4ICAgICA4OCA4OCA4OC4gIC44OCA4OC4gIC44OCA4OCA4OC4gIC4uLlxuIyBcdCBkUCAgICAgZFAgZFAgODhZODg4UCcgODhZODg4UCcgZFAgYDg4ODg4UCdcbiMgXHQgICAgICAgICAgICAgIDg4ICAgICAgIDg4XG4jIFx0ICAgICAgICAgICAgICBkUCAgICAgICBkUFxuXG4jXHRCeSBkZWZhdWx0LCBzaG93cyBhbiBleHBhbmRpbmcgY2lyY2xlIG92ZXIgYSBsYXllciwgY2xpcHBlZCB0byBpdHMgZnJhbWUuXG4jXHRPbiB0aGUgbGF5ZXIncyB0b3VjaEVuZCBldmVudCwgdGhlIGNpcmNsZSBhbmQgaXRzIG1hc2sgd2lsbCBkaXNhcHBlYXIuXG5cbiNcdHJlcXVpcmVkOlxuI1x0bGF5ZXIgKExheWVyKSwgdGhlIGxheWVyIG92ZXIgd2hpY2ggdG8gc2hvdyB0aGUgcmlwcGxlIGVmZmVjdFxuI1x0cG9pbnQgKG9iamVjdCksIHRoZSByaXBwbGUgb3JpZ2luIHBvaW50LCB1c3VhbGx5IGEgb25Ub3VjaFN0YXJ0J3MgZXZlbnQucG9pbnRcblxuI1x0b3B0aW9uYWw6XG4jXHRwbGFjZUJlaGluZCAoTGF5ZXIpLCBhIGNoaWxkIG9mIGxheWVyIGJlaGluZCB3aGljaCB0aGUgcmlwcGxlIHNob3VsZCBhcHBlYXJcbiNcdGNvbG9yIChzdHJpbmcgb3IgY29sb3Igb2JqZWN0KSwgYSBjdXN0b20gY29sb3IgZm9yIHRoZSByaXBwbGVcblxucmlwcGxlID0gKGxheWVyLCBwb2ludCwgcGxhY2VCZWhpbmQsIGNvbG9yKSAtPlxuXHRcblx0aWYgIWxheWVyPyB0aGVuIHRocm93ICdSaXBwbGUgcmVxdWlyZXMgYSBMYXllci4gVHJ5IG15TGF5ZXIub25Ub3VjaFN0YXJ0IChldmVudCkgLT4gcmlwcGxlKEAsIGV2ZW50LnBvaW50KSdcblx0aWYgIXBvaW50PyB0aGVuIHRocm93ICdSaXBwbGUgcmVxdWlyZXMgYSBwb2ludC4gVHJ5IG15TGF5ZXIub25Ub3VjaFN0YXJ0IChldmVudCkgLT4gcmlwcGxlKEAsIGV2ZW50LnBvaW50KSdcblxuXHRtYXNrID0gbmV3IExheWVyXG5cdFx0bmFtZTogJy4nXG5cdFx0cGFyZW50OiBsYXllclxuXHRcdHNpemU6IGxheWVyLnNpemVcblx0XHRib3JkZXJSYWRpdXM6IGxheWVyLmJvcmRlclJhZGl1c1xuXHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdGNsaXA6IHRydWVcblx0XHRvcGFjaXR5OiAwXG5cdFx0YW5pbWF0aW9uT3B0aW9uczoge3RpbWU6IC4xNX1cblx0XG5cdGlmIHBsYWNlQmVoaW5kIHRoZW4gbWFzay5wbGFjZUJlaGluZChwbGFjZUJlaGluZClcblx0XG5cdCMgUklQUExFIENJUkNMRVxuXHRcblx0bG9uZ1NpZGUgPSBpZiBsYXllci53aWR0aCA+IGxheWVyLmhlaWdodCB0aGVuIGxheWVyLndpZHRoIGVsc2UgbGF5ZXIuaGVpZ2h0XG5cblx0cmlwcGxlQ2lyY2xlID0gbmV3IExheWVyXG5cdFx0XHRuYW1lOiAnLicsIHBhcmVudDogbWFza1xuXHRcdFx0eDogcG9pbnQueCAtIDE2XG5cdFx0XHR5OiBwb2ludC55IC0gMTZcblx0XHRcdHdpZHRoOiAzMiwgaGVpZ2h0OiAzMiwgXG5cdFx0XHRib3JkZXJSYWRpdXM6IGxvbmdTaWRlXG5cdFx0XHRcblx0aWYgY29sb3I/XG5cdFx0cmlwcGxlQ2lyY2xlLnByb3BzID1cblx0XHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0ZWxzZSBcblx0XHRyaXBwbGVDaXJjbGUucHJvcHMgPSBcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbGF5ZXIuYmFja2dyb3VuZENvbG9yXG5cdFx0XHRzYXR1cmF0ZTogMTUwXG5cdFx0XHRicmlnaHRuZXNzOiAxMjBcblx0XHRcdG9wYWNpdHk6IC4zXG5cdFxuXHQjIEFOSU1BVElPTlMgQ0lSQ0xFXG5cdFxuXHRtYXNrLmFuaW1hdGVcblx0XHRvcGFjaXR5OiAxXG5cdFx0b3B0aW9uczoge3RpbWU6IC4xNX1cblx0XG5cdHJpcHBsZUNpcmNsZS5hbmltYXRlXG5cdFx0eDogcmlwcGxlQ2lyY2xlLnggLSBsb25nU2lkZSAqIDEuM1xuXHRcdHk6IHJpcHBsZUNpcmNsZS55IC0gbG9uZ1NpZGUgKiAxLjNcblx0XHR3aWR0aDogbG9uZ1NpZGUgKiAyLjZcblx0XHRoZWlnaHQ6IGxvbmdTaWRlICogMi42XG5cdFx0b3B0aW9uczoge3RpbWU6IC41fVxuXHRcblx0VXRpbHMuZGVsYXkgMiwgLT4gXG5cdFx0bWFzay5hbmltYXRlXG5cdFx0XHRvcGFjaXR5OiAwXG5cdFx0bWFzay5vbkFuaW1hdGlvbkVuZCBtYXNrLmRlc3Ryb3lcblxuXHQjIFRPVUNIIEVORFxuXHRcblx0bGF5ZXIub25Ub3VjaEVuZCAtPiBcblx0XHRtYXNrLmFuaW1hdGVcblx0XHRcdG9wYWNpdHk6IDBcblx0XHRtYXNrLm9uQW5pbWF0aW9uRW5kIG1hc2suZGVzdHJveVxuXG5leHBvcnRzLnJpcHBsZSA9IHJpcHBsZSIsIntyaXBwbGV9ID0gcmVxdWlyZSAncmlwcGxlJ1xue3RoZW1lfSA9IHJlcXVpcmUgJ3RoZW1lJ1xudHlwZSA9IHJlcXVpcmUgJ3R5cGUnXG5pY29ucyA9IEpTT04ucGFyc2UgVXRpbHMuZG9tTG9hZERhdGFTeW5jIFwibW9kdWxlcy9pY29ucy5qc29uXCJcblxuRnJhbWVyLkV4dHJhcy5IaW50cy5kaXNhYmxlKClcblxuIyBUT0RPOiBDaGFuZ2UgQXBwIGZyb20gbWFzdGVyIGZsb3cgY29tcG9uZW50IHRvIFNjcmVlbiBtYW5hZ2VyLlxuIyBBcHAgc2hvdWxkbid0IGRpcmVjdGx5IG1hbmFnZSBwYWdlczogYSBuZXcgY2xhc3MsICdzY3JlZW4nIHdpbGwgbWFuYWdlIFBhZ2VzLlxuIyBUYWJzIGFsbG93IG5hdmlnYXRpb24gYmV0d2VlbiBTY3JlZW5zLiBDb250ZW50IGlzIHN0aWxsIGFkZGVkIHRvIFBhZ2VzLlxuXG5cbiMgT3VyIGdvYWwgaXMgdG8gcmVxdWlyZSBvbmx5IG9uZSByZXF1aXJlIGluIEZyYW1lciBwcm9qZWN0LCBzbyB0aGlzIFxuIyBpcyBhIGNsdW5reSB3YXkgb2YgbGV0dGluZyB1c2VyIGNyZWF0ZSB0ZXh0IHVzaW5nIG1kLlRpdGxlLCBldGMuXG5cbmV4cG9ydHMudGhlbWUgPSB0aGVtZVxuZXhwb3J0cy5UaXRsZSA9IFRpdGxlID0gdHlwZS5UaXRsZVxuZXhwb3J0cy5IZWFkbGluZSA9IEhlYWRsaW5lID0gdHlwZS5IZWFkbGluZVxuZXhwb3J0cy5TdWJoZWFkU2Vjb25kYXJ5ID0gU3ViaGVhZFNlY29uZGFyeSA9IHR5cGUuU3ViaGVhZFNlY29uZGFyeVxuZXhwb3J0cy5SZWd1bGFyID0gUmVndWxhciA9IHR5cGUuUmVndWxhclxuZXhwb3J0cy5Cb2R5MiA9IEJvZHkyID0gdHlwZS5Cb2R5MlxuZXhwb3J0cy5Cb2R5MSA9IEJvZHkxID0gdHlwZS5Cb2R5MVxuZXhwb3J0cy5DYXB0aW9uID0gQ2FwdGlvbiA9IHR5cGUuQ2FwdGlvblxuZXhwb3J0cy5EaWFsb2dBY3Rpb24gPSBEaWFsb2dBY3Rpb24gPSB0eXBlLkRpYWxvZ0FjdGlvblxuXG5hcHAgPSB1bmRlZmluZWRcblxuXG5cblxuXG5cblxuXG4jIFx0IC5kODg4ODg4XG4jIFx0ZDgnICAgIDg4XG4jIFx0ODhhYWFhYTg4YSA4OGQ4ODhiLiA4OGQ4ODhiLlxuIyBcdDg4ICAgICA4OCAgODgnICBgODggODgnICBgODhcbiMgXHQ4OCAgICAgODggIDg4LiAgLjg4IDg4LiAgLjg4XG4jIFx0ODggICAgIDg4ICA4OFk4ODhQJyA4OFk4ODhQJ1xuIyBcdCAgICAgICAgICAgODggICAgICAgODhcbiMgXHQgICAgICAgICAgIGRQICAgICAgIGRQXG5cblxuXG5leHBvcnRzLkFwcCA9IGNsYXNzIEFwcCBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0QF90aGVtZSA9IHRoZW1lXG5cdFx0QF9ib3R0b21OYXYgPSBvcHRpb25zLmJvdHRvbU5hdiA/IHVuZGVmaW5lZFxuXHRcdEBfbWVudU92ZXJsYXkgPSBvcHRpb25zLm1lbnVPdmVybGF5ID8gdW5kZWZpbmVkXG5cdFx0QHZpZXdzID0gb3B0aW9ucy52aWV3cyA/IFtdXG5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRuYW1lOiAnQXBwJ1xuXHRcdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXHRcdFxuXHRcdGFwcCA9IEBcblxuXHRcdCMgSEVBREVSXG5cblx0XHRAaGVhZGVyID0gbmV3IEhlYWRlclxuXHRcdFx0dGhlbWU6IHRoZW1lXG5cdFx0XHRpbmRleDogOTk5XG5cblx0XHQjIEZPT1RFUlxuXG5cdFx0QGZvb3RlciA9IG5ldyBMYXllclxuXHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBcblx0XHRcdHdpZHRoOiBTY3JlZW4ud2lkdGgsIGhlaWdodDogNDhcblx0XHRcdGltYWdlOiAnaW1hZ2VzL25hdl9iYXIucG5nJ1xuXHRcdFx0aW5kZXg6IDk5OVxuXHRcdFx0eTogQWxpZ24uYm90dG9tKClcblxuXHRcdGlmIEBfYm90dG9tTmF2XG5cdFx0XHRAYm90dG9tTmF2ID0gbmV3IEJvdHRvbU5hdlxuXHRcdFx0XHRuYW1lOiAnQm90dG9tIE5hdicsIHBhcmVudDogQFxuXHRcdFx0XHRkZXN0aW5hdGlvbnM6IEBfYm90dG9tTmF2LmxpbmtzID8gXCJtZC5hcHAuYm90dG9tTmF2IG5lZWRzIGFuIGFycmF5IG9mIGxpbmtzLiBFeGFtcGxlOiBbe3RpdGxlOiAnSG9tZScsIGljb246ICdob21lJywgYWN0aW9uOiAtPiB2aWV3LmxpbmtUbyhob21lKX1dXCJcblx0XHRcdFx0eTogaWYgQGZvb3Rlcj8gdGhlbiBBbGlnbi5ib3R0b20oLUBmb290ZXIuaGVpZ2h0KSBlbHNlIEFsaWduLmJvdHRvbSgpXG5cdFx0XHRcdGluZGV4OiA5OTlcblxuXHRcdCMgTUVOVSBPVkVSTEFZXG5cdFx0aWYgQF9tZW51T3ZlcmxheVxuXHRcdFx0QG1lbnVPdmVybGF5ID0gbmV3IE1lbnVPdmVybGF5XG5cdFx0XHRcdG5hbWU6ICdNZW51IE92ZXJsYXknXG5cdFx0XHRcdHRpdGxlOiBAX21lbnVPdmVybGF5LnRpdGxlID8gdGhyb3cgJ21kLmFwcC5tZW51T3ZlcmxheSBuZWVkcyBhIHRpdGxlLidcblx0XHRcdFx0bGlua3M6IEBfbWVudU92ZXJsYXkubGlua3MgPyB0aHJvdyBcIm1kLmFwcC5tZW51T3ZlcmxheSBuZWVkcyBhbiBhcnJheSBvZiBsaW5rcy4gRXhhbXBsZTogW3t0aXRsZTogJ0hvbWUnLCBpY29uOiAnaG9tZScsIGFjdGlvbjogLT4gdmlldy5saW5rVG8oaG9tZSl9XVwiXG5cblxuXHRcdCMgS0VZQk9BUkRcblxuXHRcdEBrZXlib2FyZCA9IG5ldyBMYXllclxuXHRcdFx0bmFtZTogJ0tleWJvYXJkJ1xuXHRcdFx0eTogQG1heFksIGltYWdlOiB0aGVtZS5rZXlib2FyZC5pbWFnZVxuXHRcdFx0d2lkdGg6IEB3aWR0aCwgaGVpZ2h0OiAyMjJcblx0XHRcdGluZGV4OiAxMDAwXG5cdFx0XHRhbmltYXRpb25PcHRpb25zOlxuXHRcdFx0XHR0aW1lOiAuMjVcblxuXHRcdEBrZXlib2FyZC5vblRhcCA9PiBAaGlkZUtleWJvYXJkKClcblxuXG5cdCMgc2V0dXA6IChvcHRpb25zID0ge30pIC0+XG5cblx0IyBcdCMgQk9UVE9NIE5BVlxuXG5cdCMgXHRpZiBvcHRpb25zLmJvdHRvbU5hdlxuXHQjIFx0XHRAYm90dG9tTmF2ID0gbmV3IEJvdHRvbU5hdlxuXHQjIFx0XHRcdG5hbWU6ICdCb3R0b20gTmF2JywgcGFyZW50OiBAXG5cdCMgXHRcdFx0ZGVzdGluYXRpb25zOiBvcHRpb25zLmJvdHRvbU5hdi5saW5rcyA/IFwibWQuYXBwLmJvdHRvbU5hdiBuZWVkcyBhbiBhcnJheSBvZiBsaW5rcy4gRXhhbXBsZTogW3t0aXRsZTogJ0hvbWUnLCBpY29uOiAnaG9tZScsIGFjdGlvbjogLT4gdmlldy5saW5rVG8oaG9tZSl9XVwiXG5cdCMgXHRcdFx0eTogQWxpZ24uYm90dG9tKC1AZm9vdGVyPy5oZWlnaHQpXG5cdCMgXHRcdFx0aW5kZXg6IDk5OVxuXG5cdCMgXHQjIE1FTlUgT1ZFUkxBWVxuXHQjIFx0aWYgb3B0aW9ucy5tZW51T3ZlcmxheVxuXHQjIFx0XHRAbWVudU92ZXJsYXkgPSBuZXcgTWVudU92ZXJsYXlcblx0IyBcdFx0XHRuYW1lOiAnTWVudSBPdmVybGF5J1xuXHQjIFx0XHRcdHRpdGxlOiBvcHRpb25zLm1lbnVPdmVybGF5LnRpdGxlID8gdGhyb3cgJ21kLmFwcC5tZW51T3ZlcmxheSBuZWVkcyBhIHRpdGxlLidcblx0IyBcdFx0XHRsaW5rczogb3B0aW9ucy5tZW51T3ZlcmxheS5saW5rcyA/IHRocm93IFwibWQuYXBwLm1lbnVPdmVybGF5IG5lZWRzIGFuIGFycmF5IG9mIGxpbmtzLiBFeGFtcGxlOiBbe3RpdGxlOiAnSG9tZScsIGljb246ICdob21lJywgYWN0aW9uOiAtPiB2aWV3LmxpbmtUbyhob21lKX1dXCJcblxuXHRzaG93S2V5Ym9hcmQ6IC0+XG5cdFx0QGtleWJvYXJkLmFuaW1hdGVcblx0XHRcdHk6IEFsaWduLmJvdHRvbSgpXG5cdFx0QGtleWJvYXJkLmJyaW5nVG9Gcm9udCgpXG5cblx0aGlkZUtleWJvYXJkOiAtPlxuXHRcdEBrZXlib2FyZC5hbmltYXRlXG5cdFx0XHR5OiBAbWF4WVxuXG5cblxuXG5cblxuXG5cbiMgXHRkUCAgICAgZFAgb29cbiMgXHQ4OCAgICAgODhcbiMgXHQ4OCAgICAuOFAgZFAgLmQ4ODg4Yi4gZFAgIGRQICBkUFxuIyBcdDg4ICAgIGQ4JyA4OCA4OG9vb29kOCA4OCAgODggIDg4XG4jIFx0ODggIC5kOFAgIDg4IDg4LiAgLi4uIDg4Ljg4Yi44OCdcbiMgXHQ4ODg4ODgnICAgZFAgYDg4ODg4UCcgODg4OFAgWThQXG5cblxuXG5leHBvcnRzLlZpZXcgPSBjbGFzcyBWaWV3IGV4dGVuZHMgRmxvd0NvbXBvbmVudFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblxuXHRcdEBhcHAgPSBhcHBcblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6ICdWaWV3J1xuXHRcdFx0cGFyZW50OiBhcHBcblx0XHRcdGluZGV4OiA5MDBcblx0XHRcdGFuaW1hdGlvbk9wdGlvbnM6XG5cdFx0XHRcdHRpbWU6IC4yXG5cblx0XHRAb25UcmFuc2l0aW9uU3RhcnQgKGN1cnJlbnQsIG5leHQsIGRpcmVjdGlvbikgPT4gXG5cblx0XHRcdEBhcHAuaGVhZGVyLnRpdGxlID0gbmV4dC5faGVhZGVyPy50aXRsZSA/ICdEZWZhdWx0J1xuXHRcdFx0QGFwcC5oZWFkZXIuaWNvbiA9IG5leHQuX2hlYWRlcj8uaWNvbiA/ICdtZW51J1xuXHRcdFx0QGFwcC5oZWFkZXIuaWNvbkFjdGlvbiA9IG5leHQuX2hlYWRlcj8uaWNvbkFjdGlvbiA/IC0+IG51bGxcblx0XHRcdEBhcHAuaGVhZGVyLnZpc2libGUgPSBuZXh0Ll9oZWFkZXI/LnZpc2libGUgPyB0cnVlXG5cdFx0XHRuZXh0Ll9vbkxvYWQoKVxuXG5cdFx0YXBwLnZpZXdzLnB1c2goQClcblxuXHRuZXdQYWdlOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0cGFnZSA9IG5ldyBQYWdlIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGNvbnRlbnRJbnNldDoge3RvcDogQGFwcC5oZWFkZXIuaGVpZ2h0fVxuXG5cdFx0IyBhZGp1c3QgY29udGVudCBpbnNldCBmb3IgcGFnZVxuXHRcdGlmIHBhZ2UuY29udGVudEluc2V0LnRvcCA8IEBhcHAuaGVhZGVyLmhlaWdodCB0aGVuIHBhZ2UuY29udGVudEluc2V0ID0gXG5cdFx0XHR0b3A6IHBhZ2UuY29udGVudEluc2V0LnRvcCArPSBAYXBwLmhlYWRlci5oZWlnaHRcblx0XHRcdGJvdHRvbTogcGFnZS5jb250ZW50SW5zZXQuYm90dG9tXG5cdFx0XHRsZWZ0OiBwYWdlLmNvbnRlbnRJbnNldC5sZWZ0XG5cdFx0XHRyaWdodDogcGFnZS5jb250ZW50SW5zZXQucmlnaHRcblxuXHRcdHJldHVybiBwYWdlIFxuXG5cdGFkZFBhZ2U6IChwYWdlKSAtPlxuXHRcdHBhZ2UuY29udGVudEluc2V0ID0ge3RvcDogQGFwcC5oZWFkZXIuaGVpZ2h0fVxuXG5cdFx0IyBhZGp1c3QgY29udGVudCBpbnNldCBmb3IgcGFnZVxuXHRcdGlmIHBhZ2UuY29udGVudEluc2V0LnRvcCA8IEBhcHAuaGVhZGVyLmhlaWdodCB0aGVuIHBhZ2UuY29udGVudEluc2V0ID0gXG5cdFx0XHR0b3A6IHBhZ2UuY29udGVudEluc2V0LnRvcCArPSBAYXBwLmhlYWRlci5oZWlnaHRcblx0XHRcdGJvdHRvbTogcGFnZS5jb250ZW50SW5zZXQuYm90dG9tXG5cdFx0XHRsZWZ0OiBwYWdlLmNvbnRlbnRJbnNldC5sZWZ0XG5cdFx0XHRyaWdodDogcGFnZS5jb250ZW50SW5zZXQucmlnaHRcblxuXHRcdHJldHVybiBwYWdlXG5cblx0bGlua1RvOiAocGFnZSkgLT5cblx0XHRpZiBwYWdlPyBhbmQgQGN1cnJlbnQgaXNudCBwYWdlXG5cdFx0XHRAc2hvd05leHQocGFnZSlcblxuXG5cblxuXG5cblxuXG4jIFx0ZFBcbiMgXHQ4OFxuIyBcdDg4IC5kODg4OGIuIC5kODg4OGIuIDg4ZDg4OGIuXG4jIFx0ODggODgnICBgXCJcIiA4OCcgIGA4OCA4OCcgIGA4OFxuIyBcdDg4IDg4LiAgLi4uIDg4LiAgLjg4IDg4ICAgIDg4XG4jIFx0ZFAgYDg4ODg4UCcgYDg4ODg4UCcgZFAgICAgZFBcbiMgXHRcbiMgXHRcblxuZXhwb3J0cy5JY29uID0gY2xhc3MgSWNvbiBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0QF9pY29uID0gb3B0aW9ucy5pY29uID8gJ21lbnUnXG5cdFx0QF9jb2xvciA9IG9wdGlvbnMuY29sb3IgPyAnIzAwMDAwJ1xuXHRcdEBfYmFja2dyb3VuZENvbG9yID0gb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPyBudWxsXG5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRuYW1lOiAnLidcblx0XHRcdGhlaWdodDogMjQsIHdpZHRoOiAyNFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBAX2JhY2tncm91bmRDb2xvclxuXG5cdFx0IyBAaWNvbiA9IEBfaWNvblxuXG5cdEBkZWZpbmUgXCJpY29uXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9pY29uXG5cdFx0c2V0OiAobmFtZSkgLT5cblx0XHRcdEBfaWNvbiA9IG5hbWVcblxuXHRcdFx0c3ZnID0gaWYgaWNvbnNbQF9pY29uXSB0aGVuIFwiPHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCc+PHBhdGggZD0nI3tpY29uc1tAX2ljb25dfScgZmlsbD0nI3tAX2NvbG9yfScvPjwvc3ZnPlwiXG5cdFx0XHRlbHNlIHRocm93IFwiRXJyb3I6IGljb24gJyN7bmFtZX0nIHdhcyBub3QgZm91bmQuIFNlZSBodHRwczovL21hdGVyaWFsZGVzaWduaWNvbnMuY29tLyBmb3IgZnVsbCBsaXN0IG9mIGljb25zLlwiXG5cblx0XHRcdEBodG1sID0gc3ZnXG5cblx0QGRlZmluZSBcImNvbG9yXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9jb2xvclxuXHRcdHNldDogKGNvbG9yKSAtPlxuXHRcdFx0QF9jb2xvciA9IG5ldyBDb2xvcihjb2xvcilcblxuXHRcdFx0c3ZnID0gaWYgaWNvbnNbQF9pY29uXSB0aGVuIFwiPHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAyNCAyNCc+PHBhdGggZD0nI3tpY29uc1tAX2ljb25dfScgZmlsbD0nI3tAX2NvbG9yfScvPjwvc3ZnPlwiXG5cdFx0XHRlbHNlIHRocm93IFwiRXJyb3I6IGljb24gJyN7bmFtZX0nIHdhcyBub3QgZm91bmQuIFNlZSBodHRwczovL21hdGVyaWFsZGVzaWduaWNvbnMuY29tLyBmb3IgZnVsbCBsaXN0IG9mIGljb25zLlwiXG5cblx0XHRcdEBodG1sID0gc3ZnXG5cblxuXG5cblxuXG4jIC5kODg4ODhiICAgIGRQICAgICAgICAgICAgICBkUCAgICAgICAgICAgICAgICAgICAgICA4ODg4ODhiYSAgICAgICAgICAgICAgICAgICBcbiMgODguICAgIFwiJyAgIDg4ICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgICAgICA4OCAgICBgOGIgICAgICAgICAgICAgICAgICBcbiMgYFk4ODg4OGIuIGQ4ODg4UCAuZDg4ODhiLiBkODg4OFAgZFAgICAgZFAgLmQ4ODg4Yi4gYTg4YWFhYThQJyAuZDg4ODhiLiA4OGQ4ODhiLlxuIyAgICAgICBgOGIgICA4OCAgIDg4JyAgYDg4ICAgODggICA4OCAgICA4OCBZOG9vb29vLiAgODggICBgOGIuIDg4JyAgYDg4IDg4JyAgYDg4XG4jIGQ4JyAgIC44UCAgIDg4ICAgODguICAuODggICA4OCAgIDg4LiAgLjg4ICAgICAgIDg4ICA4OCAgICAuODggODguICAuODggODggICAgICBcbiMgIFk4ODg4OFAgICAgZFAgICBgODg4ODhQOCAgIGRQICAgYDg4ODg4UCcgYDg4ODg4UCcgIDg4ODg4ODg4UCBgODg4ODhQOCBkUCAgXG5cblxuXG5leHBvcnRzLlN0YXR1c0JhciA9IGNsYXNzIFN0YXR1c0JhciBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0bmFtZTogJy4nXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoLCBoZWlnaHQ6IDI0XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnN0YXR1c0Jhci5iYWNrZ3JvdW5kQ29sb3JcblxuXHRcdEBpdGVtcyA9IG5ldyBMYXllclxuXHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBcblx0XHRcdHNpemU6IEBzaXplXG5cdFx0XHRpbWFnZTogdGhlbWUuc3RhdHVzQmFyLmltYWdlXG5cdFx0XHRpbnZlcnQ6IHRoZW1lLnN0YXR1c0Jhci5pbnZlcnRcblxuXG5cblxuXG5cblxuXG4jIGRQICAgICBkUCAgICAgICAgICAgICAgICAgICAgICAgICAgZFAgICAgICAgICAgICAgICAgICBcbiMgODggICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICAgICAgICAgICAgICAgIFxuIyA4OGFhYWFhODhhIC5kODg4OGIuIC5kODg4OGIuIC5kODg4Yjg4IC5kODg4OGIuIDg4ZDg4OGIuXG4jIDg4ICAgICA4OCAgODhvb29vZDggODgnICBgODggODgnICBgODggODhvb29vZDggODgnICBgODhcbiMgODggICAgIDg4ICA4OC4gIC4uLiA4OC4gIC44OCA4OC4gIC44OCA4OC4gIC4uLiA4OCAgICAgIFxuIyBkUCAgICAgZFAgIGA4ODg4OFAnIGA4ODg4OFA4IGA4ODg4OFA4IGA4ODg4OFAnIGRQICAgIFxuXG5cblxuZXhwb3J0cy5IZWFkZXIgPSBjbGFzcyBIZWFkZXIgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblx0XHRcblx0XHRAX3RpdGxlID0gdW5kZWZpbmVkXG5cdFx0QF9pY29uID0gdW5kZWZpbmVkXG5cdFx0QF9pY29uQWN0aW9uID0gb3B0aW9ucy5pY29uQWN0aW9uID8gLT4gbnVsbFxuXG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0bmFtZTogJ0hlYWRlcicsIFxuXHRcdFx0d2lkdGg6IFNjcmVlbi53aWR0aCwgaGVpZ2h0OiA4MFxuXHRcdFx0c2hhZG93WTogMiwgc2hhZG93Qmx1cjogMywgc2hhZG93Q29sb3I6ICdyZ2JhKDAsMCwwLC4yNCknXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLmhlYWRlci5iYWNrZ3JvdW5kQ29sb3JcblxuXHRcdEBzdGF0dXNCYXIgPSBuZXcgU3RhdHVzQmFyXG5cdFx0XHRuYW1lOiAnLicsIHBhcmVudDogQFxuXG5cdFx0IyBUT0RPOiBpZiBvcHRpb25zLmljb24gaXMgZmFsc2UgdGhlbiBubyBpY29uTGF5ZXIsIG1vdmUgdGl0bGUgbGVmdFxuXG5cdFx0QHRpdGxlTGF5ZXIgPSBuZXcgdHlwZS5UaXRsZVxuXHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBcblx0XHRcdHg6IDcyLCB5OiBBbGlnbi5ib3R0b20oLTE0KVxuXHRcdFx0Y29sb3I6IHRoZW1lLmhlYWRlci50aXRsZVxuXHRcdFx0dGV4dDogQHRpdGxlID8gXCJObyB0aXRsZVwiXG5cblx0XHRAdGl0bGUgPSBvcHRpb25zLnRpdGxlID8gJ0RlZmF1bHQgSGVhZGVyJ1xuXG5cdFx0QGljb25MYXllciA9IG5ldyBJY29uXG5cdFx0XHRuYW1lOiAnLicsIHBhcmVudDogQCwgXG5cdFx0XHR4OiAxMiwgeTogQWxpZ24uY2VudGVyKDEyKVxuXHRcdFx0aWNvbjogJ21lbnUnLCBjb2xvcjogdGhlbWUuaGVhZGVyLmljb24uY29sb3JcblxuXHRcdEBpY29uID0gb3B0aW9ucy5pY29uID8gJ21lbnUnXG5cblx0XHRAaWNvbkxheWVyLm9uVGFwID0+IEBfaWNvbkFjdGlvbigpXG5cdFx0QGljb25MYXllci5vblRvdWNoU3RhcnQgKGV2ZW50KSAtPiByaXBwbGUoYXBwLmhlYWRlciwgZXZlbnQucG9pbnQpXG5cblxuXHRAZGVmaW5lIFwidGl0bGVcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3RpdGxlXG5cdFx0c2V0OiAodGl0bGVUZXh0KSAtPlxuXHRcdFx0QF90aXRsZSA9IHRpdGxlVGV4dFxuXHRcdFx0QHRpdGxlTGF5ZXIudGV4dFJlcGxhY2UoQHRpdGxlTGF5ZXIudGV4dCwgQF90aXRsZSlcblxuXHRAZGVmaW5lIFwiaWNvblwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfaWNvblxuXHRcdHNldDogKGljb25OYW1lKSAtPiBcblx0XHRcdEBfaWNvbiA9IGljb25OYW1lXG5cdFx0XHRAaWNvbkxheWVyLmljb24gPSBpY29uTmFtZVxuXG5cdEBkZWZpbmUgXCJpY29uQ29sb3JcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2ljb24uY29sb3Jcblx0XHRzZXQ6IChjb2xvcikgLT4gXG5cdFx0XHRAaWNvbkxheWVyLmNvbG9yID0gY29sb3JcblxuXHRAZGVmaW5lIFwiaWNvbkFjdGlvblwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfaWNvbkFjdGlvblxuXHRcdHNldDogKGFjdGlvbikgLT5cblx0XHRcdEBfaWNvbkFjdGlvbiA9IGFjdGlvblxuXG5cblxuXG5cblxuXG4jIFx0IDg4ODg4OGJhICAgICAgICAgICAgIGRQICAgICBkUCAgICAgICAgICAgICAgICAgICAgICAgODg4ODg4YmFcbiMgXHQgODggICAgYDhiICAgICAgICAgICAgODggICAgIDg4ICAgICAgICAgICAgICAgICAgICAgICA4OCAgICBgOGJcbiMgXHRhODhhYWFhOFAnIC5kODg4OGIuIGQ4ODg4UCBkODg4OFAgLmQ4ODg4Yi4gODhkOGIuZDhiLiA4OCAgICAgODggLmQ4ODg4Yi4gZFAgICAuZFBcbiMgXHQgODggICBgOGIuIDg4JyAgYDg4ICAgODggICAgIDg4ICAgODgnICBgODggODgnYDg4J2A4OCA4OCAgICAgODggODgnICBgODggODggICBkOCdcbiMgXHQgODggICAgLjg4IDg4LiAgLjg4ICAgODggICAgIDg4ICAgODguICAuODggODggIDg4ICA4OCA4OCAgICAgODggODguICAuODggODggLjg4J1xuIyBcdCA4ODg4ODg4OFAgYDg4ODg4UCcgICBkUCAgICAgZFAgICBgODg4ODhQJyBkUCAgZFAgIGRQIGRQICAgICBkUCBgODg4ODhQOCA4ODg4UCdcblxuXG5cbmV4cG9ydHMuQm90dG9tTmF2ID0gY2xhc3MgQm90dG9tTmF2IGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG5cdFx0XG5cdFx0QF9kZXN0aW5hdGlvbnMgPSBvcHRpb25zLmRlc3RpbmF0aW9ucyA/IHRocm93ICdOZWVkcyBhdCBsZWFzdCBvbmUgZGVzdGluYXRpb24uJ1xuXHRcdEBfaXRlbXMgPSBbXVxuXHRcdEBfaW5pdGlhbERlc3RpbmF0aW9uID0gb3B0aW9ucy5pbml0aWFsRGVzdGluYXRpb24gPyB1bmRlZmluZWRcblx0XHQjIGRlc3RpbmF0aW9uIHNob3VsZCBiZTogW3tuYW1lOiBzdHJpbmcsIGljb246IGljb25TdHJpbmcsIGFjdGlvbjogZnVuY3Rpb259XVxuXHRcdEBfYWN0aXZlRGVzdGluYXRpb24gPSBAX2luaXRpYWxEZXN0aW5hdGlvbiA/IEBfaXRlbXNbMF1cblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6ICdCb3R0b20gTmF2J1xuXHRcdFx0eTogQWxpZ24uYm90dG9tXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoLCBoZWlnaHQ6IDU2XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLmJvdHRvbU5hdi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRcdHNoYWRvd1k6IHRoZW1lLmJvdHRvbU5hdi5zaGFkb3dZXG5cdFx0XHRzaGFkb3dCbHVyOiB0aGVtZS5ib3R0b21OYXYuc2hhZG93Qmx1clxuXHRcdFx0c2hhZG93Q29sb3I6IHRoZW1lLmJvdHRvbU5hdi5zaGFkb3dDb2xvclxuXG5cblx0XHRmb3IgZGVzdGluYXRpb24sIGkgaW4gQF9kZXN0aW5hdGlvbnNcblx0XHRcdGl0ZW0gPSBuZXcgTGF5ZXJcblx0XHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBcblx0XHRcdFx0eDogQHdpZHRoL0BfZGVzdGluYXRpb25zLmxlbmd0aCAqIGlcblx0XHRcdFx0d2lkdGg6IEB3aWR0aC9AX2Rlc3RpbmF0aW9ucy5sZW5ndGgsIGhlaWdodDogQGhlaWdodFxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblxuXHRcdFx0aXRlbS5kaXNrID0gbmV3IExheWVyXG5cdFx0XHRcdG5hbWU6ICcuJywgcGFyZW50OiBpdGVtXG5cdFx0XHRcdHg6IEFsaWduLmNlbnRlciwgeTogQWxpZ24uY2VudGVyXG5cdFx0XHRcdGhlaWdodDogQGhlaWdodCwgd2lkdGg6IEBoZWlnaHQsIGJvcmRlclJhZGl1czogQGhlaWdodC8yXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cdFx0XHRpdGVtLmljb25MYXllciA9IG5ldyBJY29uXG5cdFx0XHRcdG5hbWU6ICcuJywgcGFyZW50OiBpdGVtLmRpc2tcblx0XHRcdFx0eDogQWxpZ24uY2VudGVyLCB5OiBBbGlnbi5jZW50ZXIoLTgpXG5cdFx0XHRcdGljb246IGRlc3RpbmF0aW9uLmljb25cblx0XHRcdFx0YW5pbWF0aW9uT3B0aW9uczoge3RpbWU6IC4xNX1cblxuXHRcdFx0aXRlbS5sYWJlbExheWVyID0gbmV3IHR5cGUuQ2FwdGlvblxuXHRcdFx0XHRuYW1lOiAnLicsIHBhcmVudDogaXRlbS5kaXNrXG5cdFx0XHRcdHg6IEFsaWduLmNlbnRlciwgeTogQWxpZ24uY2VudGVyKDE0KVxuXHRcdFx0XHR3aWR0aDogQHdpZHRoLCB0ZXh0QWxpZ246ICdjZW50ZXInXG5cdFx0XHRcdHRleHQ6IGRlc3RpbmF0aW9uLnRpdGxlXG5cdFx0XHRcdGFuaW1hdGlvbk9wdGlvbnM6IHt0aW1lOiAuMTV9XG5cblx0XHRcdGl0ZW0uYWN0aW9uID0gZGVzdGluYXRpb24uYWN0aW9uXG5cblx0XHRcdGl0ZW0uZGlzay5vblRvdWNoU3RhcnQgKGV2ZW50KSAtPiBcblx0XHRcdFx0cmlwcGxlKEAsIGV2ZW50LnBvaW50LCBAcGFyZW50Lmljb25MYXllciwgbmV3IENvbG9yKHRoZW1lLnByaW1hcnkpLmFscGhhKC4zKSlcblxuXHRcdFx0aXRlbS5vblRhcCAtPiBAcGFyZW50LmFjdGl2ZURlc3RpbmF0aW9uID0gQFxuXG5cdFx0XHRAX2l0ZW1zLnB1c2goaXRlbSlcblxuXHRcdFx0QHNob3dBY3RpdmUoQF9pdGVtc1swXSlcblxuXHRcdFxuXG5cdEBkZWZpbmUgXCJhY3RpdmVEZXN0aW5hdGlvblwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfYWN0aXZlRGVzdGluYXRpb25cblx0XHRzZXQ6IChkZXN0aW5hdGlvbikgLT5cblx0XHRcdHJldHVybiBpZiBkZXN0aW5hdGlvbiBpcyBAX2FjdGl2ZURlc3RpbmF0aW9uXG5cdFx0XHRAX2FjdGl2ZURlc3RpbmF0aW9uID0gZGVzdGluYXRpb25cblxuXHRcdFx0QF9hY3RpdmVEZXN0aW5hdGlvbi5hY3Rpb24oKVxuXHRcdFx0QHNob3dBY3RpdmUoQF9hY3RpdmVEZXN0aW5hdGlvbilcblxuXHRzaG93QWN0aXZlOiAoaXRlbSkgLT5cblx0XHRpdGVtLmxhYmVsTGF5ZXIuYW5pbWF0ZSB7Y29sb3I6IHRoZW1lLnByaW1hcnksIG9wYWNpdHk6IDF9XG5cdFx0aXRlbS5pY29uTGF5ZXIuY29sb3IgPSB0aGVtZS5wcmltYXJ5XG5cdFx0XG5cblx0XHRmb3Igc2liIGluIGl0ZW0uc2libGluZ3Ncblx0XHRcdHNpYi5sYWJlbExheWVyLmFuaW1hdGUge2NvbG9yOiAnIzc3Nyd9XG5cdFx0XHRzaWIuaWNvbkxheWVyLmNvbG9yID0gJyM3NzcnXG5cblxuXG5cbiMgIDg4ODg4OGJhICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuIyAgODggICAgYDhiICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4jIGE4OGFhYWE4UCcgLmQ4ODg4Yi4gLmQ4ODg4Yi4gLmQ4ODg4Yi5cbiMgIDg4ICAgICAgICA4OCcgIGA4OCA4OCcgIGA4OCA4OG9vb29kOFxuIyAgODggICAgICAgIDg4LiAgLjg4IDg4LiAgLjg4IDg4LiAgLi4uXG4jICBkUCAgICAgICAgYDg4ODg4UDggYDg4ODhQODggYDg4ODg4UCdcbiMgICAgICAgICAgICAgICAgICAgICAgICAgIC44OCAgICAgICAgIFxuIyAgICAgICAgICAgICAgICAgICAgICBkODg4OFAgICAgICAgICAgXG5cblxuXG5leHBvcnRzLlBhZ2UgPSBjbGFzcyBQYWdlIGV4dGVuZHMgU2Nyb2xsQ29tcG9uZW50XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdFxuXHRcdEBfaGVhZGVyID0gb3B0aW9ucy5oZWFkZXIgPyB7dGl0bGU6ICdEZWZhdWx0JywgdmlzaWJsZTogdHJ1ZSwgaWNvbjogJ21lbnUnLCBpY29uQWN0aW9uOiAtPiByZXR1cm4gbnVsbH1cblx0XHRAX3RlbXBsYXRlID0gb3B0aW9ucy50ZW1wbGF0ZVxuXHRcdEBfdGVtcGxhdGVPcGFjaXR5ID0gb3B0aW9ucy50ZW1wbGF0ZU9wYWNpdHkgPyAuNVxuXHRcdEBfb25Mb2FkID0gb3B0aW9ucy5vbkxvYWQgPyAtPiBudWxsXG5cblx0XHRpZiBAX2hlYWRlci5pY29uQWN0aW9uIHRoZW4gQF9oZWFkZXIuaWNvbkFjdGlvbiA9IF8uYmluZChAX2hlYWRlci5pY29uQWN0aW9uLCBAKVxuXHRcdGlmIEBfb25Mb2FkIHRoZW4gQF9vbkxvYWQgPSBfLmJpbmQoQF9vbkxvYWQsIEApXG5cblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6ICdQYWdlJ1xuXHRcdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0XHRcdHNjcm9sbEhvcml6b250YWw6IGZhbHNlXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLnBhZ2UucHJpbWFyeS5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRcblx0XHRAY29udGVudEluc2V0ID1cblx0XHRcdHRvcDogMCwgYm90dG9tOiA1MDBcblxuXHRcdEBjb250ZW50LmJhY2tncm91bmRDb2xvciA9IG51bGxcblxuXHRcdGlmIEBfdGVtcGxhdGU/XG5cdFx0XHRAX3RlbXBsYXRlLnByb3BzID1cblx0XHRcdFx0cGFyZW50OiBAXG5cdFx0XHRcdG9wYWNpdHk6IEBfdGVtcGxhdGVPcGFjaXR5XG5cblx0XHRAc2VuZFRvQmFjaygpXG5cblxuXHR1cGRhdGU6IC0+IHJldHVybiBudWxsXG5cblxuXG5cblxuXG5cblxuIyAgODg4ODg4YmEgICAgICAgICAgICAgICAgICAgICAgZFAgICBkUCAgICAgICAgICAgICAgICAgICAgICBcbiMgIDg4ICAgIGA4YiAgICAgICAgICAgICAgICAgICAgIDg4ICAgODggICAgICAgICAgICAgICAgICAgICAgXG4jIGE4OGFhYWE4UCcgLmQ4ODg4Yi4gZFAgIGRQICBkUCA4OCBkODg4OFAgLmQ4ODg4Yi4gODhkOGIuZDhiLlxuIyAgODggICBgOGIuIDg4JyAgYDg4IDg4ICA4OCAgODggODggICA4OCAgIDg4b29vb2Q4IDg4J2A4OCdgODhcbiMgIDg4ICAgICA4OCA4OC4gIC44OCA4OC44OGIuODgnIDg4ICAgODggICA4OC4gIC4uLiA4OCAgODggIDg4XG4jICBkUCAgICAgZFAgYDg4ODg4UCcgODg4OFAgWThQICBkUCAgIGRQICAgYDg4ODg4UCcgZFAgIGRQICBkUFxuXG5cblxuZXhwb3J0cy5Sb3dJdGVtID0gY2xhc3MgUm93SXRlbSBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0QF9pY29uID0gb3B0aW9ucy5pY29uXG5cdFx0QF9pY29uQmFja2dyb3VuZENvbG9yID0gb3B0aW9ucy5pY29uQmFja2dyb3VuZENvbG9yID8gJyM3NzcnXG5cdFx0QF90ZXh0ID0gb3B0aW9ucy50ZXh0ID8gJ1JvdyBpdGVtJ1xuXHRcdEBfcm93ID0gb3B0aW9ucy5yb3cgPyAwXG5cdFx0QF95ID0gMzIgKyAoQF9yb3cgKiA0OCkgXG5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHR5OiBAX3lcblx0XHRcdGhlaWdodDogNDhcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cdFx0QGljb24gPSBuZXcgTGF5ZXJcblx0XHRcdG5hbWU6ICcuJywgcGFyZW50OiBAXG5cdFx0XHR4OiAxNiwgeTogQWxpZ24uY2VudGVyXG5cdFx0XHRoZWlnaHQ6IDMyLCB3aWR0aDogMzIsIGJvcmRlclJhZGl1czogMTZcblx0XHRcdGJhY2tncm91bmRDb2xvcjogQF9pY29uQmFja2dyb3VuZENvbG9yXG5cdFx0XHRpbWFnZTogQF9pY29uXG5cblx0XHRAbGFiZWxMYXllciA9IG5ldyB0eXBlLlJlZ3VsYXJcblx0XHRcdG5hbWU6ICcuJywgcGFyZW50OiBAXG5cdFx0XHR4OiBAaWNvbi5tYXhYICsgMTYsIHk6IEFsaWduLmNlbnRlclxuXHRcdFx0Y29sb3I6IHRoZW1lLnRleHQudGV4dFxuXHRcdFx0dGV4dDogQF90ZXh0XG5cblxuXG5cblxuXG5cblxuIyBcdDg4ODhiYS44OGJhICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODg4ODg4YmEgICAgICAgICAgICAgZFAgICAgIGRQXG4jIFx0ODggIGA4YiAgYDhiICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4OCAgICBgOGIgICAgICAgICAgICA4OCAgICAgODhcbiMgXHQ4OCAgIDg4ICAgODggLmQ4ODg4Yi4gODhkODg4Yi4gZFAgICAgZFAgYTg4YWFhYThQJyBkUCAgICBkUCBkODg4OFAgZDg4ODhQIC5kODg4OGIuIDg4ZDg4OGIuXG4jIFx0ODggICA4OCAgIDg4IDg4b29vb2Q4IDg4JyAgYDg4IDg4ICAgIDg4ICA4OCAgIGA4Yi4gODggICAgODggICA4OCAgICAgODggICA4OCcgIGA4OCA4OCcgIGA4OFxuIyBcdDg4ICAgODggICA4OCA4OC4gIC4uLiA4OCAgICA4OCA4OC4gIC44OCAgODggICAgLjg4IDg4LiAgLjg4ICAgODggICAgIDg4ICAgODguICAuODggODggICAgODhcbiMgXHRkUCAgIGRQICAgZFAgYDg4ODg4UCcgZFAgICAgZFAgYDg4ODg4UCcgIDg4ODg4ODg4UCBgODg4ODhQJyAgIGRQICAgICBkUCAgIGA4ODg4OFAnIGRQICAgIGRQXG5cblxuXG5jbGFzcyBNZW51QnV0dG9uIGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG5cdFx0XG5cdFx0QF9pY29uID0gb3B0aW9ucy5pY29uID8gJ2hvbWUnXG5cdFx0QF90ZXh0ID0gb3B0aW9ucy50ZXh0ID8gJ0RlZmF1bHQnXG5cdFx0QF9hY3Rpb24gPSBvcHRpb25zLmFjdGlvbiA/IC0+IG51bGxcblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGhlaWdodDogNDgsIHdpZHRoOiAzMDRcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cdFx0QGljb25MYXllciA9IG5ldyBJY29uXG5cdFx0XHRuYW1lOiAnLicsIHBhcmVudDogQFxuXHRcdFx0eTogQWxpZ24uY2VudGVyXG5cdFx0XHRpY29uOiBAX2ljb24sIGNvbG9yOiB0aGVtZS5tZW51T3ZlcmxheS50ZXh0XG5cblx0XHRAbGFiZWxMYXllciA9IG5ldyB0eXBlLlJlZ3VsYXJcblx0XHRcdG5hbWU6ICdsYWJlbCcsIHBhcmVudDogQFxuXHRcdFx0eDogQGljb25MYXllci5tYXhYICsgMTZcblx0XHRcdHk6IEFsaWduLmNlbnRlcigpXG5cdFx0XHRjb2xvcjogdGhlbWUubWVudU92ZXJsYXkudGV4dFxuXHRcdFx0dGV4dDogQF90ZXh0XG5cblx0XHRAb25UYXAgQF9hY3Rpb25cblx0XHRAb25UYXAgLT4gXG5cdFx0XHRVdGlscy5kZWxheSAuMjUsID0+IEBwYXJlbnQuaGlkZSgpXG5cblxuXG5cblxuXG5cblxuIyBcdDg4ODhiYS44OGJhICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLjg4ODg4LiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZFAgICAgICAgICAgICAgICAgICBcbiMgXHQ4OCAgYDhiICBgOGIgICAgICAgICAgICAgICAgICAgICAgICAgICAgZDgnICAgYDhiICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4ICAgICAgICAgICAgICAgICAgXG4jIFx0ODggICA4OCAgIDg4IC5kODg4OGIuIDg4ZDg4OGIuIGRQICAgIGRQIDg4ICAgICA4OCBkUCAgIC5kUCAuZDg4ODhiLiA4OGQ4ODhiLiA4OCAuZDg4ODhiLiBkUCAgICBkUFxuIyBcdDg4ICAgODggICA4OCA4OG9vb29kOCA4OCcgIGA4OCA4OCAgICA4OCA4OCAgICAgODggODggICBkOCcgODhvb29vZDggODgnICBgODggODggODgnICBgODggODggICAgODhcbiMgXHQ4OCAgIDg4ICAgODggODguICAuLi4gODggICAgODggODguICAuODggWTguICAgLjhQIDg4IC44OCcgIDg4LiAgLi4uIDg4ICAgICAgIDg4IDg4LiAgLjg4IDg4LiAgLjg4XG4jIFx0ZFAgICBkUCAgIGRQIGA4ODg4OFAnIGRQICAgIGRQIGA4ODg4OFAnICBgODg4OFAnICA4ODg4UCcgICBgODg4ODhQJyBkUCAgICAgICBkUCBgODg4ODhQOCBgODg4OFA4OFxuIyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLjg4XG4jICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4ODg4UCBcblxuXG5cbmV4cG9ydHMuTWVudU92ZXJsYXkgPSBjbGFzcyBNZW51T3ZlcmxheSBleHRlbmRzIExheWVyXG5cdFxuXHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG5cblx0XHRAX2xpbmtzID0gb3B0aW9ucy5saW5rcyA/IFt7dGl0bGU6ICdIb21lJywgaWNvbjogJ2hvbWUnLCBhY3Rpb246IC0+IG51bGx9XVxuXHRcdEBfdGl0bGUgPSBvcHRpb25zLnRpdGxlID8gJ01lbnUnXG5cdFx0QF9pbWFnZSA9IG9wdGlvbnMuaW1hZ2UgPyBudWxsXG5cblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRcdFx0d2lkdGg6IDMwNFxuXHRcdFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdFx0XHR2aXNpYmxlOiBmYWxzZVxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiB0aGVtZS5tZW51T3ZlcmxheS5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRcdGFuaW1hdGlvbk9wdGlvbnM6IHtjdXJ2ZTogXCJzcHJpbmcoMzAwLCAzNSwgMClcIn1cblxuXG5cdFx0QHNjcmltID0gbmV3IExheWVyXG5cdFx0XHRuYW1lOiAnLicsIFxuXHRcdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsLjYpJ1xuXHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0dmlzaWJsZTogZmFsc2Vcblx0XHRcdGFuaW1hdGlvbk9wdGlvbnM6XG5cdFx0XHRcdHRpbWU6IC4yNVxuXG5cdFx0QHNjcmltLm9uVGFwID0+IEBoaWRlKClcblx0XHRAb25Td2lwZUxlZnRFbmQgPT4gQGhpZGUoKVxuXG5cdFx0QGhlYWRlciA9IG5ldyBMYXllclxuXHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBcblx0XHRcdHdpZHRoOiBAd2lkdGgsIGhlaWdodDogMTczXG5cdFx0XHRpbWFnZTogdGhlbWUudXNlci5pbWFnZVxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiB0aGVtZS5tZW51T3ZlcmxheS5oZWFkZXIuYmFja2dyb3VuZENvbG9yXG5cblx0XHRAdGl0bGVJY29uID0gbmV3IExheWVyXG5cdFx0XHRuYW1lOiAnLicsIHBhcmVudDogQGhlYWRlclxuXHRcdFx0eDogMTYsIHk6IDQwXG5cdFx0XHRoZWlnaHQ6IDY0LCB3aWR0aDogNjRcblx0XHRcdGJvcmRlclJhZGl1czogMzJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogdGhlbWUubWVudU92ZXJsYXkuaGVhZGVyLmljb25cblxuXHRcdEBzdWJoZWFkZXJFeHBhbmQgPSBuZXcgSWNvblxuXHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBoZWFkZXJcblx0XHRcdHg6IEFsaWduLnJpZ2h0KC0xNilcblx0XHRcdHk6IEFsaWduLmJvdHRvbSgtMTYpXG5cdFx0XHRpY29uOiAnbWVudS1kb3duJ1xuXHRcdFx0Y29sb3I6IHRoZW1lLm1lbnVPdmVybGF5LnN1YmhlYWRlci50ZXh0XG5cblx0XHRAc3ViaGVhZGVyID0gbmV3IHR5cGUuQm9keTFcblx0XHRcdG5hbWU6ICcuJywgcGFyZW50OiBAaGVhZGVyXG5cdFx0XHR3aWR0aDogQHdpZHRoXG5cdFx0XHR4OiAxNiwgeTogQWxpZ24uYm90dG9tKC0xOClcblx0XHRcdHRleHQ6IEBfdGl0bGVcblx0XHRcdGNvbG9yOiB0aGVtZS5tZW51T3ZlcmxheS5zdWJoZWFkZXIudGV4dFxuXG5cdFx0bGlua3MgPSBbXVxuXG5cdFx0Zm9yIGxpbmssIGkgaW4gQF9saW5rc1xuXHRcdFx0bGlua3NbaV0gPSBuZXcgTWVudUJ1dHRvblxuXHRcdFx0XHRuYW1lOiAnLicsIHBhcmVudDogQFxuXHRcdFx0XHR4OiAxNiwgeTogMTg5ICsgKDQ4ICogaSlcblx0XHRcdFx0dGV4dDogbGluay50aXRsZVxuXHRcdFx0XHRpY29uOiBsaW5rLmljb25cblx0XHRcdFx0YWN0aW9uOiBsaW5rLmFjdGlvblxuXG5cdHNob3c6IC0+XG5cdFx0QGJyaW5nVG9Gcm9udCgpXG5cdFx0QHZpc2libGUgPSB0cnVlXG5cdFx0QHggPSAtU2NyZWVuLndpZHRoXG5cdFx0QGFuaW1hdGVcblx0XHRcdHg6IDBcblxuXHRcdEBzY3JpbS5wbGFjZUJlaGluZChAKVxuXHRcdEBzY3JpbS52aXNpYmxlID0gdHJ1ZVxuXHRcdEBzY3JpbS5hbmltYXRlXG5cdFx0XHRvcGFjaXR5OiAxXG5cblx0aGlkZTogLT5cblx0XHRAYW5pbWF0ZVxuXHRcdFx0eDogLVNjcmVlbi53aWR0aFxuXG5cdFx0QHNjcmltLmFuaW1hdGVcblx0XHRcdG9wYWNpdHk6IDBcblxuXHRcdFV0aWxzLmRlbGF5IC4zLCA9PlxuXHRcdFx0QHZpc2libGUgPSBmYWxzZVxuXHRcdFx0QHNjcmltLnZpc2libGUgPSBmYWxzZVxuXHRcdFx0QHNlbmRUb0JhY2soKVxuXHRcdFx0QHNjcmltLnNlbmRUb0JhY2soKVxuXG5cblxuXG5cblxuXG5cbiMgXHQ4ODg4ODhiYSAgb28gICAgICAgICAgZFBcbiMgXHQ4OCAgICBgOGIgICAgICAgICAgICAgODhcbiMgXHQ4OCAgICAgODggZFAgLmQ4ODg4Yi4gODggLmQ4ODg4Yi4gLmQ4ODg4Yi5cbiMgXHQ4OCAgICAgODggODggODgnICBgODggODggODgnICBgODggODgnICBgODhcbiMgXHQ4OCAgICAuOFAgODggODguICAuODggODggODguICAuODggODguICAuODhcbiMgXHQ4ODg4ODg4UCAgZFAgYDg4ODg4UDggZFAgYDg4ODg4UCcgYDg4ODhQODhcbiMgXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuODhcbiMgXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4ODg4UFxuXG5cblxuZXhwb3J0cy5EaWFsb2cgPSBjbGFzcyBEaWFsb2cgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6ICcuJywgc2l6ZTogU2NyZWVuLnNpemUsIGNvbG9yOiB0aGVtZS50aW50XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIC41KSdcblx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFxuXHRcdEBfdGl0bGUgPSBvcHRpb25zLnRpdGxlID8gJ0RlZmF1bHQgVGl0bGUnXG5cdFx0QF9ib2R5ID0gb3B0aW9ucy5ib2R5ID8gJ0JvZHkgdGV4dCBnb2VzIGhlcmUuJ1xuXHRcdEBfYWNjZXB0VGV4dCA9IG9wdGlvbnMuYWNjZXB0VGV4dCA/ICdjb25maXJtJ1xuXHRcdEBfYWNjZXB0QWN0aW9uID0gb3B0aW9ucy5hY2NlcHRBY3Rpb24gPyAtPiBudWxsXG5cdFx0QF9kZWNsaW5lVGV4dCA9IG9wdGlvbnMuZGVjbGluZVRleHQgPyAnJ1xuXHRcdEBfZGVjbGluZUFjdGlvbiA9IG9wdGlvbnMuZGVjbGluZUFjdGlvbiA/IC0+IG51bGxcblx0XHRcblx0XHRAb24gRXZlbnRzLlRhcCwgKGV2ZW50KSAtPiBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFxuXHRcdEBjb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHRcdG5hbWU6ICdjb250YWluZXInLCBwYXJlbnQ6IEBcblx0XHRcdHg6IEFsaWduLmNlbnRlclxuXHRcdFx0aGVpZ2h0OiAxMjgsIHdpZHRoOiBTY3JlZW4ud2lkdGggLSA4MFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiB0aGVtZS5kaWFsb2cuYmFja2dyb3VuZENvbG9yXG5cdFx0XHRzaGFkb3dYOiAwLCBzaGFkb3dZOiA3LCBzaGFkb3dCbHVyOiAzMFxuXHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0c2hhZG93Q29sb3I6ICdyZ2JhKDAsMCwwLC4zKSdcblx0XHRcblx0XHRAdGl0bGUgPSBuZXcgdHlwZS5UaXRsZVxuXHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBjb250YWluZXJcblx0XHRcdHg6IDI0LCB5OiAyMFxuXHRcdFx0Zm9udFNpemU6IDE2LCBmb250V2VpZ2h0OiA1MDAsIGNvbG9yOiB0aGVtZS50ZXh0LnRpdGxlXG5cdFx0XHR0ZXh0OiBAX3RpdGxlXG5cdFx0XG5cdFx0QGJvZHkgPSBuZXcgdHlwZS5TdWJoZWFkU2Vjb25kYXJ5XG5cdFx0XHRuYW1lOiAnYm9keScsIHBhcmVudDogQGNvbnRhaW5lclxuXHRcdFx0eDogMjQsIHk6IDUyXG5cdFx0XHR3aWR0aDogQGNvbnRhaW5lci53aWR0aCAtIDQyXG5cdFx0XHR0ZXh0OiBAX2JvZHlcblx0XHRcblx0XHRidXR0b25zWSA9IGlmIEBfYm9keSBpcyAnJyB0aGVuIDEyOCBlbHNlIEBib2R5Lm1heFkgKyAxNlxuXHRcdFxuXHRcdEBhY2NlcHQgPSBuZXcgQnV0dG9uXG5cdFx0XHRuYW1lOiAnLicsIHBhcmVudDogQGNvbnRhaW5lclxuXHRcdFx0eDogQWxpZ24ucmlnaHQoLTE2KSwgeTogYnV0dG9uc1lcblx0XHRcdHRleHQ6IEBfYWNjZXB0VGV4dC50b1VwcGVyQ2FzZSgpXG5cdFx0XHRhY3Rpb246IEBfYWNjZXB0QWN0aW9uXG5cdFx0XG5cdFx0aWYgQF9kZWNsaW5lVGV4dCBpc250ICcnXG5cdFx0XHRAZGVjbGluZSA9IG5ldyBCdXR0b25cblx0XHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBjb250YWluZXJcblx0XHRcdFx0eDogMCwgeTogYnV0dG9uc1lcblx0XHRcdFx0dGV4dDogQF9kZWNsaW5lVGV4dC50b1VwcGVyQ2FzZSgpXG5cdFx0XHRcdGFjdGlvbjogQF9kZWNsaW5lQWN0aW9uXG5cblx0XHQjIHNldCBwb3NpdGlvbnNcblx0XHRAY29udGFpbmVyLmhlaWdodCA9IEBhY2NlcHQubWF4WSArIDEyXG5cdFx0QGRlY2xpbmU/Lm1heFggPSBAYWNjZXB0LnggLSAxNlxuXHRcdEBjb250YWluZXIueSA9IEFsaWduLmNlbnRlcigxNilcblx0XHRcblx0XHQjIGFkZCBjbG9zZSBhY3Rpb25zIHRvIGNvbmZpcm0gYW5kIGNhbmNlbFxuXHRcdGZvciBidXR0b24gaW4gW0BhY2NlcHQsIEBkZWNsaW5lXVxuXHRcdFx0YnV0dG9uPy5vblRhcCBAY2xvc2Vcblx0XHRcblx0XHQjIE9OIExPQURcblx0XHRAb3BlbigpXG5cdFxuXHRvcGVuOiA9PlxuXHRcdEBhbmltYXRlXG5cdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRvcHRpb25zOiBcblx0XHRcdFx0dGltZTogLjI1XG5cdFx0XG5cdFx0QGNvbnRhaW5lci5hbmltYXRlXG5cdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRvcHRpb25zOlxuXHRcdFx0XHR0aW1lOiAuMjVcblx0XHRcdFx0ZGVsYXk6IC4wNVxuXG5cdGNsb3NlOiA9PlxuXHRcdEBjb250YWluZXIuYW5pbWF0ZVxuXHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0b3B0aW9uczpcblx0XHRcdFx0dGltZTogLjI1XG5cdFx0XG5cdFx0QGFuaW1hdGVcblx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdG9wdGlvbnM6XG5cdFx0XHRcdHRpbWU6IC4yNVxuXHRcdFxuXHRcdFV0aWxzLmRlbGF5IC41LCA9PiBAZGVzdHJveSgpXG5cblxuXG5cblxuXG5cblxuIyBcdCA4ODg4ODhiYSAgICAgICAgICAgICBkUCAgICAgZFBcbiMgXHQgODggICAgYDhiICAgICAgICAgICAgODggICAgIDg4XG4jIFx0YTg4YWFhYThQJyBkUCAgICBkUCBkODg4OFAgZDg4ODhQIC5kODg4OGIuIDg4ZDg4OGIuXG4jIFx0IDg4ICAgYDhiLiA4OCAgICA4OCAgIDg4ICAgICA4OCAgIDg4JyAgYDg4IDg4JyAgYDg4XG4jIFx0IDg4ICAgIC44OCA4OC4gIC44OCAgIDg4ICAgICA4OCAgIDg4LiAgLjg4IDg4ICAgIDg4XG4jIFx0IDg4ODg4ODg4UCBgODg4ODhQJyAgIGRQICAgICBkUCAgIGA4ODg4OFAnIGRQICAgIGRQXG5cblxuXG5leHBvcnRzLkJ1dHRvbiA9IEJ1dHRvbiA9IGNsYXNzIEJ1dHRvbiBleHRlbmRzIExheWVyIFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblxuXHRcdEBfcmFpc2VkID0gb3B0aW9ucy5yYWlzZWQgPyBmYWxzZVxuXHRcdEBfdHlwZSA9IGlmIEBfcmFpc2VkIHRoZW4gJ3JhaXNlZCcgZWxzZSAnZmxhdCdcblx0XHRAX2FjdGlvbiA9IG9wdGlvbnMuYWN0aW9uID8gLT4gbnVsbFxuXG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0bmFtZTogJy4nXG5cdFx0XHR3aWR0aDogMCwgaGVpZ2h0OiAzNlxuXHRcdFx0Ym9yZGVyUmFkaXVzOiAyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLmJ1dHRvbltAX3R5cGVdLmJhY2tncm91bmRDb2xvclxuXHRcdFx0c2hhZG93WTogdGhlbWUuYnV0dG9uW0BfdHlwZV0uc2hhZG93WVxuXHRcdFx0c2hhZG93Qmx1cjogdGhlbWUuYnV0dG9uW0BfdHlwZV0uc2hhZG93Qmx1clxuXHRcdFx0c2hhZG93Q29sb3I6IHRoZW1lLmJ1dHRvbltAX3R5cGVdLnNoYWRvd0NvbG9yXG5cdFx0XHRhbmltYXRpb25PcHRpb25zOiB7dGltZTogLjE1fVxuXG5cdFx0QGxhYmVsTGF5ZXIgPSBuZXcgdHlwZS5CdXR0b25cblx0XHRcdG5hbWU6ICcuJywgcGFyZW50OiBAXG5cdFx0XHRjb2xvcjogdGhlbWUuYnV0dG9uW0BfdHlwZV0uY29sb3Jcblx0XHRcdHRleHQ6IG9wdGlvbnMudGV4dCA/ICdidXR0b24nXG5cdFx0XHR0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJ1xuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJ1xuXHRcdFx0YW5pbWF0aW9uT3B0aW9uczoge3RpbWU6IC4xNX1cblx0XHRcdHBhZGRpbmc6IFxuXHRcdFx0XHRsZWZ0OiAxNi41LCByaWdodDogMTYuNVxuXHRcdFx0XHR0b3A6IDksIGJvdHRvbTogMTFcblxuXHRcdEBzaXplID0gQGxhYmVsTGF5ZXIuc2l6ZVxuXHRcdEB4ID0gb3B0aW9ucy54XG5cblx0XHRAb25Ub3VjaFN0YXJ0IChldmVudCkgLT4gXG5cdFx0XHRAc2hvd1RvdWNoZWQoKVxuXHRcdFx0VXRpbHMuZGVsYXkgMSwgPT4gQHJlc2V0KClcblx0XHRcblx0XHRAb25Ub3VjaEVuZCAoZXZlbnQpIC0+IFxuXHRcdFx0QF9hY3Rpb24oKVxuXHRcdFx0QHJlc2V0KClcblxuXG5cdHNob3dUb3VjaGVkOiAtPiBcblx0XHRAbGFiZWxMYXllci5hbmltYXRlIHticmlnaHRuZXNzOiAxMTAsIHNhdHVyYXRlOiAxMTB9XG5cdFx0XG5cdFx0c3dpdGNoIEBfdHlwZVxuXHRcdFx0d2hlbiAnZmxhdCcgdGhlbiBAYW5pbWF0ZSB7YmFja2dyb3VuZENvbG9yOiAncmdiYSgwLDAsMCwuMDUpJ31cblx0XHRcdHdoZW4gJ3JhaXNlZCdcblx0XHRcdFx0cmlwcGxlKEAsIGV2ZW50LnBvaW50LCBAbGFiZWxMYXllcilcblx0XHRcdFx0QGFuaW1hdGUge3NoYWRvd1k6IDMsIHNoYWRvd1NwcmVhZDogMX1cblxuXHRyZXNldDogLT5cblx0XHRAbGFiZWxMYXllci5hbmltYXRlIHticmlnaHRuZXNzOiAxMDAsIHNhdHVyYXRlOiAxMDB9XG5cdFx0QGJhY2tncm91bmRDb2xvciA9IHRoZW1lLmJ1dHRvbltAX3R5cGVdLmJhY2tncm91bmRDb2xvclxuXHRcdEBhbmltYXRlIFxuXHRcdFx0c2hhZG93WTogdGhlbWUuYnV0dG9uW0BfdHlwZV0uc2hhZG93WVxuXHRcdFx0c2hhZG93U3ByZWFkOiAwXG5cblxuXG5cblxuXG5cblxuIyBcdCA4ODg4ODg4OGIgICAgICAgICAgZFBcbiMgXHQgODggICAgICAgICAgICAgICAgIDg4XG4jIFx0YTg4YWFhYSAgICAuZDg4ODhiLiA4OGQ4ODhiLlxuIyBcdCA4OCAgICAgICAgODgnICBgODggODgnICBgODhcbiMgXHQgODggICAgICAgIDg4LiAgLjg4IDg4LiAgLjg4XG4jIFx0IGRQICAgICAgICBgODg4ODhQOCA4OFk4ODg4J1xuXG5cblxuZXhwb3J0cy5GYWIgPSBGYWIgPSBjbGFzcyBGYWIgZXh0ZW5kcyBMYXllciBcblx0Y29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG5cblx0XHRAX3JhaXNlZCA9IG9wdGlvbnMucmFpc2VkID8gZmFsc2Vcblx0XHRAX2FjdGlvbiA9IG9wdGlvbnMuYWN0aW9uID8gLT4gbnVsbFxuXHRcdEBfaWNvbiA9IG9wdGlvbnMuaWNvbiA/ICdwbHVzJ1xuXG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0bmFtZTogJy4nXG5cdFx0XHR4OiBBbGlnbi5yaWdodCgtMTYpLCB5OiBBbGlnbi5ib3R0b20oLTY2KVxuXHRcdFx0d2lkdGg6IDY0LCBoZWlnaHQ6IDY0LCBib3JkZXJSYWRpdXM6IDMyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHRoZW1lLmZhYi5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRcdHNoYWRvd1k6IDIsIHNoYWRvd0JsdXI6IDNcblx0XHRcdHNoYWRvd0NvbG9yOiAncmdiYSgwLDAsMCwuMjUpJ1xuXHRcdFx0YW5pbWF0aW9uT3B0aW9uczoge3RpbWU6IC4xNX1cblxuXHRcdGlmIGFwcC5ib3R0b21OYXY/IHRoZW4gQHkgLT0gYXBwLmJvdHRvbU5hdi5oZWlnaHRcblxuXHRcdEBpY29uTGF5ZXIgPSBuZXcgSWNvblxuXHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBcblx0XHRcdHg6IEFsaWduLmNlbnRlciwgeTogQWxpZ24uY2VudGVyXG5cdFx0XHRpY29uOiBAX2ljb24sIGNvbG9yOiB0aGVtZS5mYWIuY29sb3JcblxuXHRcdEBvblRvdWNoU3RhcnQgKGV2ZW50KSAtPiBcblx0XHRcdEBzaG93VG91Y2hlZCgpXG5cdFx0XHRVdGlscy5kZWxheSAxLCA9PiBAcmVzZXQoKVxuXHRcdFxuXHRcdEBvblRvdWNoRW5kIChldmVudCkgLT4gXG5cdFx0XHRAX2FjdGlvbigpXG5cdFx0XHRAcmVzZXQoKVxuXG5cblx0c2hvd1RvdWNoZWQ6IC0+IFxuXHRcdHJpcHBsZShALCBldmVudC5wb2ludCwgQGljb25MYXllcilcblx0XHRAYW5pbWF0ZSB7c2hhZG93WTogMywgc2hhZG93U3ByZWFkOiAxfVxuXG5cdHJlc2V0OiAtPlxuXHRcdEBhbmltYXRlIFxuXHRcdFx0c2hhZG93WTogMlxuXHRcdFx0c2hhZG93U3ByZWFkOiAwXG5cblxuXG5cblxuXG5cblxuXG4jIFx0IC44ODg4OC4gICAgICAgICAgIG9vICAgICAgIGRQIGRQICAgICAgICBvbyAgICAgICAgICAgIGRQXG4jIFx0ZDgnICAgYDg4ICAgICAgICAgICAgICAgICAgIDg4IDg4ICAgICAgICAgICAgICAgICAgICAgIDg4XG4jIFx0ODggICAgICAgIDg4ZDg4OGIuIGRQIC5kODg4Yjg4IDg4ICAgICAgICBkUCAuZDg4ODhiLiBkODg4OFBcbiMgXHQ4OCAgIFlQODggODgnICBgODggODggODgnICBgODggODggICAgICAgIDg4IFk4b29vb28uICAgODhcbiMgXHRZOC4gICAuODggODggICAgICAgODggODguICAuODggODggICAgICAgIDg4ICAgICAgIDg4ICAgODhcbiMgXHQgYDg4ODg4JyAgZFAgICAgICAgZFAgYDg4ODg4UDggODg4ODg4ODhQIGRQIGA4ODg4OFAnICAgZFBcblxuZXhwb3J0cy5HcmlkTGlzdCA9IEdyaWRMaXN0ID0gY2xhc3MgR3JpZExpc3QgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblx0XHRcblx0XHRAX2NvbHVtbnMgPSBvcHRpb25zLmNvbHVtbnMgPyAyXG5cdFx0XG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0bmFtZTogJy4nXG5cdFx0XHR3aWR0aDogU2NyZWVuLndpZHRoXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcblx0XHRAdGlsZXMgPSBbXVxuXHRcdEB0aWxlV2lkdGggPSAoQHdpZHRoIC0gMjQpIC8gQF9jb2x1bW5zXG5cdFx0QHRpbGVIZWlnaHQgPSBvcHRpb25zLnRpbGVIZWlnaHQgPyBTY3JlZW4ud2lkdGggLyBAX2NvbHVtbnNcblx0XHRcblx0YWRkVGlsZTogKHRpbGUpIC0+XG5cdFx0dGlsZS5pID0gQHRpbGVzLmxlbmd0aFxuXHRcdEB0aWxlcy5wdXNoKHRpbGUpXG5cdFx0XG5cdFx0dGlsZS54ID0gOCArIChAdGlsZVdpZHRoICsgOCkgKiAodGlsZS5pICUgQF9jb2x1bW5zKVxuXHRcdHRpbGUueSA9IDggKyAoQHRpbGVIZWlnaHQgKyA4KSAqIE1hdGguZmxvb3IodGlsZS5pIC8gQF9jb2x1bW5zKVxuXG5cdFx0QGhlaWdodCA9IF8ubGFzdChAdGlsZXMpLm1heFlcblxuXHRcdGlmIEBwYXJlbnQ/LnBhcmVudD8uY29udGVudD8gdGhlbiBAcGFyZW50LnBhcmVudC51cGRhdGVDb250ZW50KClcblxuXG5cblxuXG5cblxuXG5cbiMgXHRkODg4ODg4UCBvbyBkUFxuIyBcdCAgIDg4ICAgICAgIDg4XG4jIFx0ICAgODggICAgZFAgODggLmQ4ODg4Yi5cbiMgXHQgICA4OCAgICA4OCA4OCA4OG9vb29kOFxuIyBcdCAgIDg4ICAgIDg4IDg4IDg4LiAgLi4uXG4jIFx0ICAgZFAgICAgZFAgZFAgYDg4ODg4UCdcblxuXG5leHBvcnRzLlRpbGUgPSBUaWxlID0gY2xhc3MgVGlsZSBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdFxuXHRcdEBfaGVhZGVyID0gb3B0aW9ucy5oZWFkZXIgPyBmYWxzZVxuXHRcdEBfZm9vdGVyID0gb3B0aW9ucy5mb290ZXIgPyBmYWxzZVxuXHRcdFxuXHRcdGlmIEBfaGVhZGVyIGFuZCBAX2Zvb3RlciB0aGVuIHRocm93ICdUaWxlIGNhbm5vdCBoYXZlIGJvdGggYSBoZWFkZXIgYW5kIGEgZm9vdGVyLidcblx0XHRcblx0XHRAX2ljb24gPSBvcHRpb25zLmljb25cblx0XHRAX2dyaWRMaXN0ID0gb3B0aW9ucy5ncmlkTGlzdCA/IHRocm93ICdUaWxlIG5lZWRzIGEgZ3JpZCBwcm9wZXJ0eS4nXG5cdFx0XG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBfZ3JpZExpc3Rcblx0XHRcdHdpZHRoOiBAX2dyaWRMaXN0LnRpbGVXaWR0aFxuXHRcdFx0aGVpZ2h0OiBAX2dyaWRMaXN0LnRpbGVIZWlnaHRcblx0XHRcdFxuXHRcdGlmIEBfaGVhZGVyIG9yIEBfZm9vdGVyXG5cdFx0XHRAaGVhZGVyID0gbmV3IExheWVyXG5cdFx0XHRcdG5hbWU6ICcuJywgcGFyZW50OiBAXG5cdFx0XHRcdHk6IGlmIEBfZm9vdGVyIHRoZW4gQWxpZ24uYm90dG9tKClcblx0XHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0XHRoZWlnaHQ6IGlmIG9wdGlvbnMuc3VwcG9ydCB0aGVuIDY4IGVsc2UgNDhcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBvcHRpb25zLmJhY2tncm91bmRDb2xvciA/ICdyZ2JhKDAsMCwwLC41KSdcblx0XHRcdFx0XG5cdFx0XHRpZiBvcHRpb25zLnRpdGxlXG5cdFx0XHRcdEBoZWFkZXIudGl0bGUgPSBuZXcgdHlwZS5SZWd1bGFyXG5cdFx0XHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBoZWFkZXJcblx0XHRcdFx0XHR4OiA4LCB5OiBpZiBvcHRpb25zLnN1cHBvcnQgdGhlbiAxMiBlbHNlIEFsaWduLmNlbnRlcigpXG5cdFx0XHRcdFx0Y29sb3I6IEBjb2xvclxuXHRcdFx0XHRcdHRleHQ6IG9wdGlvbnMudGl0bGUgPyAnVHdvIExpbmUnXG5cdFx0XHRcblx0XHRcdFx0aWYgb3B0aW9ucy5zdXBwb3J0XG5cdFx0XHRcdFx0QGhlYWRlci5zdXBwb3J0ID0gbmV3IFRleHRMYXllclxuXHRcdFx0XHRcdFx0bmFtZTogJy4nLCBwYXJlbnQ6IEBoZWFkZXJcblx0XHRcdFx0XHRcdHg6IDgsIHk6IDM1XG5cdFx0XHRcdFx0XHRmb250U2l6ZTogMTJcblx0XHRcdFx0XHRcdGZvbnRGYW1pbHk6ICdSb2JvdG8nXG5cdFx0XHRcdFx0XHRjb2xvcjogQGNvbG9yXG5cdFx0XHRcdFx0XHR0ZXh0OiBvcHRpb25zLnN1cHBvcnQgPyAnU3VwcG9ydCB0ZXh0J1xuXHRcdFx0XG5cdFx0XHRpZiBvcHRpb25zLmljb25cblx0XHRcdFx0QGhlYWRlci5pY29uID0gbmV3IEljb25cblx0XHRcdFx0XHRuYW1lOiAnLicsIHBhcmVudDogQGhlYWRlclxuXHRcdFx0XHRcdHg6IEFsaWduLnJpZ2h0KC0xMiksIHk6IGlmIG9wdGlvbnMuc3VwcG9ydCB0aGVuIDIwIGVsc2UgQWxpZ24uY2VudGVyKClcblx0XHRcdFx0XHRpY29uOiBvcHRpb25zLmljb25cblx0XHRcdFx0XHRjb2xvcjogQGNvbG9yXG5cblxuXHRcdEBpID0gdW5kZWZpbmVkXG5cdFx0QF9ncmlkTGlzdC5hZGRUaWxlKEApXG5cdFx0XHRcblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTty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
