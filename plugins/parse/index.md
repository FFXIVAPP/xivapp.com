---
layout: default
title: Parse ~ XIVAPP
---

# Parse

![](/images/logos/parse.png){: .image-left .image-box .image-128 }
This is among one of the most used parsers for Final Fantasy XIV and was for quite some time the only one actively being developed.

It provides real-time data, is open source and presented in a way that is usable and friendly. It's been used since Beta of 1.0 and is always evolving.

<div style="clear: both;"></div>

# Requirements

* FFXIV-APP
* NET 4.6.2
* The “Battle” tab in-game or at least one tab by itself must have every chat line turned on for battle
* For proper parsing of yourself you must at least set your first/last name of character
* Server is used to pull in your lodestone avatar pictures

# Usage & Features

## Home ➜ Basic View

When using default settings this is the basic view shown to all users. The score card for the party has some basic breakdowns.

Whenever you see the term “Combined” or “Comb.” what that means is it includes XOverTime spells like healing/damage/etc.

These are all tracked independently of each other as you will see in further screenshots.

Each player has his or her own score card as well. While not shown in this screen shot when playing while the game is running a job icon will be displayed next to the persons picture.

The title bar of each card displays the total overall DPS along with how active the person was during the fight.

Below that you will have identifiers [YOU] for you, [P] for party member, [A] or alliance and [O] for other. This is also dependant on whether you are parsing the alliance/others.

Please keep in mind parsing others is resource intensive but can be done. It will include anyone around you and just to the edge of your visible range.

At the bottom there is an options to load an existing file and currently has limitations that anything status based will not be re-parsed. This functionality will be readjusted to use a exported parse from the program.

You can also choose the advanced view or reset the currently parse manually to start fresh.

If enabled when reseting the parser it will store a copy of that in memory until you shut it down. This allows you to go back and have a look after the fact.

![](/images/plugins/parse/basic-view.jpg)

## Home ➜ Advanced View

If enabled now have an advanced view.

View source is current and past parses (if enabled for history storing).

View type can be either:

* Score Cards (as shown)
* Party
* Party (ALL)
* Monster
* Monster (ALL)

What do these mean?

* Score Cards
  * A continuation of the basic view with no other changes.
* Party
  * Overall totals for all players and pets but broken down into subcategories, by action and target.
* Party (ALL)
  * Overall totals for all players and pets.
* Monster
  * Overall totals for all monsters but broken down into subcategories, by action and target.
* Monster (ALL)
  * Overall totals for all monsters.

You will see an example of the break downs (for players) in the following screen shots. There are a few symbols that you will see as part of the action name when viewing. These are there as “keys” so they are tracked properly.

Example:

* [•] is XOverTime (healing, damage, etc)
* [∞] is over healing.
* [•][∞] XOverTime that also over healed.
* [☯] mitigation spells like stoneskin.
* [+] this is an extra or unknown attack which typically comes from Sword Oath (PLD).

The upcoming break down of functionality will be the same for monsters as well.

First and foremost because of the way databinding works in the application if you click on someone in the list before they actually have data for something (like a certain action, healing data, etc) to ensure you have the latest data select the player and press refresh. This button is not needed however after they have 1 update to that action because it will bind correctly going forward.

When you select a player it will populate the tabs of data on the right hand side.

![](/images/plugins/parse/advanced-view.jpg)

## Home ➜ Damage (Actions)

This tab is broken down into the following sections:

* Totals Normal
  * This is a list of actions by the selected player that have been done but do not include damage over time.
* Totals Over Time
  * All damage done that is DoT based.

By default in ALL tabs each column is displayed with nothing turned off. You can however through settings or by right clicking anywhere in the list view turn off a column.

Please be advised turning off a column in one tab turns it off in another. If it wasn’t done this way currently it would bloat the settings page to nearly 2000 items that can be checked.

I’m open to pull requests to facilitate this better though 🙂

![](/images/plugins/parse/damage-actions.jpg)

## Home ➜ Damage (Actions) ➜ Last 20

When you are on the Damage (Actions) tab you can also based on the selected person see what the last 20 actions were from them and who/what it hit, etc. It defaults to be sorted oldest to newest (top to bottom).

![](/images/plugins/parse/damage-actions-last-20.jpg)

## Home ➜ Damage (Monsters)

This allows you to see a breakdown of per monster damage by the selected player.

This tab is broken down into the following sections:

* Totals Normal
  * Total damage done by selected player as a list of monsters.
* Totals Actions
  * Total damage done by selected player by selected monster as a list of actions.
* Totals Over Time
  * Total damage over time done by selected player by selected monster as a list of actions
* Totals Actions (Over Time)
  * Total damage over time done by selected player by selected monster as a list of actions.

![](/images/plugins/parse/damage-monsters.jpg)

## Home ➜ Healing (Actions)

This tab is broken down into the following:

* Totals Normal
  * Regular healing actions.
* Totals Over Healing
  * All healing actions that over healed (includes healing over time).
* Totals Over Time
  * All actions which heal over time.
* Totals Mitigated
  * All actions which block damage, i.e. stoneskin.

While not shown when you are on the Healing (Actions) tab you can also based on the selected person see what the last 20 actions were from them and who/what it hit, etc. It defaults to be sorted oldest to newest (top to bottom).

![](/images/plugins/parse/healing-actions.jpg)

## Home ➜ Healing (Players)

This allows you to see a breakdown of per player healing by the selected player.

This tab is broken down into the following sections:

* Totals Normal
  * Total healing done by selected player as a list of players.
* Totals Actions
  * Total healing done by selected player by selected target as a list of actions.
