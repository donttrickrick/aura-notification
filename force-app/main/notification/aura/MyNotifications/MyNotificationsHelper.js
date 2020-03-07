({
    setUnreadSize : function(component) {
        const notificationList = component.get('v.notificationList');
        const notificationTypeList = component.get('v.notificationTypeList');
        
        for(let oneNotification of notificationList) {
            let unreadSize = 0;
            if(!oneNotification.Is_Read__c) {
                unreadSize++;
            }
            for(let oneSub of oneNotification.subNotificationList) {
                if(!oneSub.Is_Read__c) {
                    unreadSize++;
                }
            }
            oneNotification.unreadSize = unreadSize;
        }
        
        for(let oneType of notificationTypeList) {
            oneType.unreadSize = 0;
            for(let oneNotification of notificationList) {
                if(oneType.label === oneNotification.Type__c) {
                    oneType.unreadSize = oneType.unreadSize + oneNotification.unreadSize;
                }
            }
        }
        
        let totalUnreadSize = 0;
        for(let oneType of notificationTypeList) {
            totalUnreadSize = oneType.unreadSize + totalUnreadSize;
        }
        
        component.set('v.notificationTypeList', notificationTypeList);
        component.set('v.notificationList', notificationList);
        component.set('v.totalUnreadSize', totalUnreadSize);
        
        var utilityBarApi = component.find('utilitybar');
        if(totalUnreadSize && utilityBarApi) {
            utilityBarApi.setUtilityLabel({ label : 'Notifications ' + '(' + totalUnreadSize + ')'});
            utilityBarApi.setPanelHeaderLabel ({ label : 'Notifications ' + '(' + totalUnreadSize + ')'});
            utilityBarApi.setUtilityHighlighted({ highlighted : true });
        } else if(!totalUnreadSize && utilityBarApi) {
            utilityBarApi.setUtilityLabel({ label : 'Notifications' });
            utilityBarApi.setPanelHeaderLabel ({ label : 'Notifications' });
            utilityBarApi.setUtilityHighlighted({ highlighted : false });
        }
    },
    readAllNotifications : function(component, helper) {
        debugger;
        if(component.get('v.totalUnreadSize')) {
            const notificationList = component.get('v.notificationList');
            let readIdList = [];
            for(let oneNotification of notificationList) {
                if(!oneNotification.Is_Read__c) {
                    oneNotification.Is_Read__c = true;
                    readIdList.push(oneNotification.Id);
                }
                for(let oneSub of oneNotification.subNotificationList) {
                    if(!oneSub.Is_Read__c) {            
                        oneSub.Is_Read__c = true;
                        readIdList.push(oneSub.Id);
                    }
                }
            }
            if(readIdList.length > 0) {
                const action = component.get('c.markReadNotifications');
                action.setParams({
                    'notificationIdList' : readIdList
                });
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === 'SUCCESS') {
                        helper.setUnreadSize(component);
                    } else {
                        
                    }
                });
                $A.enqueueAction(action);
            }
        }
    }
})