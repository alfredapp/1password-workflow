#!/usr/bin/osascript -l JavaScript

// String -> String
function envVar(varName) {
  return $.NSProcessInfo
    .processInfo
    .environment
    .objectForKey(varName).js
}

// String -> ()
function writeSTDOUT(string) {
  const nsdata = $(string).dataUsingEncoding($.NSUTF8StringEncoding)
  $.NSFileHandle.fileHandleWithStandardOutput.writeData(nsdata)
}

// String -> ()
function mkpath(path) {
  $.NSFileManager
    .defaultManager
    .createDirectoryAtPathWithIntermediateDirectoriesAttributesError(path, true, undefined, undefined)
}

// String, String -> ()
function writeFile(path, text) {
  $(text).writeToFileAtomicallyEncodingError(path, true, $.NSUTF8StringEncoding, undefined)
}

// String -> String
function withScheme(url) {
  try {
    const urlObject = $.NSURL.URLWithString(url)
    return (urlObject.scheme.js === undefined) ? "https://" + url : url
  } catch {
    return url
  }
}

// String -> String
function getHostname(url) {
  try {
    const urlObject = $.NSURL.URLWithString(withScheme(url))
    return urlObject.host.js.replace(/^www\d?\./, "")
  } catch {
    return url
  }
}

// [String] -> String
function runCommand(arguments) {
  const task = $.NSTask.alloc.init
  const stdout = $.NSPipe.pipe

  task.executableURL = $.NSURL.fileURLWithPath("/usr/bin/env")
  task.arguments = arguments
  task.standardOutput = stdout
  task.launchAndReturnError(false)

  const dataOut = stdout.fileHandleForReading.readDataToEndOfFileAndReturnError(false)
  const stringOut = $.NSString.alloc.initWithDataEncoding(dataOut, $.NSUTF8StringEncoding).js

  return stringOut
}

// String... -> String
function runOP(...arguments) {
  const command = ["op", "--cache"]
  const format = ["--format", "json"]

  return JSON.parse(runCommand(command.concat(arguments, format)))
}


// String -> ()
function copySensitive(text) {
  ObjC.import("AppKit")

  const pboard = $.NSPasteboard.generalPasteboard

  pboard.clearContents
  pboard.setStringForType(text, "org.nspasteboard.ConcealedType")
  pboard.setStringForType(text, "public.utf8-plain-text")
}

// String -> ()
function copyOTP(itemID, vaultID, accountID) {
  // Can be array of objects, single object, or nothing
  const allOTP = runOP("item", "get", itemID,
    "--field", "type=otp",
    "--vault", vaultID, "--account", accountID)

  const otp = allOTP.length > 0 ? allOTP[0]["totp"] : allOTP["totp"] // If more than one, get primary
  copySensitive(otp)
}

// String -> ()
function copyByLabel(label, itemID, vaultID, accountID) {
  const value = runOP("item", "get", itemID,
    "--field", `label=${label}`,
    "--vault", vaultID, "--account", accountID)["value"]

  copySensitive(value)
}

// Object -> Object
function getModifiers(item_vars) {
  // Available actions for modifiers
  const actions = {
    open_and_fill: { subtitle: "Open and Fill" },
    view_in_1password: { subtitle: "View in 1Password" },
    copy_username: { subtitle: "Copy Username" },
    copy_password: { subtitle: "Copy Password" },
    copy_otp: { subtitle: "Copy OTP" },
  }

  // Each action has a variable with the same name, plus a set of item variables
  Object.keys(actions).forEach(key => actions[key]["variables"] = Object.assign({ action: key }, item_vars))

  // Populate modifiers
  return {
    none: actions[envVar("mod_none")],
    cmd: actions[envVar("mod_cmd")],
    alt: actions[envVar("mod_alt")],
    ctrl: actions[envVar("mod_ctrl")],
    shift: actions[envVar("mod_shift")]
  }
}

