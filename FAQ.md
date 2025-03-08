# Frequently Asked Questions (FAQ)

### Why does nothing happen when I run the workflow?

Something always happens, so check the [debugger](https://www.alfredapp.com/help/workflows/advanced/debugger/). Ensure you [installed the Automation Tasks](https://www.alfredapp.com/help/kb/automation-task-not-found/).

If you see your items but are unable to action them, run `:1pextras` → `Force Update Items` and try again.

### How do I get past `Updating items…`?

If the workflow appears to hang when updating items, [open a terminal](https://support.apple.com/en-gb/guide/terminal/apd5265185d-f365-44cb-8b09-71a064a42125/mac) and run `op item list`:

* If you get an error, something is wrong with 1Password’s command-line tool or its interaction with the app and it needs to be resolved with the [1Password support](https://1password.community/).
* If you see your items, open the [debugger](https://www.alfredapp.com/help/workflows/advanced/debugger/) and run `:1pextras` → `Force Update Items`. Include the debugger’s output in your report.

### Can I see usernames in the subtitle?

The workflow deliberatedly doesn’t grab usernames. Those can themselves be sensitive information and 1Password saves them in the same field used to store the first line from secure notes, which can be even more private. Given the broad range of users this workflow is geared for and the potential sensitivity of the data, after much deliberation I have opted for the cautious approach.

### How do I set different default actions?

You can change the actions for common modifiers in the [Workflow’s Configuration](https://www.alfredapp.com/help/workflows/user-configuration/). Run `:1pextras` → `Force Update Items` after saving to commit your changes.

### How do I report an issue?

Accurate and thorough information is crucial for a proper diagnosis. **At a minimum, your report should include:**

* The output of running `!1pdiagnostic`.
* The [debugger](https://www.alfredapp.com/help/workflows/advanced/debugger/) output of the failing action.
