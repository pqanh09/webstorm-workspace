(function () {
  'use strict';
  //ignore jshint warning function was used before was defined
  /* jshint latedef:nofunc */

  angular.module('ngnms.ui.fwk.slickMenu')
    .factory('ovSlickMenuBuilder', ovSlickMenuBuilder);

  ovSlickMenuBuilder.$inject = ['ovSlickMenuConstant'];
  function ovSlickMenuBuilder(ovSlickMenuConstant) {
    function Builder() {
      /*jshint validthis:true */
      var builder = this;
      var defaultConfig = {
        //id prefix to generate unique id for automation test
        showMode: ovSlickMenuConstant.BOTH,
        idPrefix: 'ov-slickMenu-',
        //reverse list
        reverseData: true,
        //option, can be omit: will be assign default value
        showMenuButton: {
          id: 'show-menu-button',
          titleI18key: 'common.showMenu',
          btnClass: 'btn btn-default',
          iconClass: 'fa fa-ellipsis-v fa-2x'
        },
        minWidth: ovSlickMenuConstant.DEFAULT_MIN_WITH,
        overrideCss: 'slick-menu-override',
        containerCssClass: 'vxlans-slick-menu',
        toggleButtonTemplate: 'ov_components/ovSlickMenu/template/defaultToggleButton.tpl.html',
        ulOverrideCss: 'ul-slick-menu-override'
      };

      function showOnlySmallMode() {
        defaultConfig.showMode = ovSlickMenuConstant.ONY_SMALL_MODE;
        /*jshint validthis:true */
        return this;
      }
      function showOnlyLargeMode() {
        defaultConfig.showMode = ovSlickMenuConstant.ONY_LARGE_MODE;
        /*jshint validthis:true */
        return this;
      }
      function setIdPrefix(value) {
        defaultConfig.idPrefix = value;
        /*jshint validthis:true */
        return this;
      }

      function reverseData(value) {
        defaultConfig.reverseData = value;
        /*jshint validthis:true */
        return this;
      }

      function setShowMenuButton(value) {
        defaultConfig.showMenuButton = value;
        /*jshint validthis:true */
        return this;
      }

      function setMinWidth(value) {
        defaultConfig.minWidth = value + 'px';
        /*jshint validthis:true */
        return this;
      }

      function setOverrideCss(value) {
        defaultConfig.overrideCss = value;
        /*jshint validthis:true */
        return this;
      }

      function setUlOverrideCss(value) {
        defaultConfig.ulOverrideCss = value;
        /*jshint validthis:true */
        return this;
      }

      function setContainerCssClass(value) {
        defaultConfig.containerCssClass = value;
        /*jshint validthis:true */
        return this;
      }

      function setToggleButtonTemplate(value) {
        defaultConfig.toggleButtonTemplate = value;
        /*jshint validthis:true */
        return this;
      }

      function extend(extendedData) {
        angular.extend(defaultConfig, extendedData);
        /*jshint validthis:true */
        return this;
      }

      return {
        /**
         * @ngdoc method
         * @name extend
         * @methodOf ov-component.service:ovSlickMenuBuilder
         *
         * @description
         * Extend custom configuration from the default one
         *
         * @param {object} extendedData Custom configuration.
         * Custom configuration object should follow the default one which contains following property
         * * `showMode`: Indicate the menu will be shown in large mode only or in small mode only or in both modes. Default is both. Use ovSlickMenuConstant.BOTH, ovSlickMenuConstant.ONY_SMALL_MODE, and ovSlickMenuConstant.ONY_LARGE_MODE to declare.
         * * `idPrefix`: The prefix for ID used for automation test. Default is 'ov-slickMenu-
         * * `showMenuButton`: The object to render toggle button to display menu in small mode. Default is
         * <pre>
         *  {
         *    id: 'show-menu-button',
         *    titleI18key: 'common.showMenu',
         *    btnClass: 'btn btn-default',
         *    iconClass: 'fa fa-ellipsis-v fa-2x'
         *  }
         * </pre>
         * * `minWidth`: Minimum value of width which the menu will be displayed in small mode. Default is '832px'
         * * `overrideCss`: CSS class which overrides the default one. Default is 'slick-menu-override'
         * * `ulOverrideCss`: CSS class which overrides the default one of UL element. Default is 'ul-slick-menu-override'
         * * `toggleButtonTemplate`: Custom template for toggle button.
         *
         * @returns {object} The builder instance
         * */
        extend: extend,
        /**
         * @ngdoc method
         * @name showOnlySmallMode
         * @methodOf ov-component.service:ovSlickMenuBuilder
         *
         * @description
         * Indicate the menu will be shown in small mode only
         *
         * @returns {object} The builder instance
         * */
        showOnlySmallMode: showOnlySmallMode,
        /**
         * @ngdoc method
         * @name showOnlyLargeMode
         * @methodOf ov-component.service:ovSlickMenuBuilder
         *
         * @description
         * Indicate the menu will be shown in large mode only
         *
         * @returns {object} The builder instance
         * */
        showOnlyLargeMode: showOnlyLargeMode,
        /**
         * @ngdoc method
         * @name setIdPrefix
         * @methodOf ov-component.service:ovSlickMenuBuilder
         *
         * @description
         * Set the prefix for ID used in the component for automation test
         *
         * @param {string} value ID prefix
         *
         * @returns {object} The builder instance
         * */
        setIdPrefix: setIdPrefix,
        setReverseData: reverseData,
        /**
         * @ngdoc method
         * @name setShowMenuButton
         * @methodOf ov-component.service:ovSlickMenuBuilder
         *
         * @description
         * Set custom object for toggle button which will be displayed in small mode to open the menu
         *
         * @param {object} value Custom menu button. It should be like the following
         * <pre>
         *  {
         *    id: 'show-menu-button',
         *    titleI18key: 'common.showMenu',
         *    btnClass: 'btn btn-default',
         *    iconClass: 'fa fa-ellipsis-v fa-2x'
         *  }
         * </pre>
         *
         * @returns {object} The builder instance
         * */
        setShowMenuButton: setShowMenuButton,
        /**
         * @ngdoc method
         * @name setMinWidth
         * @methodOf ov-component.service:ovSlickMenuBuilder
         *
         * @description
         * Set minimum value of width which the menu will be displayed in small mode
         *
         * @param {number} value Minimum width
         *
         * @returns {object} The builder instance
         * */
        setMinWidth: setMinWidth,
        /**
         * @ngdoc method
         * @name setOverrideCss
         * @methodOf ov-component.service:ovSlickMenuBuilder
         *
         * @description
         * Set CSS class which overrides the default one
         *
         * @param {string} value Overridden CSS class
         *
         * @returns {object} The builder instance
         * */
        setOverrideCss: setOverrideCss,
        /**
         * @ngdoc method
         * @name setUlOverrideCss
         * @methodOf ov-component.service:ovSlickMenuBuilder
         *
         * @description
         * Set CSS class which overrides the default one of UL element
         *
         * @param {string} value Overridden CSS class
         *
         * @returns {object} The builder instance
         * */
        setUlOverrideCss: setUlOverrideCss,
        setContainerCssClass: setContainerCssClass,
        /**
         * @ngdoc method
         * @name setToggleButtonTemplate
         * @methodOf ov-component.service:ovSlickMenuBuilder
         *
         * @description
         * Set custom template for toggle button
         *
         * @param {string} value Path to your custom template
         *
         * @returns {object} The builder instance
         * */
        setToggleButtonTemplate: setToggleButtonTemplate,
        /**
         * @ngdoc method
         * @name build
         * @methodOf ov-component.service:ovSlickMenuBuilder
         *
         * @description
         * Build up the configuration object which is used in ov-slick-menu object
         *
         * @returns {object} The builder instance
         * */
        build: function () {
          return defaultConfig;
        }
      };
    }


    /**
     * provide blueprint for slick menu
     * @constructor
     */
    function SlickMenu(){
      /*jshint validthis:true*/
      var slickMenu = this;
      slickMenu.status = true;
      slickMenu.getStatus = function () {
        return slickMenu.status;
      };
      slickMenu.hideMenu = function () {
        slickMenu.status = false;
      };
      slickMenu.showMenu = function () {
        slickMenu.status = true;
      };
    }

    /**
     * @ngdoc service
     * @name ov-component.service:ovSlickMenuBuilder
     *
     * @description
     * Used to build configuration object which is used for ov-slick-menu component
     *
     * */

    return {
      getBuilder: function () {
        return new Builder();
      },
      getConfigBuilder: function () {
        return new Builder();
      },
      getSlickMenu: function () {
        return new SlickMenu();
      }
    };
  }
  //======this line always line at the end file========
})();