// String -> [Object]
function getItems(userID, excludedVaults) {
  const vaults = runOP("vault", "list", "--account", userID)
  const account = runOP("account", "list")
    .find(account => account["user_uuid"] === userID)
  const accountURL = envVar("hostnames_only") === "1" ? getHostname(account["url"]) : account["url"]

  return runOP("item", "list", "--account", userID).flatMap(item => {
    const vaultID = item["vault"]["id"]

    // Return early due to workflow configuration
    if (excludedVaults.includes(vaultID)) return
    if (envVar("logins_only") === "1" && item["category"] !== "LOGIN") return

    // Vault name
    const vaultName = vaults.find(vault => vault["id"] === vaultID)["name"]

    // Format when no URLs
    if (item["urls"] === undefined) {
      const itemVars = {
        accountID: account["account_uuid"],
        vaultID: vaultID,
        itemID: item["id"],
      }

      const modifiers = getModifiers(itemVars)

      return {
        uid: item["id"],
        title: item["title"],
        subtitle: `${vaultName} 𐄁 ${accountURL}`,
        mods: modifiers,
        variables: Object.assign({ action: modifiers["none"]["variables"]["action"] }, itemVars)
      }
    }

    // Array with one entry per URL, unless specified otherwise in workflow configuration
    const urlObjects = envVar("multiple_entries") === "1" ? item["urls"] : [item["urls"][0]]

    return urlObjects.map(urlObject => {
      const url = withScheme(urlObject["href"])
      const displayURL = envVar("hostnames_only") === "1" ? getHostname(url) : url
      const itemVars = {
        accountID: account["account_uuid"],
        vaultID: vaultID,
        itemID: item["id"],
        url: url
      }

      const modifiers = getModifiers(itemVars)

      return {
        variables: { action: modifiers["none"] },
        uid: item["id"],
        title: item["title"],
        subtitle: `${displayURL} 𐄁 ${vaultName} 𐄁 ${accountURL}`,
        match: `${item["title"]} ${displayURL} ${item["category"]} ${item["tags"]?.join(" ")}`,
        mods: modifiers,
        variables: Object.assign({ action: modifiers["none"]["variables"]["action"] }, itemVars)
      }
    })
  }).filter(item => item !== undefined) // Remove skipped items (excluded vaults or non-logins)
}

// () -> [String]
function getExcluded(filePath, varName) {
  if (!$.NSFileManager.defaultManager.fileExistsAtPath(filePath)) return []

  return readJSON(filePath)["items"]
    .filter(item => item["variables"]["excluded"])
    .map(item => item["variables"][varName])
}

// () -> [Object]
function getUserIDs(excludedUserIDs) {
  return runOP("account", "list").map(account => {
    const accountEmail = account["email"]
    const accountURL = envVar("hostnames_only") === "1" ? getHostname(account["url"]) : account["url"]

    const userID = account["user_uuid"]
    const excluded = excludedUserIDs.includes(userID)
    const mark = excluded ? "✗" : "✓"

    return {
      uid: userID,
      title: `${mark} ${accountEmail}`,
      subtitle: accountURL,
      arg: userID,
      variables: {
        excluded: excluded,
        userID: userID
      }
    }
  })
}

// String -> [Object]
function getVaults(userID, excludedVaults) {
  const account = runOP("account", "list")
    .find(account => account["user_uuid"] === userID)
  const accountEmail = account["email"]
  const accountURL = envVar("hostnames_only") === "1" ? getHostname(account["url"]) : account["url"]

  return runOP("vault", "list", "--account", userID).map(vault => {
    const vaultID = vault["id"]
    const excluded = excludedVaults.includes(vaultID)
    const mark = excluded ? "✗" : "✓"

    return {
      uid: vaultID,
      title: `${mark} ${vault["name"]}`,
      subtitle: `${accountEmail} 𐄁 ${accountURL}`,
      arg: vaultID,
      variables: {
        excluded: excluded,
        vaultID: vaultID
      }
    }
  })
}

// String -> ()
function flipExclusion(filePath, varName, id) {
  const sfObject = readJSON(filePath)

  const sfItems = sfObject["items"].map(item => {
    if (item["variables"][varName] !== id) return item

    const flippedState = !item["variables"]["excluded"]
    const titleNoMark = item["title"].substring(2)
    const title = `${flippedState ? "✗": "✓"} ${titleNoMark}`

    item["title"] = title
    item["variables"]["excluded"] = flippedState

    return item
  })

  writeJSON(filePath, {rerun: 0.1, items: sfItems})
}

// String -> ()
function prependDataUpdate(filePath) {
  if (!$.NSFileManager.defaultManager.fileExistsAtPath(filePath)) return // Return early if items file does not exist (e.g. managing accounts before first sign in)

  const sfObject = readJSON(filePath)

  if (sfObject["items"][0]["variables"]["action"] == "update_items") return // Return early if update entry exists

  sfObject["items"].forEach(item => delete item["uid"]) // Remove uids so Alfred does not sort

  sfObject["items"].unshift({
    variables: { action: "update_items" },
    title: "Update items",
    arg: "update_items",
    icon: {path: "composite_icon.png"}
  })

  writeJSON(filePath, sfObject)
}

// () -> Bool
function cliValidInstall() {
  // Check if valid executable and the version
  if (parseInt(runCommand(["op", "--version"]).split(".")[0]) > 1) return true

  return false
}

