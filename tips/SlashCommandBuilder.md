`SlashCommandBuilder` は、Discord.js を使ってスラッシュコマンドを作成するためのビルダーであり、さまざまなメソッドを使ってコマンドやそのオプションを設定できます。ここでは、`SlashCommandBuilder` で使用できるメソッドをすべて挙げます。

### `SlashCommandBuilder` のメソッド一覧

1. **`setName(name: string)`**
   - コマンドの名前を設定します。
   - 例: `.setName('greet')`

2. **`setDescription(description: string)`**
   - コマンドの説明を設定します。必須です。
   - 例: `.setDescription('Greets the user')`

3. **`setDefaultMemberPermissions(permissions: PermissionResolvable | null)`**
   - コマンドのデフォルトの権限を設定します。特定の権限を持つメンバーのみがコマンドを使用できるようにします。
   - 例: `.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)`

4. **`setDMPermission(dmPermission: boolean)`**
   - コマンドがDM（ダイレクトメッセージ）で使用可能かどうかを設定します。
   - 例: `.setDMPermission(true)`

5. **`setNSFW(nsfw: boolean)`**
   - コマンドがNSFWチャンネルでのみ使用可能かを設定します。
   - 例: `.setNSFW(true)`

6. **`addSubcommand(callback: (subcommand: SlashCommandSubcommandBuilder) => void)`**
   - サブコマンドを追加します。`SlashCommandSubcommandBuilder` を使用して詳細を設定します。
   - 例:
     ```javascript
     .addSubcommand(subcommand =>
       subcommand
         .setName('info')
         .setDescription('Get info about the bot')
     )
     ```

7. **`addSubcommandGroup(callback: (subcommandGroup: SlashCommandSubcommandGroupBuilder) => void)`**
   - サブコマンドグループを追加します。サブコマンドをさらにグループ化することができます。
   - 例:
     ```javascript
     .addSubcommandGroup(group =>
       group
         .setName('admin')
         .setDescription('Admin commands')
         .addSubcommand(subcommand =>
           subcommand
             .setName('ban')
             .setDescription('Ban a user')
         )
     )
     ```

8. **`addStringOption(callback: (option: SlashCommandStringOption) => void)`**
   - 文字列型のオプションを追加します。
   - 例:
     ```javascript
     .addStringOption(option =>
       option
         .setName('input')
         .setDescription('The input to process')
         .setRequired(true)
     )
     ```

9. **`addIntegerOption(callback: (option: SlashCommandIntegerOption) => void)`**
   - 整数型のオプションを追加します。
   - 例:
     ```javascript
     .addIntegerOption(option =>
       option
         .setName('age')
         .setDescription('Your age')
         .setRequired(true)
     )
     ```

10. **`addBooleanOption(callback: (option: SlashCommandBooleanOption) => void)`**
    - 真偽値（`true` または `false`）のオプションを追加します。
    - 例:
      ```javascript
      .addBooleanOption(option =>
        option
          .setName('confirm')
          .setDescription('Do you confirm?')
      )
      ```

11. **`addUserOption(callback: (option: SlashCommandUserOption) => void)`**
    - ユーザー型のオプションを追加します。ユーザーを指定するコマンドに使われます。
    - 例:
      ```javascript
      .addUserOption(option =>
        option
          .setName('target')
          .setDescription('Select a user')
      )
      ```

12. **`addChannelOption(callback: (option: SlashCommandChannelOption) => void)`**
    - チャンネル型のオプションを追加します。
    - 例:
      ```javascript
      .addChannelOption(option =>
        option
          .setName('channel')
          .setDescription('Select a channel')
      )
      ```

13. **`addRoleOption(callback: (option: SlashCommandRoleOption) => void)`**
    - ロール型のオプションを追加します。
    - 例:
      ```javascript
      .addRoleOption(option =>
        option
          .setName('role')
          .setDescription('Select a role')
      )
      ```

14. **`addMentionableOption(callback: (option: SlashCommandMentionableOption) => void)`**
    - ユーザーやロールを含む「メンション可能」なオプションを追加します。
    - 例:
      ```javascript
      .addMentionableOption(option =>
        option
          .setName('mention')
          .setDescription('Select a user or role')
      )
      ```

15. **`addNumberOption(callback: (option: SlashCommandNumberOption) => void)`**
    - 数値型のオプションを追加します（整数だけでなく小数もサポート）。
    - 例:
      ```javascript
      .addNumberOption(option =>
        option
          .setName('quantity')
          .setDescription('Enter a number')
      )
      ```

16. **`addAttachmentOption(callback: (option: SlashCommandAttachmentOption) => void)`**
    - 添付ファイルを指定するオプションを追加します。
    - 例:
      ```javascript
      .addAttachmentOption(option =>
        option
          .setName('file')
          .setDescription('Upload a file')
      )
      ```

---

### まとめ

`SlashCommandBuilder` は、スラッシュコマンドに関するあらゆる設定を行うためのビルダーであり、メソッドを使ってコマンド名や説明、必要なオプションや権限を簡単に設定できます。これにより、強力で柔軟なスラッシュコマンドを作成することが可能です。