* Totals Over Healing
  * Total over healing done by selected player by selected target as a list of actions
* Totals Actions (Over Healing)
  * Total over healing done by selected player by selected target as a list of actions.
* Totals Over Time
  * Total healing over time done by selected player by selected target as a list of actions
* Totals Actions (XOverTime)
  * Total healing done by selected player by selected target as a list of actions.
* Totals Mitigated
  * Total mitigated done by selected player by selected target as a list of actions
* Totals Actions (Mitigated)
  * Total mitigated by selected player by selected target as a list of actions.

![](/images/plugins/parse/healing-players.jpg)

## Home ➜ Buffs

The buffs tab allows you to see how long a given buff has been active on a player. It also tells you how long a player kept up buffs overall (usually pretty large), and a per player breakdown when you select a player.

![](/images/plugins/parse/buffs.jpg)

## Home ➜ Damage Taken (Actions)

This tab is broken down into the following sections:

* Totals Normal
  * This is a list of actions by the selected player that have been done to that player but do not include damage over time.
* Totals Over Time
  * All damage done that is DoT based to the selected player.


![](/images/plugins/parse/damage-taken-actions.jpg)

## Home ➜ Damage Taken (Actions) ➜ Last 20

When you are on the Damage Taken (Actions) tab you can also based on the selected person see what the last 20 actions were that hit them who/what it hit, etc. It defaults to be sorted oldest to newest (top to bottom).

You may ask why you want this but it can let you know what the last action was that killed a person and for how much 😉

![](/images/plugins/parse/damage-taken-actions-last-20.jpg)

## Home ➜ Damage Taken (Monsters)

This allows you to see a breakdown of per player damage taken by the selected player and monster.

This tab is broken down into the following sections:

* Totals Normal
  * Total damage taken by selected player as a list of monsters.
* Totals Actions
  * Total damage taken by selected player by selected monster as a list of actions.
* Totals Over Time
  * Total damage taken over time by selected player by selected monster as a list of actions
* Totals Actions (Over Time)
  * Total damage taken over time by selected player by selected monster as a list of actions.


![](/images/plugins/parse/damage-taken-monsters.jpg)

## Settings ➜ Main Settings

The parser has some included widgets.

* DPS, damage per second.
* DTPS, damage taken per second.
* HPS, healing per second.

It also can adjust the widget opacity, disable titles on the widgets and enable click-though so it doesn’t cause a loss of focus on the game.

You can use reset settings to bring back the widget to your main screen (in the case a second screen was disconnected) or open it again if you accidentally or purposefully closed it.

![](/images/plugins/parse/settings-main.jpg)

## Settings ➜ Parseable

The settings on this tab allow you to turn on parsing of you, your party, the alliance or everyone around you. Please be sure to have a chat tab in the game that has all corresponding events turned on as well.

![](/images/plugins/parse/settings-parseable.jpg)

## Settings ➜ Colors

Default colors for the progress bar background along with named colors for jobs. The default color is specified as ARGB (alpha, red, green, blue) written in hex; while job colors use the following specification:

[System.Windows.Media.Colors](https://msdn.microsoft.com/en-us/library/system.windows.media.colors)

![](/images/plugins/parse/settings-colors.jpg)

## Settings ➜ Widget Settings

All widgets have the following settings:

* UI Scale
* Sort Direction
  * Ascending or descending.
* Sort Property
  * Name
  * Job
  * DPS,DTPS,HPS
  * TotalOverallX
  * CombinedTotalOverallX
  * PercentOfTotalOverall
* Display Property:
  * Combined or Individual
  * Combined means XOverTime + Regular
  * Individual is just Regular.
* Visibility Threshold
  * You can set this to X (e.g. 50) to only display those players with that number or greater.


![](/images/plugins/parse/settings-widgets.jpg)

## Settings ➜ Column Display Settings

This page… 😥

This tab is another way to turn off the columns in the tabs and really I should just delete it but you will find a couple hundred check boxes in here.

They are broke down into category however.

![](/images/plugins/parse/settings-column.jpg)

## Settings ➜ Basic Display Settings

Every “Card” in basic and advanced has line item on it along with a number. Every stat you see is also available to be displayed on the cards.

There’s a lot.

![](/images/plugins/parse/settings-basic.jpg)

## Settings ➜ Basic Combined Display Settings

This is an extension of the previous tab but focus on showing combined damage totals vs just regular ones.

With the previous tab you could show both the XOverTime and Regular, etc. This would show those and combined at the same time or any combination therein.

![](/images/plugins/parse/settings-basic-combined.jpg)

## Settings ➜ Other Options

This is the history and auto reset section. It’s broken down into the following items:

* Track XPS From Parse Start
  * From the first moment an event happens, track the over time objects with that date time. This will be depending on what you have selected on the even trigger below.
* Ignore Limit Break Damage
  * If on ignores damage based on limit break names.
* Enable Store History Auto-Reset
  * Based on the interval and trigger below, automatically reset the parse and add it to the history.
* Automatically Load the Last Parse From History on Each Reset
  * Deprecated and will be removed as you now select the history item yourself.
* Store History Interval
  * How long to wait after the event trigger to reset the parser.
* Store History Event Trigger
  * Any or Damage Only.

If you choose Any it means anything and everything from a potion to sprint will trigger the start of the encounter.

If you choose Damage Only than only a damage action (from or to) will trigger the start of the parse.

When the first event is found the parser will auto-reset it self.

![](/images/plugins/parse/settings-other.jpg)

## About

Contains information such as version, copyright (if applicable) and allows a one-click link to open the source code repository on GitHub.

![](/images/plugins/parse/about.jpg)
