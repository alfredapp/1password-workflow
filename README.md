# <img src='Workflow/icon.png' width='45' align='center' alt='icon'> 1Password Alfred Workflow

Search and open 1Password items

<a href='https://github.com/alfredapp/1password-workflow/releases/latest/download/1Password.alfredworkflow'>⤓ Download Workflow</a>

## About

This Workflow is for 1Password 8. For older versions, see Alfred Preferences → Features → 1Password.

Use `1p` to interact with your 1Password items.

On first run you’ll need to set up your account with 1Password’s official command-line tool. Your terminal will open and guide you through the process.

![Terminal with instructions](Workflow/images/about/terminal.png)

From then on, `1p` will show your items. ↵ opens the website in your browser (and fills the credentials if you have the browser extension installed) while ⌘↵ opens the item in 1Password.

![Alfred search for 1p](Workflow/images/about/1p.png)

The Workflow will attempt to detect when you update items in 1Password and present you with the option to refresh them. You can disable this behaviour by flipping the `auto_refresh` Workflow Environment Variable to `0`. Set `logins_only` to `1` if you want to hide other item types. Set `hostnames_only` to `0` if you want to see full URLs in results.

Uncommon but useful actions, such as toggling vaults, can be accessed via `:1pextras`.

![Alfred search for :1pextras](Workflow/images/about/1pextras.png)

![Results for managing vaults](Workflow/images/about/vaults.png)

`!1pdiagnostic` inspects the current Workflow configuration. It is to be run when asking for help.

<a href='https://github.com/alfredapp/1password-workflow/releases/latest/download/1Password.alfredworkflow'>⤓ Download Workflow</a>
