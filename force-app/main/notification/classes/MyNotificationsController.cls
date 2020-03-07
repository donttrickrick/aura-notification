public with sharing class MyNotificationsController {
    @AuraEnabled
    public static List<Notification__c> getLoginUserNotifications() {
        return [SELECT Id, Title__c, Body__c, Type__c, CreatedDate, Related_Record_Id__c, Icon_Name__c, Is_Read__c FROM Notification__c WHERE Notified_User__c = :UserInfo.getUserId() ORDER BY CreatedDate DESC];
    } 
    
    @AuraEnabled
    public static Id getLoginUserId() {
        return UserInfo.getUserId();
    }
    
    @AuraEnabled
    public static Boolean markReadNotifications(List<Id> notificationIdList) {
        Boolean ret = false;
        List<Notification__c> notificationList = new List<Notification__c>();
        for(Id oneNtfId : notificationIdList) {
            notificationList.add(new Notification__c(Id = oneNtfId, Is_Read__c = true));
        }
        update notificationList;
        ret = true;
        return ret;
    } 
}