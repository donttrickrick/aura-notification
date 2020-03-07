# Aura Notification

This repo implements enhanced in-app notifications.

## How to start

Pull the repo on your local machine, then run these commands with SFDX:

$ `sfdx force:org:create -f config/project-scratch-def.json --setalias aura-notifications --durationdays 1 --setdefaultusername --json --loglevel fatal`

$ `sfdx force:source:push --json --loglevel fatal --forceoverwrite`

$ `sfdx force:org:open -p "/lightning/o/Account/list"`

## Folder Structure

```
force-app
└── main
    ├── default
    │   ├── appMenus
    │   │   └── AppSwitcher.appMenu-meta.xml
    │   ├── applications
    │   │   └── Sales_Console.app-meta.xml
    │   ├── flexipages
    │   │   └── Sales_Console_UtilityBar.flexipage-meta.xml
    │   ├── flows
    │   │   └── When_Account_Changed.flow-meta.xml
    │   ├── profiles
    │   │   └── Admin.profile-meta.xml
    │   └── workflows
    │       └── Account.workflow-meta.xml
    └── notification
        ├── aura
        │   └── MyNotifications
        │       ├── MyNotifications.cmp
        │       ├── MyNotifications.cmp-meta.xml
        │       ├── MyNotifications.css
        │       ├── MyNotificationsController.js
        │       └── MyNotificationsHelper.js
        ├── classes
        │   ├── MyNotificationsController.cls
        │   ├── MyNotificationsController.cls-meta.xml
        │   ├── MyNotificationsControllerTest.cls
        │   └── MyNotificationsControllerTest.cls-meta.xml
        ├── objects
        │   └── Notification__c
        │       ├── Notification__c.object-meta.xml
        │       └── fields
        │           ├── Body__c.field-meta.xml
        │           ├── Icon_Name__c.field-meta.xml
        │           ├── Is_Read__c.field-meta.xml
        │           ├── Notified_User__c.field-meta.xml
        │           ├── Related_Record_Id__c.field-meta.xml
        │           ├── Title__c.field-meta.xml
        │           └── Type__c.field-meta.xml
        └── platformEventChannelMembers
            └── ChangeEvents_Notification_ChangeEvent.platformEventChannelMember-meta.xml
```
