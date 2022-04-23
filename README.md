# <img src='Workflow/icon.png' width='45' align='center' alt='icon'> 1Password Alfred Workflow

Search and open 1Password items

## Instructions

Use `1p` to interact with your 1Password items.

On first run you’ll need to set up your account with 1Password’s official command-line tool. Your terminal will open and guide you through the process.

![](https://user-images.githubusercontent.com/1699443/164910915-1d7e8f0e-4509-4c65-ad51-01d0268d319a.png)

From then on, `1p` will show your items. ↵ opens the website in your browser (and fills the credentials if you have the browser extension installed) while ⌘↵ opens the item in 1Password.

![](https://user-images.githubusercontent.com/1699443/164912992-b06c1eca-3636-46e7-84d7-7efedc5c23a9.png)

The Workflow will attempt to detect when you update items in 1Password and present you with the option to refresh them. You can disable this behaviour by flipping the `auto_refresh` Workflow Environment Variable to `0`. Set `logins_only` to `1` if you want to hide other item types.

Uncommon but useful actions, such as toggling vaults, can be accessed via `:1pextras`.

![](https://user-images.githubusercontent.com/1699443/164913293-a1ff8693-eeb0-4c26-9915-37c294e481e3.png)

![](https://user-images.githubusercontent.com/1699443/164913297-063df227-107e-4026-a330-08269d7424c6.png)

The Workflow uses tools and methodologies appropriate for 1Password 8. For older versions, see Alfred Preferences → Features → 1Password.

## Download

[Get the latest release.](https://github.com/alfredapp/1password-workflow/releases/latest/download/1Password.alfredworkflow)

## License

3-Clause BSD
