'use strict';

angular.module('ngnms.ui.fwk.ovDataView.directive')
  .constant('AllOvDataViewIds', {
    url: 'api/tableconfigs',
    environmentVal: {
      TABLE_PRIMARY_KEY: 'field',
      LIST_PRIMARY_KEY: 'key',
      CHECK_BOX_KEY: 'ovDataViewCheckBox',
      OV_DATA_VIEW_PRIMARY_KEY: 'ovDataViewPrimaryKey',
      OV_DATA_VIEW_DEFAULT_ID: 'ovDataViewDefaultId',
      TABLE_VIEW: 'table',
      LIST_VIEW: 'list',
      SORT_ASC: 'ASC',
      SORT_DESC: 'DESC'
    },
    features: {
      CONFIGURATION: {
        VLAN_MANAGER: {
          VLAN: {
            VIEW: {
              VLANS: 'vlan-manager-vlans',
              SPANNING_TREE_SUMMARY: 'vlan-manager-vlans-spanning-tree-summary',
              SPANNING_TREE_BRIDGE: 'vlan-manager-vlans-spanning-tree-bridge',
              SPANNING_TREE_PORT: 'vlan-manager-vlans-spanning-tree-port',
              IP_ROUTER: 'vlan-manager-vlans-ip-router',
              LIST_OF_SWITCHES: 'vlan-manager-vlans-list-of-switches',
              LINK_AGGREGATE_VIEW: 'vlan-manager-vlans-link-aggregate-view',
              PORT_VIEW: 'vlan-manager-vlans-port-view'
            }
          },
          MVRP: {
            SUMMARY:{
              GLOBAL:'vlan-manager-mvrp-summary-view-global',
              PORTS:'vlan-manager-mvrp-summary-view-ports'
            }
          }
        }
      },
      BYOD: {
        CLEARPASS: 'id-ov-setting-byod-clearpass'
      },
      CAPTIVE_PORTAL: {
        CONFIG: 'id-ov-setting-captive-portal-config',
        PROFILE: 'id-ov-setting-captive-portal-profile',
        DOMAIN_POLICY: 'id-ov-setting-captive-portal-domain-policy',
        PROFILE_DOMAIN_POLICY: 'id-ov-setting-captive-portal-profile-domain-policy',
        CUSTOMIZE: 'id-ov-setting-captive-portal-customize'
      },
      DEMO_AREA: {
        OV_DATA_VIEW: 'demoDataView'
      },
      LOCATOR: {
        LOCATE: {
          NETFORWARD: 'locate-netforward-data-view-id',
          ARP: 'arpResult'
        },
        BROWSE: 'browse-data-view-id'

      },
      POLICIES: {
        POLICIES_DATA_VIEW_ID: 'policies-data-view-id',
        PBS_DEVICES_DATA_VIEW_ID: 'pbs-devices-data-view-id',
        PBS_POLICIES_DATA_VIEW_ID: 'pbs-policies-data-view-id',
        PBS_POLICY_LIST_DATA_VIEW_ID: 'pbs-policy-list-data-view-id',
        RESOURCES: 'resource-data-view-id',
        RESOURCES_GROUP: 'resource-group-data-view-id',
        EXPERT_MODE: {
          PENDING: 'expertMode-devicesPending-data-view-id',
          POLICY: 'expertMode-policies-data-view-id'
        },
        USERS_AND_GROUPS: {
          UNIFIED_POLICY: {
            PENDING: 'UnifiedPolicies-devicesPending-data-view-id',
            ID: 'UnifiedPolicies-data-view-id'
          },
          UNIFIED_POLICY_LIST: {
            PENDING: 'UnifiedPoliciesList-devicesPending-data-view-id'
          }

        },
        ONE_TOUCH: {
          ONE_TOUCH_DATA: {
            PENDING: 'OneTouchData-devicesPending-data-view-id'
          },
          ONE_TOUCH_ACL: {
            PENDING: 'OneTouchAcl-devicesPending-data-view-id'
          },
          ONE_TOUCH_VOICE: {
            IP: {
              PENDING: 'OneTouchIp-devicesPending-data-view-id'
            },
            MAC: {
              PENDING: 'OneTouchMac-devicesPending-data-view-id'
            }
          }
        },
        RESOURCE: {
          CREATE_POLICY: {
            PENDING: 'CreatePolicyResource-devicesPending-data-view-id'
          }
        },
        AV: {
          POLICY: 'av-policies-data-view-id'
        }
      },
      DIAGNOSTICS: {
        OV_DATA_VIEW: 'diagnosticsDataView'
      },
      VM_SNOOPING: {
        STATISTICS_OV_DATA_VIEW_ID: 'vm-snooping-statistics'
      },
      AG: {
        AAA_PROFILE: 'id-ov-setting-ag-aaa-profile',
        GLOBAL: {
          SETTING: 'id-ov-setting-global-setting',
          AAA: 'id-ov-setting-global-aaa'
        },
        ACCESS_POLICY: {
          LOCATION: 'id-ov-setting-ag-access-policy-location',
          PERIOD: 'id-ov-setting-ag-access-policy-period'
        },
        VIRTUAL_AP: {
          IEEE_AUTH_PROFILE: 'virtual-ap-ieee-auth-profile',
          MAC_AUTH_PROFILE: 'virtual-ap-mac-auth-profile',
          SSID_PROFILE: 'virtual-ap-ssid-profile',
          VIRTUAL_AP_PROFILE: 'virtual-ap-profile',
          AP_GROUP_PROFILE: 'virtual-ap-ap-group-profile'
        },
        ACCESS_ROLE_PROFILE: 'accessRoleProfile-data-view-id',
        ACCESS_AUTH_PROFILE: 'accessAuthProfile-data-view-id',
        ACCESS_CLASSIFICATION: 'accessClassification-data-view-id',
        PORT_GROUP: 'port-group-data-view-id',
        SUMMARY_VIEW: {
          ACCESS_ROLE_PROFILE: 'summary-accessRoleProfile-data-view-id',
          ACCESS_ROLE_PROFILE_ARUBA: 'aruba-summary-accessRoleProfile-data-view-id',
          ACCESS_ROLE_PROFILE_IAP: 'iap-summary-accessRoleProfile-data-view-id',
          ACCESS_AUTH_PROFILE: 'summary-accessAuthProfile-data-view-id',
          ACCESS_AUTH_PROFILE_ARUBA: 'aruba-summary-accessAuthProfile-data-view-id',
          ACCESS_AUTH_PROFILE_IAP: 'iap-summary-accessAuthProfile-data-view-id',
          ACCESS_CLASSIFICATION: 'summary-accessClassification-data-view-id',
          ACCESS_CLASSIFICATION_ARUBA: 'aruba-summary-accessClassification-data-view-id',
          ACCESS_CLASSIFICATION_IAP: 'iap-summary-accessClassification-data-view-id',
          AAA_PROFILE: 'summary-id-ov-setting-ag-aaa-profile',
          AAA_PROFILE_ARUBA: 'aruba-summary-id-ov-setting-ag-aaa-profile',
          AAA_PROFILE_IAP: 'iap-summary-id-ov-setting-ag-aaa-profile',
          AAA_SERVER_GROUP: 'summary-id-ov-setting-ag-aaa-server-group',
          AAA_SERVER_GROUP_ARUBA: ' aruba-summary-id-ov-setting-ag-aaa-server-group',
          AAA_SERVER_GROUP_IAP: 'iap-summary-id-ov-setting-ag-aaa-server-group',
          AG_GLOBAL_CONFIG: 'summary-AG_GLOBAL_CONFIG-data-view-id',
          UNP: 'summary-unp-data-view-id',
          PORT_GROUP: 'summary-port-group-data-view-id',
          AP_GROUP: 'summary-ap-group-data-view-id',
          VIRTUAL_AP_: 'summary-ap-virtual-ap-view-id',
          VIRTUAL_AP_PROFILE: 'summary-ap-virtual-ap-profile-view-id',
          SSID: 'summary-ap-ssid-view-id',
          SSID_ARUBA: 'summary-aruba-ssid-view-id',
          MAC_AUTH_PROFILE: 'summary-ap-mac-auth-profile-view-id',
          DOT1X_AUTH_PROFILE: 'summary-dot1x-auth-profile-view-id',
          ACCESS_POLICY: {
            LOCATION: 'summary-id-location',
            PERIOD: 'summary-id-period'
          }
        }
      },
      AUTH_SERVER: {
        LDAP: 'ldap-data-view-id',
        RADIUS: 'radius-data-view-id',
        ACE: 'ace-data-view-id',
        TACACS: 'tacacs-data-view-id'
      },
      MDNS: 'mdns-slick-grid-id',
      ANALYTICS: {
        ANOMALIES: 'analytics-anomalies-detection',
        SUMMARY: 'analytics-summary-view'
      },
      SCHEDULER: {
        HISTORY: 'cp-scheduler-jobs-dataview',
        JOBS: 'cp-scheduler-history-dataview'
      },
      OPENSTACK: {
        DOMAIN: 'openstack-domain-list-dataview'
      },
      RESOURCE_MANAGER: {
        BACKUP_DATA_VIEW_ID: 'rm-backup-data-view-id',
        BACKUP_DETAIL_DATA_VIEW_ID: 'rm-backup-detail-data-view-id',
        SWITCH_FILE_SET_DATA_VIEW_ID: 'rm-switch-file-set-data-view-id',
        SWITCH_FILE_SET_DETAIL_DATA_VIEW_ID: 'rm-switch-file-set-detail-data-view-id',
        AUTO_CONFIGURATION: {
          INSTRUCTION_FILES: 'rm-auto-configuration',
          INSTRUCTION_FILES_MASTER: 'rm-master-auto-configuration'
        },
        UPGRADE_IMAGE: {
          FILE_SETS: 'rm-upgrade-image-file-set',
          FILE_SETS_MASTER: 'rm-master-upgrade-image-file-set',
          FILE_DETAIL: 'rm-upgrade-image-file-detail',
          FILE_DETAIL_MASTER: 'rm-master-upgrade-image-file-detail',
          SELECTED_FILE_TO_INSTALL: 'rm-upgrade-image-selected-file-to-install',
          SELECTED_FILE_TO_INSTALL_MASTER: 'rm-master-upgrade-image-selected-file-to-install'
        },
        RESTORE: {
          BACKUP_FILE: 'rm-restore-backup-file'
        },
        INVENTORY: 'id-dataview-inventory',
        SUMMARY_BACKUP: 'rm-summary-backup'
      },
      TELNET: {
        SCRIPT: 'telnet-script-dataview',
        LOG: 'telnet-log-list-data-view'
      },
      FAR_IP: 'far-ip-dataview',
      SIP: {
        SIP_PROFILE: 'sip-profile-dtv',
        ONE_TOUCH_PROFILE: 'sip-one-touch-profile-dtv',
        ENDED_CALL_AGGREGATED: {
          analytic: 'sip-ended-call-aggregated-analytic',
          sip: 'sip-ended-call-aggregated-of-sip-app'
        },
        ENDED_CALL_DETAILED: {
          analytic: 'sip-ended-call-detailed-analytic',
          sip: 'sip-ended-call-detailed-of-sip-app'
        },
        ACTIVE_CALL_AGGREGATED: {
          analytic: 'sip-active-call-aggregated-analytic',
          sip: 'sip-active-call-aggregated-of-sip-app'
        },
        ACTIVE_CALL_DETAILED: {
          analytic: 'sip-active-call-detailed-of-analytic',
          sip: 'sip-active-call-detailed-of-sip-app'
        },
        GLOBAL_PARAM_PROFILE: 'sip-global-param-profile',
        SOS_PROFILE: 'sip-sos-profile',
        THRESHOLD_PROFILE: 'sip-threshold-profile',
        TRUSTED_SERVERS_PROFILE: 'sip-trusted-server-profile',
        TCP_PORT_PROFILE: 'sip-tcp-port-profile-dtv',
        UDP_PORT_PROFILE: 'sip-udp-port-profile-dtv',
        SIP_DEVICE_VIEW: {
          SIP_PROFILE: 'sip-device-view-sip-profile-dtv',
          GLOBAL_PARAM_PROFILE: 'sip-device-view-global-param-profile-dtv',
          SOS_PROFILE: 'sip-device-view-sos-profile-dtv',
          THRESHOLD_PROFILE: 'sip-device-view-threshold-profile-dtv',
          TRUSTED_SERVERS_PROFILE: 'sip-device-view-trusted-server-profile-dtv',
          TCP_PORT_PROFILE: 'sip-device-view-tcp-port-profile-dtv',
          UDP_PORT_PROFILE: 'sip-device-view-udp-port-profile-dtv',
          SIP_STATISTICS: 'sip-device-view-sip-statistics-dtv',
          REGISTERED_CLIENT: 'sip-device-view-registered-client-dtv'
        }
      },
      AUDIT: {
        LOG: 'audit-log-dataview'
      },
      DISCOVERY: {
        DISCOVERED_DEVICES: 'discovered-devices-data-view',
        PROFILE_LIST: 'discovery-profile-list-data-view',
        MIBSET_LIST: 'mibset-list-data-view',
        MANUAL_LINK: 'discovery-manual-link',
        INVENTORY: 'discovery-inventory-data-view'
      },
      NOTIFICATIONS: {
        TRAP_DISPLAY: 'notifications-trap-display-view',
        TRAP_DEFINITION: 'notifications-trap-definition-view',
        TRAP_RESPONDER: 'notifications-trap-responder-view'
      },
      ZTP: {
        ZTP_PROFILE: 'ztp-ztp-profile-data-view',
        RCL_PROFILE: 'ztp-rcl-profile-data-view',
        RCL_FILE: 'ztp-rcl-file-data-view'
      },
      EC_MANAGEMENT: {
        EC_LIST: 'ec-management-list'
      },
      AV: {
        SUMMARY_VIEW: 'av-summary-view-devices-list'
      },
      PORT_VIEW: {
        PORTS_LIST: 'ports-list-data-view'
      },
      CONTROL_PANEL: {
        SESSION_MANAGEMENT: 'cp-session-management'
      },
      VLAN_MANAGER: {
        IP_INTERFACE: 'vlan-manager-ip-interface-view'
      },
      AGV1: {
        AG_WORKFLOW: 'agv1-workflow-data-view',
        AUTH_SERVER_PROFILE: 'agv1-auth-server-profile-data-view',
        UNP: {
          BRIDGING_PROFILE: 'agv1-bridging-profile-data-view',
          SPB_PROFILE: 'agv1-spb-profile-data-view'
        },
        CUSTOMER_DOMAIN: 'agv1-customer-domain-data-view',
        CLASSIFICATION: 'agv1-classification-data-view',
        PORT_POLICIES: {
          DEVICE_AUTHENTICATION: 'agv1-device-authentication-data-view'
        }
      },
      RBAC: {
        ROLE_LIST: 'role-list',
        USER_LIST: 'user-list',
        GROUP_LIST: 'group-list'
      },
      VM_MANAGER: {
        VM_DEVICES_LIST: 'vm-devices-list-data-view',
        VM_LOCATOR: {
          HOST_NETWORK: 'vm-locator-host-network',
          VM_NETWORK: 'vm-locator-vm-network'
        },
        EXCLUDE_VLAN: 'vm-manager-exclude-vlan',
        VM_VLAN_NOTIFICATION: 'vm-manager-vlan-notification',
        SETTING: {
          VM_SERVER_CONNECTION: 'vm-server-connection-data-view'
        }
      },
      BACKUP_RESTORE: {
        BACKUP_FILES: 'backup-restore-backup-file-list'
      },
      QUARANTINE_MANAGER: {
        CANDIDATES: 'quarantine-candidates',
        BANNED: 'quarantine-banned',
        NEVER_BANNED: 'quarantine-never-banned',
        DISABLED_PORTS: 'quarantine-disabled-ports',
        RULES: 'quarantine-rules',
        CONFIGURATION: 'quarantine-configuration',
        CONFIGURATION_SUBNET: 'quarantine-configuration-subnet',
        RESPONDERS: 'quarantine-responders',
        PROFILE: 'quarantine-profile',
        VIEW: {
          MONITORING_GROUPS: 'quarantine-view-monitoring-groups',
          PORT_RANGES: 'quarantine-view-port-ranges',
          STATISTICS_PORT: 'quarantine-view-statistics-port',
          STATISTICS_ANOMALY_TRAFFIC: 'quarantine-view-statistics-anomaly-tracffic',
          STATISTICS_ANOMALY_SUMMARY: 'quarantine-view-statistics-anomaly-summary'
        }
      },
      UNIFIED_PROFILE: {
        ACCESS_AUTH_PROFILE: 'up-access-auth-profile-template-list-view-data-view',
        ACCESS_ROLE_PROFILE: 'up-access-role-profile-template-list-view-data-view',
        ACCESS_AUTH_PROFILE_DEVICE_CONFIG: 'up-access-auth-profile-device-list-view-data-view',
        CLASSIFICATION: 'unified-profile-classification-template-list-view-data-view',
        SPB_PROFILE: 'unified-profile-spb-profile-template-list-view-data-view',
        CUSTOMER_DOMAIN: 'unified-profile-customer-domain-template-list-view-data-view',
        CLASSIFICATION_DEVICE: 'unified-profile-classification-device-list-view-data-view'
      }
    }
  });
