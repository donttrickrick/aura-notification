@isTest
public class MyNotificationsControllerTest {
	@isTest
    public static void testGetLoginUserNotifications() {
        MyNotificationsController.getLoginUserNotifications();
    }
    
    @isTest
    public static void testGetLoginUserId() {
        MyNotificationsController.getLoginUserId();
    }
    
    @isTest
    public static void testMarkReadNotifications() {
        MyNotificationsController.markReadNotifications(new List<Id>());
    }
}