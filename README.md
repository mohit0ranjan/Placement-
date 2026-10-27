# PlacementGuard AI — Expo/EAS edition

Android-only personal WhatsApp placement auto-responder.

## Why it needs an EAS build
The app contains a Kotlin `NotificationListenerService` to read WhatsApp notifications and use Android notification quick-reply. Expo Go cannot load custom native code. Use an EAS preview/development build.

## Phone-only EAS build
1. Create/login to an Expo account at https://expo.dev.
2. Put this project in GitHub or another Git source that EAS can access.
3. In a cloud shell / GitHub Action / terminal environment run `npx eas-cli@latest init` once to replace the placeholder EAS project ID.
4. Run `npx eas-cli@latest build --platform android --profile preview`.
5. EAS outputs an installable APK URL.
6. Install APK, open PlacementGuard AI, grant Notification Access, keep Test Mode on, and use **Test NVIDIA NIM**.
7. Send placement and personal WhatsApp test messages from another number. Only after verifying logs, turn Test Mode off.

## Model
`meta/llama-3.3-70b-instruct`, temperature 0.2, top_p 0.7, threshold 0.85.

## API key and privacy
No API key is included in the source or APK. Enter your NVIDIA NIM key in the app after installation. Notification message text and sender names are sent to NVIDIA for classification. Test mode classifies messages but never sends replies. Notification access must be granted explicitly on the phone. Keep test mode on until placement and personal messages have been checked on your device.
