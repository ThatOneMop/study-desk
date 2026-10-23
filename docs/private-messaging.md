# Private messaging

Service: https://study-desk-messages.work-7072.chatgpt.site
Sites project: appgprj_6adb142725388191a4f0cc9e5e3262e8
Source commit: ec46755ab2d0eaaa379e89a69786a139f8661d6e (Sites source repository).

Deployed 23 October 2026 as owner-only preview. Visitor access needs explicit authorization before changing the Sites audience. The public community page labels this state.

ChatGPT sign-in; nickname and friend code; recipient acceptance; participant-only message reads/writes; blocks; paginated history; duplicate-send protection; message and request limits. A separate origin isolates messages from game scripts. No messages, account emails or credentials belong in this repository. Public GitHub issues are not used for private messages.

Build and SQLite-backed API authorization tests passed, including third-account read/write denial, acceptance rules, blocks, invalid origins, and replay deduplication. Browser QA was blocked by the environment; live multi-account verification remains outstanding. Not end-to-end encrypted. Service operators can access stored data. Refresh retrieves replies.
