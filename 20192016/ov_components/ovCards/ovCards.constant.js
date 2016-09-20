/**
 (c) Copyright ALE USA Inc., 2015
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.ovCards', [])
    .constant('ovCardsConstant', {
      templateUrl: {
        main: 'ov_components/ovCards/templates/main.html',
        card: 'ov_components/ovCards/templates/card.html',
        cardType: {
          textOnly: 'ov_components/ovCards/templates/1.cardTextOnly.html',
          includedIcon: 'ov_components/ovCards/templates/2.cardIncludedIcon.html'
        }
      },
      cardType: {
        textOnly: 'textOnly',
        includedIcon: 'includedIcon'
      },
      onDestroy: '$destroy',
      widthCard: 270,
      zero: 0
    });
})();
