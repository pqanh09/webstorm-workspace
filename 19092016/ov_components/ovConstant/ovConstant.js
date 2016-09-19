/**
 * Created by nhuuduc on 10/22/2014.
 */
(function () {
  'use strict';
  angular.module('ngnms.ui.fwk.services.ovConstant', [])
    .constant('ovConstant', {
      branding: {
        width: 232,
        height: 89,
        default: 'default',
        custom: 'custom',
        customImageUrl: 'report/customLogo.jpg',
        logo: 'styles/imgs/al-logo-white.png',
        reportLogo: 'styles/imgs/logo_purple.png',
        desc: 'Powered by Alcatel-Lucent Enterprise'
      },
      taskFlow: {
        url: {
          captivePortal: {
            profile: 'captivePortal/profile',
            homeUrl: '/captivePortal',
            configurationUrl: '/captivePortal/configuration',
            profileUrl: '/captivePortal/profile',
            profileDomainPolicyListUrl: '/captivePortal/profileDomainPolicyList',
            domainPolicyListUrl: '/captivePortal/domainPolicyList',
            customizationUrl: '/captivePortal/customization',
            viewUrl: '/captivePortal/view'

          },
          accessGuardian: {
            home: '/accessGuardian2.0/ag/home',
            accessRoleProfile: 'accessGuardian2.0/ag/expertMode/edgeProfile',
            accessAuthProfile: 'accessGuardian2.0/ag/expertMode/edgeTemplate',
            classification: 'accessGuardian2.0/ag/expertMode/classification',
            aaaProfile: '/accessGuardian2.0/ag/expertMode/aaaProfile',
            workflow: '/accessGuardian2.0/ag/workflow',
            portGroup: '/accessGuardian2.0/ag/expertMode/portGroups',
            periodic: '/accessGuardian2.0/ag/expertMode/agAccessPolicies/periodic',
            location: '/accessGuardian2.0/ag/expertMode/agAccessPolicies/location',
            diagnostic: '/accessGuardian2.0/ag/expertMode/diagnostic',
            spbProfile: '/accessGuardian2.0/ag/expertMode/spbProfile',
            staticService: '/accessGuardian2.0/ag/expertMode/staticService',
            customerDomain: '/accessGuardian2.0/ag/expertMode/customerDomain',
            vxLANMapping: '/accessGuardian2.0/ag/expertMode/vxLanMapping',
            wirelessProfiles: {
              IEEEAuthenticationProfile: '/accessGuardian2.0/ag/expertMode/wirelessProfiles/IEEEAuthenticationProfile',
              macAuthenticationProfile: '/accessGuardian2.0/ag/expertMode/wirelessProfiles/macAuthenticationProfile',
              SSIDProfile: '/accessGuardian2.0/ag/expertMode/wirelessProfiles/SSIDProfile'
            },
            accessAuthProfileDevice: 'accessGuardian2.0/ag/deviceConfiguration/edgeTemplateDeviceConfig',
            farEndIp: '/accessGuardian2.0/ag/expertMode/farIp'
          },
          vmSnooping: {
            rootUrl: 'vmSnooping/'
          },
          accessGuardianV1: {
            customerDomainUrl: '/accessGuardian1.0/customerDomain',
            spbProfileUrl: '/accessGuardian1.0/unp/spbProfile',
            unpProfileUrl: '/accessGuardian1.0/unp/bridgingProfile'
          }

          //end url section
        },
        state: {
          create: 'CREATE',
          edit: 'EDIT'
        },
        controllerName: {
          topology: 'TopologyController',
          consistencyCheck: 'consistencyCheckCtrl'
        }
      },
      appUrl: {
        ovSkeletonRoute: '/:route*',
        home: '/home',
        resourceManager: '/resourceManager',
        sample: {
          main: '/sample',
          sample1: '/sample/sample1'
        },
        ztp: {
          main: 'dashboard/ztp',
          ztpProfile: '/zptProfile',
          rclProfile: '/rclProfile',
          rclFile: '/rclFile'
        },
        customerNetworks: {
          main: 'dashboard/customerNetworks',
          cnAdmin: '/cnAdmin',
          rclProfile: '/rclProfile',
          rclFile: '/rclFile'
        },
        notifications: {
          main: '/notifications',
          trapDisplay: '/trap-display',
          trapResponder: '/trap-responder',
          trapDefinition: '/trap-definition'
        },
        vlanManager: {
          id: 'vlan-manager',
          vlan: 'vlan',
          mvrp: {
            id: 'mvrp',
            summaryView: 'summary-view',
            configuration: 'configuration'
          },
          ipInterface: 'ip-interface',
          poll: {
            id : 'poll'
          },
          analytics: {
            id: 'analytics',
            home: 'home',
            registrationFailure: 'registration-failure',
            invalidMessage: 'invalid-message',
            mvrpStatistics: 'mvrp-statistics'
          }
        },
        sip: {
          main: '/sip',
          activeCall: '/sip/activeCall',
          endedCall: '/sip/endedCall',
          setting: '/sip/setting',
          oneTouchProfile: '/sip/oneTouchProfile',
          sipProfile: '/sip/sipProfile',
          globalParamProfile: '/sip/globalParamProfile',
          trustedServerProfile: '/sip/trustedServerProfile',
          tcpPortProfile: '/sip/tcpPortProfile',
          udpPortProfile: '/sip/udpPortProfile',
          deviceView: '/sip/deviceView'
        },
        vmManager: {
          main: '/vm-manager'
        },
        DHCPSnooping: {
          main: '/dhcpSnooping'
        },
        topology: '/topology',
        quarantineManager: '/quarantineManager'
      },
      mode: {
        main: 'main',
        table: 'table',
        list: 'list',
        edit: 'edit',
        view: 'view',
        create: 'create',
        add: 'add',
        delete: 'delete',
        result: 'result',
        install: 'install',
        import: 'import',
        export: 'export',
        config: 'config',
        apply: 'apply',
        applyResult: 'applyResult',
        removeApply: 'removeApply',
        removeApplyResult: 'removeApplyResult',
        assign: 'assign',
        chart: 'chart',
        switchPicker: 'switchPicker',
        topology: 'topology'
      },
      filter: {
        string: 0,
        number: 1,
        boolean: 2,
        date: 3,
        time: 4,
        dateTime: 5
      },
      uiLog: {
        system: 'system',
        action: 'action'
      },
      hasCurrentMasterUser: {
        currentMasterUser: ['authenService', function (authenService) {
          return authenService.getCurrentMasterUserPromise;
        }]
      },
      hasCurrentUser: {
        currentUser: ['authenService', function (authenService) {
          return authenService.getCurrentUserPromise;
        }]
      },
      componentTemplate: {
        dataView: {
          listBoxHeader: 'ov_components/ovDataView/templates/ovListBoxDefaultHeader.html',
          listBoxItem: 'ov_components/ovDataView/templates/ovListBoxDefaultContent.html',
          detailTemplate: 'ov_components/ovDataView/templates/ovDataViewDefaultDetail.html'
        },
        ovSummaryView: {
          layouts: {
            layout1: 'ov_components/ovSummaryView/layouts/layout1.html',
            layout2: 'ov_components/ovSummaryView/layouts/layout2.html'
          },
          headerTemplate: 'ov_components/ovSummaryView/templates/defaultHeader.html',
          tabListTemplate: 'ov_components/ovSummaryView/templates/defaultTabList.html',
          deviceSelectorTemplate: 'ov_components/ovSummaryView/templates/defaultDeviceSelector.html',
          navBarTemplate: 'ov_components/ovSummaryView/templates/defaultNavBar.html',
          iconToolbarTemplate: 'ov_components/ovSummaryView/templates/defaultIconToolbar.html',
          contentTemplate: 'ov_components/ovSummaryView/templates/defaultContent.html'
        },
        ovNgListBox: {
          headerTemplate: 'ov_components/ovNgListBox/defaultHeaderTemplate.html',
          resultHeaderTemplate: 'ov_components/ovNgListBox/defaultResultHeaderTemplate.html',
          resultItemTemplate: 'ov_components/ovNgListBox/defaultResultItemTemplate.html'
        }
      },
      deviceStatus: {
        up: 'Up',
        down: 'Down',
        warning: 'Warning',
        reachable: 'Reachable'
      },
      ovTag: {
        success: 'ov-tag-success',
        primary: 'ov-tag-primary',
        warning: 'ov-tag-warning',
        info: 'ov-tag-info',
        danger: 'ov-tag-danger',
        down: 'ov-tag-down',
        up: 'ov-tag-up',
        assigned: 'ov-tag-assigned',
        default: 'ov-tag-default',
        unknown: 'ov-tag-unknown'
      },
      ovcStatus: {
        up: 'up',
        down: 'down',
        unknown: 'unknown'
      },
      permission: {
        read: 'read',
        write: 'write',
        readOnly: 'readOnly'
      },
      systemRole: {
        accountAdmin: 'Account Admin',
        networkAdmin: 'Network Admin',
        none: 'None',
        read: 'Read',
        write: 'Write'
      },
      urlApp: {
        sip: {
          sipProfile: {
            url: '/sip/sip-configuration/sip-profile',
            name: 'SIP Profile',
            key: 'sipProfileName'
          }
        }
      },
      ovApp: { //used to build the main menu
        //Network groups
        network: {
          discovery: {
            id: 'discovery',//Discovery
            route: 'discovery'
          },
          topology: {
            id: 'topology', // Topology
            route: 'topology'
          },
          locator: {
            id: 'locator', // Locator
            route: 'locator'
          },
          notification: {
            id: 'notification', // Notifications
            route: 'notifications'
          },
          vmm: {
            id: 'vmm',//VM Manager
            route: 'vm-manager'
          },
          analytics: {
            id: 'analytics',// Analytics,
            route: 'analytics'
          },
          afn: {
            id: 'afn',//Application Visibility
            route: 'av'
          }
        },
        //Configuration groups
        config: {
          vlans: {
            id: 'vlans', // VLANs
            route: 'vlan-manager'
          },
          vxlans: {
            id: 'vxlans',//VXLANs
            route: 'vxlans'
          },
          pim: {
            id: 'pim',//IP Multicast
            route: 'pim'
          },
          telnet: {
            id: 'telnet',//CLI Scripting
            route: 'telnet'
          },
          policy: {//PolicyView
            id: 'policy_unifiedPolicy_groups',
            route: 'policy',
            i18nKey: 'index.menu.items.policy'
          },
          sip: {
            id: 'sip',//SIP
            route: 'sip'
          },
          captivePortal: {
            id: 'ag2_captivePortal',//Captive Portal
            route: 'captivePortal',
            i18nKey: 'index.menu.items.captivePortal'
          },
          groups: {
            id: 'policy_unifiedPolicy_groups', //Groups
            route: 'groups',
            i18nKey: 'index.menu.items.groups'
          },
          appLaunch: {
            id: 'appLaunch',//'App. Launch'
            route: 'appLaunch'
          },
          report: {
            id: 'report', //report
            route: 'report'
          },
          resMgmt: {
            id: 'resMgmt',//Resource Manager
            route: 'resourceManager'
          }
        },
        //Unified Access groups
        unifiedAccess: {
          ag2: {
            id: 'ag2_captivePortal', //Unified Profile
            route: 'accessGuardian2.0',
            i18nKey: 'index.menu.items.ag2'
          },
          unifiedPolicy: {
            id: 'policy_unifiedPolicy_groups', //Unified Policy
            route: 'policy/usersAndGroups/unified-policies',
            i18nKey: 'index.menu.items.unifiedPolicy'
          },
          mdns: {
            id: 'mdns',//MultiMedia Services
            route: 'mDNS'
          },
          unifyAccess: {
            id: 'unifyAccess',//Premium Services
            route: 'unifiedAccess'
          }
        },
        //Security
        security: {
          //unugroups: {
          //  id: 'unugroups',//Users & User Groups
          //  route: 'uuGroup'
          //},
          rbac: {
            id: 'unugroups', //RBAC
            route: 'rbac'
          },
          authserver: {
            id: 'authserver',//Authentication Servers
            route: 'authServerMgmt'
          },
          qm: {
            id: 'qm',// Quarantine Manager
            route: 'quarantineManager'
          }
        },
        //Administrator
        admin: {
          controlPanel: {
            id: 'controlPanel',//Control Panel
            route: 'controlPanel'
          },
          prefs: {
            id: 'prefs',//Preferences
            route: 'preferences',
            systemSettings: {
              id: 'systemSettings'
            }
          },
          audit: {
            id: 'audit', //Audit
            route: 'audit'
          },
          //backupRestore: {
          //  id: 'backupRestore',// Backup and Restore
          //  route: 'backupRestore'
          //},
          license: {
            id: 'license', //License
            route: 'license'
          }
        }
      }
    });
})();