// () -> Bool
function cliAppUnlockEnabled() {
  const settingsFile = $("~/Library/Group Containers/2BUA8C4S2C.com.1password/Library/Application Support/1Password/Data/settings/settings.json").stringByExpandingTildeInPath.js

  if (!$.NSFileManager.defaultManager.fileExistsAtPath(settingsFile)) return false
  if (readJSON(settingsFile)["developers.cliSharedLockState.enabled"]) return true
  return false
}

// String, [String] -> ()
function writeJSON(filePath, sfObject) {
  mkpath($(filePath).stringByDeletingLastPathComponent.js)
  writeFile(filePath, JSON.stringify(sfObject))
}

// String -> [Object]
function readJSON(filePath) {
  const data = $.NSFileManager.defaultManager.contentsAtPath(filePath)
  const string = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding).js
  return JSON.parse(string)
}

function run(argv) {
  // Sanity checks
  if (!cliAppUnlockEnabled()) {
    writeSTDOUT("MISSING_CLI_APP_UNLOCK") // For Alfred's conditional
    throw "The 1Password CLI unlock needs to be enabled in the Developer tab of the 1Password preferences" // For Alfred's debugger
  }

  if (!cliValidInstall()) {
    writeSTDOUT("MISSING_OP_PATH") // For Alfred's conditional
    throw "The newest version of the 1Password CLI tool needs to be installed: https://1password.com/downloads/command-line/" // For Alfred's debugger
  }

  // Stop if we only want to check everything is ready
  if (argv[0] == "sanity_checks") return

  // Data files
  const usersFile = envVar("alfred_workflow_data") + "/users.json"
  const vaultsFile = envVar("alfred_workflow_data") + "/vaults.json"
  const itemsFile = envVar("alfred_workflow_data") + "/items.json"

  // Commands which do not need the "op" CLI (and thus the 1Password app running)
  switch (argv[0]) {
    case "flip_user_exclusion":
      flipExclusion(usersFile, "userID", argv[1])
      return prependDataUpdate(itemsFile)
    case "flip_vault_exclusion":
      flipExclusion(vaultsFile, "vaultID", argv[1])
      return prependDataUpdate(itemsFile)
    case "data_update_detected":
      return prependDataUpdate(itemsFile)
  }

  // User ID information is useful in more than one command
  const excludedUserIDs = getExcluded(usersFile, "userID")
  const usersObject = getUserIDs(excludedUserIDs)
  const activeUserIDs = usersObject
    .filter(item => !item["variables"]["excluded"])
    .map(item => item["variables"]["userID"])

  const sfUserIDs = usersObject
    .concat({
      variables: { action: "update_items" },
      title: "Update items",
      arg: "update_items",
      icon: {path: "composite_icon.png"},
      variables: {excluded: false, userID: false} // Avoid "undefined" errors in fuctions which interact with users file
    })

  // Commands which require the "op" CLI (and thus the 1Password app running)
  switch (argv[0]) {
    case "update_items":
      // Grab exclusions
      const excludedVaults = getExcluded(vaultsFile, "vaultID")

      // Write JSONs for waiting on progress
      writeJSON(vaultsFile, {rerun: 0.1, items: [{
        title: "Updating vaults…",
        subtitle: "Will take a few seconds",
        valid: false,
        variables: {excluded: false, vaultID: false} // Avoid "undefined" errors in fuctions which interact with vaults file
      }]})

      writeJSON(itemsFile, {rerun: 0.1, items: [{
        title: "Updating items…",
        subtitle: "Will take a few seconds",
        valid: false
      }]})

      // Build items and vault JSONs
      const sfItems = activeUserIDs.flatMap(userID => getItems(userID, excludedVaults))

      const sfVaults = activeUserIDs.flatMap(userID => getVaults(userID, excludedVaults))
        .concat({
          variables: { action: "update_items" },
          title: "Update items",
          arg: "update_items",
          icon: {path: "composite_icon.png"},
          variables: {excluded: false, vaultID: false} // Avoid "undefined" errors in fuctions which interact with vaults file
        })

      writeJSON(vaultsFile, {rerun: 0.1, items: sfVaults})
      writeJSON(itemsFile, {items: sfItems})
      break
    case "copy_otp":
      return copyOTP(argv[1], argv[2], argv[3])
    case "copy_by_label":
      return copyByLabel(argv[1], argv[2], argv[3], argv[4])
    case "print_user_ids":
      return activeUserIDs.join("\n")
    case "print_user_json":
      return JSON.stringify({rerun: 0.1, items: sfUserIDs})
    case "write_user_json":
      return writeJSON(usersFile, {rerun: 0.1, items: sfUserIDs})
    default:
      throw "Unrecognised argument: " + argv[0]
  }
}
