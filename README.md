# <img src='Workflow/icon.png' width='45' align='center' alt='icon'> 1Password Alfred Workflow

Search and open 1Password items

<a href='https://github.com/alfredapp/1password-workflow/releases/latest/download/1Password.alfredworkflow'>⤓ Download Workflow</a>

## About

<!-- BEGIN ABOUT -->

This Workflow is for 1Password 8. For older versions, see Alfred Preferences → Features → 1Password.

Use `1p` to interact with your 1Password items.

On first run you’ll need to set up your account with 1Password’s official command-line tool. Your terminal will open and guide you through the process.

![](https://user-images.githubusercontent.com/1699443/164914491-1c1b4da5-a0b1-4cdf-9881-a62a8e5a7162.png)

From then on, `1p` will show your items. ↵ opens the website in your browser (and fills the credentials if you have the browser extension installed) while ⌘↵ opens the item in 1Password.

![](https://user-images.githubusercontent.com/1699443/166268538-3706cc02-dd9e-4a05-8b4f-4eadca4cf692.png)

The Workflow will attempt to detect when you update items in 1Password and present you with the option to refresh them. You can disable this behaviour by flipping the `auto_refresh` Workflow Environment Variable to `0`. Set `logins_only` to `1` if you want to hide other item types.

You can control the items and their order that are included in the subtitle of logins by configuring `subtitle_items`. Available subtitle items:

* `username`: The username of a login.
* `url`: The URL that 1password uses for this login.
* `vault`: The vault the login is contained within.
* `opAccount`: The 1Password account that this login belongs to.

Uncommon but useful actions, such as toggling vaults, can be accessed via `:1pextras`.

![](https://user-images.githubusercontent.com/1699443/165388195-40975de6-6fe4-4607-96d9-ce96d835ac73.png)

![](https://user-images.githubusercontent.com/1699443/166268572-bc504873-5ff0-43a1-b76c-90bf380d8633.png)

`!gddiagnostic` inspects the current Workflow configuration. It is to be run when asking for help.

<!-- END ABOUT -->

<a href='https://github.com/alfredapp/1password-workflow/releases/latest/download/1Password.alfredworkflow'>⤓ Download Workflow</a>
