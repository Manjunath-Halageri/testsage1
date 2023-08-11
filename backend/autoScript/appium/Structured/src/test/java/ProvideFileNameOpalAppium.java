
import org.testng.annotations.Test;

import reusablePackage.AllActions;

import reusablePackage.Username;

public class ProvideFileNameOpalAppium extends AllActions {
	AllActions actionObject = new AllActions();
	@Test
	public void run() throws InterruptedException
	{	
      // actionObject.sendKey111("Xpath,bnmn");
		actionObject.launchApplication("Abilash", "Android", "A97I2V17GA231986", "6.0", "com.meehappy.android", "com.meehappy.android.activities.LoginActivity", "127.0.0.1", "4723");
		new Username().userName("com.meehappy.android:id/username", "reddyabilash919@gmail.com");
	}
}


import org.testng.annotations.Test;

import reusablePackage.AllActions;

import reusablePackage.Username;

public class ProvideFileNameOpalAppium extends AllActions {
	AllActions actionObject = new AllActions();
	@Test
	public void run() throws InterruptedException
	{	
		new Username().userName("com.meehappy.android:id/username", "reddyabilash919@gmail.com");
		actionObject.sendKey111("Xpath","nm");
	}
}