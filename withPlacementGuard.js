const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withPlacementGuard(config) {
  return withAndroidManifest(config, config => {
    const app = config.modResults.manifest.application?.[0];
    if (!app) return config;
    app.service = app.service || [];
    const name = 'expo.modules.placementguard.WhatsAppNotificationListener';
    if (!app.service.some(s => s.$?.['android:name'] === name)) {
      app.service.push({
        $: {
          'android:name': name,
          'android:label': 'PlacementGuard WhatsApp Listener',
          'android:permission': 'android.permission.BIND_NOTIFICATION_LISTENER_SERVICE',
          'android:exported': 'true'
        },
        'intent-filter': [{ action: [{ $: { 'android:name': 'android.service.notification.NotificationListenerService' } }] }]
      });
    }
    return config;
  });
};
