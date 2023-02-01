# <img src='Workflow/icon.png' width='45' align='center' alt='icon'> 1Password Alfred Workflow

Search and open 1Password items

<a href='https://alfred.app/workflows/alfredapp/1password'>⤓ Install on the Alfred Gallery</a>

> On Alfred 4 use <a href='https://github.com/alfredapp/1password-workflow/releases/download/2022.13/1Password.alfredworkflow'>alternative link</a>

## Setup

[Install the 1Password CLI](https://1password.com/downloads/command-line/) and turn on the integration in 1Password Preferences → Developer → Connect with 1Password CLI.

![1Password preferences](Workflow/images/about/1password_preferences.png)

## Usage

Interact with your 1Password items via the Search Keyword (default: `1p`). Set the actions for each <kbd>⏎</kbd> modifier in the [Workflow’s Configuration](https://www.alfredapp.com/help/workflows/user-configuration/).

![Alfred search for 1p](Workflow/images/about/1p.png)

Uncommon but useful actions, such as toggling vaults, can be accessed via `:1pextras`.

![Alfred search for :1pextras](Workflow/images/about/1pextras.png)

![Results for managing vaults](Workflow/images/about/vaults.png)

A [Fallback Search](https://www.alfredapp.com/help/features/default-results/fallback-searches/) is included.

To report a problem, run `!1pdiagnostic`.
