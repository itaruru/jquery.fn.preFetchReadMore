// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var pluginName = 'preFetchReadMore'
    , defaults   = {
        url:    '',
        target: '',
        pre_fetch: true
      }
    , $self      = null
    , $target    = null
    , $loading   = null
    , fetch_data = ''
    , is_error   = false
	;

  function ajax_options(options, callbacks) {
    options = $.extend({
      url: options['url'],
      type: 'GET',
      data: options,
      dataType: 'html',
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        fetch_data = '';
        is_error   = true;
        console.log(XMLHttpRequest, textStatus, errorThrown);
      },
      beforeSend: function() {
        $self.hide();
        $loading.show();
      },
      complete: function() {
        if ($.isFunction(options['completeBefore'])) {
          options['completeBefore']($self);
        }
        $loading.hide();
        if (!is_error) {
          $self.show();
        }
      }
    }, callbacks);
    return options;
  }

  function loadingImg(options) {
    var loadingIMGId = pluginName + 'loadingAmination';
    var loadingIMG   = '<img src="data:image/gif;base64,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">';
    var loadingHTML  = '<div id="' + loadingIMGId + '" style="display:none;padding:10px 0;text-align:center;">' + loadingIMG + '</div>';
    $self.after(loadingHTML);
    return $('#' + loadingIMGId);
  }

  function callData(options) {
    if (fetch_data === '') {
      $.ajax(ajax_options(options, {
        success: function(data, dataType) {
          $target.append(data);
        }
      }));
    } else {
      $target.append(fetch_data);
    }
  }

  function preFetchCallData(options) {
    $.ajax(ajax_options(options, {
      success: function(data, dataType) {
        fetch_data = data;
      }
    }));
  }

  // The actual plugin constructor
  function Plugin ( element, options ) {
    this.element = element;
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function () {
      // Place initialization logic here
      // You already have access to the DOM element and
      // the options via the instance, e.g. this.element
      // and this.options
      // you can add more functions like the one below and
      // call them like so: this.yourOtherFunction(this.element, this.options).
      var options  = this.options;

      $self    = $(this.element);
      $target  = $(options['target']);
      $loading = loadingImg($self);

      if (options['pre_fetch'] === true) {
        preFetchCallData(options);
      }

      $self.on('click', function(event) {
        callData(options);
        if (options['pre_fetch'] === true) {
          preFetchCallData(options);
        }
      });
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[ pluginName ] = function ( options ) {
    return this.each(function() {
      if ( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
      }
    });
  };
})( jQuery, window, document );
