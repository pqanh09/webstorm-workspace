'use strict';
angular.module('ngnms.ui.fwk.ovConverter', [])
.factory('$ovConverter', [function(){
  return {
    parseIp: function(str){
      var b = [0,0,0,0];
      if (parseInt(str,10) < 256){
        b[3] = parseInt(str, 10);
      }else{
        var c = 16777216;
        var ip = parseInt(str,10);
        for (var i =0; i< 4;i++){
          var k = parseInt(ip / c, 10);
          ip -= c * k;
          b[i]= k;
          c /=256.0;
        }
      }
      return b.join('.');
    },
    parseMAC: function(str){
      str = str.replace(/\.|-/g, ':');
      String.prototype.replaceAt=function(index, character) {
        return this.substr(0, index) + character + this.substr(index+1);
      };
      if (str.length > 13){
        str = str.replaceAt(2,'');
        str = str.replaceAt(4, '');
        str = str.replaceAt(9, '');
        str = str.replaceAt(11, '');
      }
      return str;
    },
    findIpAddress: function(str){
      var ipPattern =  /\b(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\b|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*/g;
      return str.match(ipPattern);
    },
    findMacAddress: function(str){
      var macPatternColon = /([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])/g;
      var macPatternColon2 = /([0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]:)([0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F])/g;
      return str.match(macPatternColon) || str.match(macPatternColon2);
    },
    locatorProgressResult: function(result){
      var response = result.match(/\{(.)*\}/g);
      response = '['+response+']}}]';
      response = response.replace(/\]\}\}\]\}\}\]/g,']}}]');
      response = response.replace(/\}\}\]\}\}\]/g,'}}]');
      response = response.replace(/\}\{/g, '},{');
      return response;
    },

    //dminhquan Convert int to SubnetMask
    //Ex: Convert 24 to 255.255.255.0
    convertIntToSubnetMask: function(intValue){
      var i = 0;
      var binString = '';
      for(i = 0; i < 32; i++){
        if(i % 8 === 0 && i !== 0){
          binString += ' ';
        }
        if(i < intValue){
          binString += '1';
        }else{
          binString += '0';
        }
      }

      var binStrs = binString.split(' ');
      var subnetMask = [0, 0, 0, 0];
      for(i = 0; i < binStrs.length; i++){
        subnetMask[i] = parseInt(binStrs[i],2).toString(10);
      }
      return subnetMask.join('.');
    }
  };
}]);