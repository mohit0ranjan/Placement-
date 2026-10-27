# PlacementGuard AI 1.0
Android personal WhatsApp notification assistant. Native Android APK required; Expo Go is unsupported.

## Features
Setup checklist, quick test presets, searchable model list, system health sharing via the Android share sheet. Diagnostics exclude API keys, message contents and contact names.

## Changes
Three-tab interface, explicit input colors, key visibility control; serialized auto-save, atomic durable settings commits and no writes before successful hydration. API key encrypted with Android Keystore AES-GCM; legacy settings preserved and automation paused on migration. Backup disabled to avoid restoring ciphertext without its key.

Network work runs on an IO coroutine queue. Visible tests, 65-second UI timeout, bounded connection/read timeouts, safe error messages, live model catalog, strict response validation, increased token budget and provider-specific reasoning options. Model changes pause automation. No silent model fallback.

Bounded notification queue, persistent duplicate suppression and conversation cooldowns; fresh settings rechecked before sending; stale jobs skipped. Notification permission and listener connection tracked separately. New activity entries exclude contact names, message text and keys; context is memory-only for 30 minutes.

## Build
Node 24 recommended. Run `npm ci`, `npm test`, `npx tsc --noEmit`.
`npx eas-cli build --platform android --profile preview` creates an APK using this existing EAS project's signing credentials. Install the signed update over the existing app. Do not uninstall. Resolve a signing mismatch using the original keystore.

`postinstall` reconstructs local module/shared source/tests from `native-source.json`. Regenerate that manifest after editing reconstructed files. No key or signing credentials are included.

## Setup
Settings → enter a fresh NVIDIA key → load models/select a chat model → Home → test AI. Grant Android Notification Access. Enable automation in TEST mode first. Recent message context goes to NVIDIA for classification. Exclusions match exact notification names/numbers. Groups are ignored by default.

## Release gates: real-device checks required
Automated checks do not establish production readiness. Before live use verify:
1. Save key/model/reply, swipe app away, relaunch; settings persist. Never log or screenshot a key.
2. Grant/revoke notification permission; verify status after returning.
3. Test invalid/revoked keys, retired models, airplane mode, timeouts, malformed/empty responses.
4. Receive positive and negative English/Hindi/Hinglish placement examples from a second WhatsApp account with phone locked. Verify test outcomes and no outbound messages.
5. Check exclusions, groups, repeated notifications, cooldowns and stale queued jobs.
6. Explicitly enable LIVE; verify one configured reply, no duplicates and immediate pause.
7. Repeat after swipe-away, process kill, reboot and battery saving. Android Force Stop prevents services until reopened. Muted/open WhatsApp chats may not produce actionable notifications. Vendor battery restrictions affect delivery.
8. Install a same-signed upgrade over the old APK; verify migration.

Default model: openai/gpt-oss-20b; verify account access with the app. Free endpoint availability changes. No accuracy or background-delivery guarantee is claimed. This build must pass native compilation and real-device gates before production release.
