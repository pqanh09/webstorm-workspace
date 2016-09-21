/**
 $Id:
 (c) Copyright ALE USA Inc., 2016
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';
  angular.module('sample.app')
    .constant('SampleAppConstant', {
      vm: 'vm',
      shared: {
        templateUrl: {
          confirm: 'scripts/sample-app/sample-shared/shared-confirm-dlg.html',
          view: 'scripts/sample-app/sample-shared/shared-view.html',
          result: 'scripts/sample-app/sample-shared/shared-result-page.html'
        }
      },
      sample: {
        id: 'sample-app',
        title: 'sampleApp.title',
        templateUrl: {
          appDirective: 'scripts/sample-app/sample-app.component.html'
        }
      },
      sampleHome: {
        id: 'sample-home',
        title: 'sampleApp.menus.sampleHome.title',
        templateUrl: {
          app: 'scripts/sample-app/sample-home/sample-home.html',
          appDirective: 'scripts/sample-app/sample-home/sample-home.component.html'
        }
      },
      sampleOne: {
        id: 'sample-one',
        title: 'sampleApp.menus.sampleOne.title',
        templateUrl: {
          app: 'scripts/sample-app/sample-one/sample-one.html',
          appDirective: 'scripts/sample-app/sample-one/sample-one.component.html',
          detail: 'scripts/sample-app/sample-one/view/sample-one-detail.html',
          create: 'scripts/sample-app/sample-one/action/sample-one-create-edit.html',
          edit: 'scripts/sample-app/sample-one/action/sample-one-create-edit.html'
        },
        attrs: {
          name: {
            key: 'name',
            i18nKey: 'sampleApp.attrs.name'
          },
          description: {
            key: 'description',
            i18nKey: 'sampleApp.attrs.description'
          }
        },
        validatorGroupId: 'sampleOne',
        helpLink: 'help-link-url'
      },
      sampleTwo: {
        id: 'sample-two',
        title: 'sampleApp.menus.sampleTwo.title'
      },
      sampleTwo1: {
        id: 'sample-two-one',
        title: 'sampleApp.menus.sampleTwo1.title',
        templateUrl: {}
      },
      sampleTwo2: {
        id: 'sample-two-one',
        title: 'sampleApp.menus.sampleTwo2.title',
        templateUrl: {}
      }
    });
})();