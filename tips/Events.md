`const { Events } = require('discord.js');` を使うと、`Events` オブジェクトには Discord.js で定義されたイベント名が列挙子として含まれています。これを使用することで、イベント名をコード上で誤記しにくくし、IDE の補完機能を活用できます。

### `Events` で使用できるイベント一覧

以下は `discord.js` の `Events` から取得できる主なイベントの一覧です：

- **クライアントのライフサイクルイベント**
  - `Events.ClientReady`
  - `Events.ShardDisconnect`
  - `Events.ShardError`
  - `Events.ShardReady`
  - `Events.ShardReconnecting`
  - `Events.ShardResume`
  - `Events.Invalidated`

- **メッセージ関連のイベント**
  - `Events.MessageCreate`
  - `Events.MessageDelete`
  - `Events.MessageUpdate`
  - `Events.MessageReactionAdd`
  - `Events.MessageReactionRemove`
  - `Events.MessageReactionRemoveAll`

- **ギルド関連のイベント**
  - `Events.GuildCreate`
  - `Events.GuildDelete`
  - `Events.GuildUpdate`
  - `Events.GuildBanAdd`
  - `Events.GuildBanRemove`

- **チャンネル関連のイベント**
  - `Events.ChannelCreate`
  - `Events.ChannelDelete`
  - `Events.ChannelUpdate`
  - `Events.ChannelPinsUpdate`

- **メンバー・ロール関連のイベント**
  - `Events.GuildMemberAdd`
  - `Events.GuildMemberRemove`
  - `Events.GuildMemberUpdate`
  - `Events.RoleCreate`
  - `Events.RoleDelete`
  - `Events.RoleUpdate`

- **ボイス関連のイベント**
  - `Events.VoiceStateUpdate`

- **スラッシュコマンド・インタラクション関連のイベント**
  - `Events.InteractionCreate`

- **エラーハンドリング関連のイベント**
  - `Events.Error`
  - `Events.Warn`
  - `Events.Debug`

- **その他のイベント**
  - `Events.TypingStart`
  - `Events.TypingStop`
  - `Events.PresenceUpdate`

これらのイベント名を `Events` 列挙子を使って記述することで、イベント名の一貫性を保つことができます。