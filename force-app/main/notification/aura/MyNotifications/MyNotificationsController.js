({
    // Sets an empApi error handler on component initialization
    onInit : function(component, event, helper) {
        const action1 = component.get('c.getLoginUserId');
        action1.setCallback(this, function(response) {
            component.set('v.loginUserId', response.getReturnValue());
        });
        $A.enqueueAction(action1);
        
        var utilityBarApi = component.find('utilitybar');
        utilityBarApi.getAllUtilityInfo().then(function (response) {
            if (typeof response !== 'undefined') {
                
                                
                utilityBarApi.onUtilityClick({ 
                    eventHandler : $A.getCallback((result) => {
                        if(!result.panelVisible) {
                            helper.readAllNotifications(component, helper);
                        }
                    })
                });
                
                const action = component.get('c.getLoginUserNotifications');
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === 'SUCCESS') {
                        let notificationList = response.getReturnValue();
                        let notificationTypeSet = new Set();
                        for(let oneNotification of notificationList) {
                            oneNotification.CreatedDateObject = new Date(oneNotification.CreatedDate);
                            notificationTypeSet.add(oneNotification.Type__c);
                        }
                        let notificationTypeList = [];
                        for(let oneType of notificationTypeSet) {
                            notificationTypeList.push({ label : oneType });
                        }
                        component.set('v.notificationTypeList', notificationTypeList);
                        let groupBy = function(xs, key) {
                            return xs.reduce(function(rv, x) {
                              (rv[x[key]] = rv[x[key]] || []).push(x);
                              return rv;
                            }, {});
                        };
                        let notificationGroupList = groupBy(notificationList, 'Related_Record_Id__c');
                        let updateGroupList = [];
                        for(let relatedRecordId in notificationGroupList) {
                            let theNotification = notificationList.find((e) => e.Related_Record_Id__c === relatedRecordId);
                            theNotification.subNotificationList = [];
                            for(let oneSub of notificationGroupList[relatedRecordId]) {
                                if(oneSub.Id !== theNotification.Id) {
                                    theNotification.subNotificationList.push(oneSub);
                                }
                            }
                            updateGroupList.push(theNotification);
                        }
                        component.set('v.notificationList', updateGroupList);
                        helper.setUnreadSize(component);
                    } else if (state === 'INCOMPLETE') {
                    } else if (state === 'ERROR') {
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                
                            }
                        } else {
                            
                        }
                    }
                });
                $A.enqueueAction(action);
            } 
        });
        
        
        
        
        // Get the empApi component
        const empApi = component.find('empApi');
        // Uncomment below line to enable debug logging (optional)
        // empApi.setDebugFlag(true);
        // Register error listener and pass in the error handler function
        empApi.onError($A.getCallback(error => {
            // Error can be any type of error (subscribe, unsubscribe...)
            console.error('EMP API error: ', error);
        }));
        // Replay option to get new events
        const replayId = -1;

        // Subscribe to an event
        empApi.subscribe('/data/Notification__ChangeEvent', replayId, $A.getCallback(eventReceived => {
            // Process event (this is called each time we receive an event)

            if(!eventReceived.data.payload || !eventReceived.data.payload.CreatedDate || !eventReceived.data.payload.ChangeEventHeader.recordIds || eventReceived.data.payload.ChangeEventHeader.recordIds.length < 1) {
            	return;
        	}
            let inboundNotification = eventReceived.data.payload;
            let loginUserId = component.get('v.loginUserId');
            if(loginUserId === inboundNotification.Notified_User__c) {
                inboundNotification.Id = inboundNotification.ChangeEventHeader.recordIds[0];
                inboundNotification.CreatedDateObject = new Date(inboundNotification.CreatedDate);
                delete inboundNotification.ChangeEventHeader;
                let notificationList = component.get('v.notificationList');
                
                let matchedIndex = null;
                
                for(let i = 0; i < notificationList.length; i++) {
                    if(loginUserId !== null && inboundNotification.Related_Record_Id__c !== null
                    && loginUserId === inboundNotification.Notified_User__c && inboundNotification.Related_Record_Id__c === notificationList[i].Related_Record_Id__c) {
                        matchedIndex = i;
                        break;
                    } 
                }
            
                if(matchedIndex !== null) {
                    let oneNotification = notificationList[matchedIndex];
                    let subNotificationList = oneNotification.subNotificationList;
                    oneNotification.subNotificationList = [];
                    subNotificationList.unshift(oneNotification);
                    inboundNotification.subNotificationList = subNotificationList;
                    notificationList.splice(matchedIndex, 1);
                    notificationList.unshift(inboundNotification);
                } else {
                    inboundNotification.subNotificationList = [];
                    notificationList.unshift(inboundNotification);
                } 
                component.set('v.notificationList', notificationList);
                helper.setUnreadSize(component);
            }
            
        }))
        .then(subscription => {
            // Confirm that we have subscribed to the event channel.
            // We haven't received an event yet.
            console.log('Subscribed to channel ', subscription.channel);
            // Save subscription to unsubscribe later
            component.set('v.subscription', subscription);
        });
        
    },
	handleClickMainSection : function(component, event, helper) {
        const notificationList = component.get('v.notificationList');
    	const index = event.currentTarget.dataset.mainIndex;
        notificationList[index].Is_Read__c = true;
        let readIdList = [];
        readIdList.push(notificationList[index].Id);
        if(notificationList[index].subNotificationList && notificationList[index].subNotificationList.length > 0) {
            notificationList[index].isOpen = notificationList[index].isOpen ? false : true;
            for(let oneSubNotification of notificationList[index].subNotificationList) {
                oneSubNotification.Is_Read__c = true;
                readIdList.push(oneSubNotification.Id);
            }
            component.set('v.notificationList', notificationList);
            $A.get("e.force:navigateToSObject") && $A.get("e.force:navigateToSObject").setParams({
              "recordId": notificationList[index].Related_Record_Id__c
            }).fire();
        } else {
            $A.get("e.force:navigateToSObject") && $A.get("e.force:navigateToSObject").setParams({
              "recordId": notificationList[index].Related_Record_Id__c
            }).fire();
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
    },
    handleClickSubSection : function(component, event, helper) {
        const notificationList = component.get('v.notificationList');
    	const index = event.currentTarget.dataset.mainIndex;
        const subIndex = event.currentTarget.dataset.subIndex;
        
        $A.get("e.force:navigateToSObject") && $A.get("e.force:navigateToSObject").setParams({
            "recordId": notificationList[index].subNotificationList[subIndex].Related_Record_Id__c
        }).fire();
        
    },
    // Invokes the subscribe method on the empApi component
    subscribe : function(component, event, helper) {
        
    },

    // Invokes the unsubscribe method on the empApi component
    unsubscribe : function(component, event, helper) {
        // Get the empApi component
        const empApi = component.find('empApi');
        // Get the subscription that we saved when subscribing
        const subscription = component.get('v.subscription');

        // Unsubscribe from event
        empApi.unsubscribe(subscription, $A.getCallback(unsubscribed => {
          // Confirm that we have unsubscribed from the event channel
          console.log('Unsubscribed from channel '+ unsubscribed.subscription);
          component.set('v.subscription', null);
        }));
    }
})