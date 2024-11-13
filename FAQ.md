# Frequently Asked Questions (FAQ)

### Why does nothing happen when I run the workflow?

Something always happens, so check the [debugger](https://www.alfredapp.com/help/workflows/advanced/debugger/). Ensure you [installed the Automation Tasks](https://www.alfredapp.com/help/kb/automation-task-not-found/).

If you see your items but are unable to action them, run `:1pextras` → `Force Update Items` and try again.

### How do I get past `Updating items…`?

If the workflow appears to hang when updating items, [open a terminal](https://support.apple.com/en-gb/guide/terminal/apd5265185d-f365-44cb-8b09-71a064a42125/mac) and run `op item list`:

* If you get an error, something is wrong with 1Password’s command-line tool or its interaction with the app and it needs to be resolved with the [1Password support](https://1password.community/).
* If you see your items, open the [debugger](https://www.alfredapp.com/help/workflows/advanced/debugger/) and run `:1pextras` → `Force Update Items`. Include the debugger’s output in your report.

### How do I report an issue?

Accurate and thorough information is crucial for a proper diagnosis. When reporting issues, please include the output of running `!1pdiagnostic` in Alfred, in addition to:

* The [debugger](https://www.alfredapp.com/help/workflows/advanced/debugger/) output. Perform the failing action and click *Copy* on the top right.
* Details on what you did, what happened, and what you expected to happen. A [short video](https://support.apple.com/en-us/HT208721) of the steps with the debugger open may help to find the problem faster.
