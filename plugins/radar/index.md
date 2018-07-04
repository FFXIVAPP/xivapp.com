---
layout: default
title: Radar ~ XIVAPP
---

# Radar

![](/images/logos/radar.png){: .image-left .image-box .image-128 }
The radar plugin was inspired by ApRadar in XI and has since become a key plugin used by many people. It's especially helpful in locating hard to find NPC's during quests.

It can also be used to find just about anything you are looking for on the map with Z depth rendering of names. Bigger is above you, smaller is below.

<div style="clear: both;"></div>

# Requirements

* FFXIV-APP
* NET 4.6.2

# Usage & Features

## Home

The main screen of this plugin allows you to reset the position (in case second screen is disconnected) or open it after previously being closed.

It also has a filter option setup much like the event plugin.

You can specify:

* Key which is a Regular Expression based match to the in-game monster name.
* Minimum Level of the matches to show.
* Type of target which could be unknown, player, monster, NPC, aetheryte, gathering or minions.

Just like with event plugin you can add, update or delete a filter.

![](/images/plugins/radar/main.jpg)

## Settings ➜ Main Settings

These settings allow you to enable click-through which in turns doesn’t take the game out of focus, remove the title bar on the widget and adjust opacity levels of the entire widget so that you may see the game through it.

![](/images/plugins/radar/settings-main.jpg)

## Settings ➜ Radar Settings

You can adjust (based on category) the following options for each:

* Radar
  * Compass mode. This means does the radar spin around with you or remain fixed to up.
  * Filter radar items, this defaults to off and is required to be on to use the filter on the main home screen.
  * UI Scale.
* PC (players), NPCs, Monsters, Gathering, Other
  * Show (at all).
  * Show names.
  * Show HP percent.
  * Show job (if available).
  * Show distance.
  * Font size.
  * Font color.

![](/images/plugins/radar/settings-radar.jpg)

## About

Contains information such as version, copyright (if applicable) and allows a one-click link to open the source code repository on GitHub.

![](/images/plugins/radar/about.jpg)
