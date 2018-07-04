---
layout: default
title: Log ~ XIVAPP
---

# Log

![](/images/logos/log.png){: .image-left .image-box .image-128 }
The log plugin has it's humble beginnings back in XI and now is working with Final Fantasy XIV.

Many users each day use the translation aspect of this feature to localize parts of the game so they may enjoy more cross-culture experiences.

<div style="clear: both;"></div>

# Requirements

* FFXIV-APP
* NET 4.6.2

# Usage & Features

## Home

This is the main screen of the Log plugin. Default tabs are shown below.

There is also a “Debug” tab which can be displayed to show the raw chatlog in bytes/unparsed string in case there’s any loss of chat.

Translated will contain Google translated text based on the preferences you have setup for the “Translate To” option.

All tabs but All, Debug, Translated can be added or removed.

To remove a tab simply select it and press the “-” button on the lower left. Adding tabs are done from Settings.

If you want to get some translated text to paste into the game simply choose the “To” language, type in your text and press “Shift + Enter”. It will be copied to your clipboard for pasting.

![](/images/plugins/log/main.jpg)

## Settings ➜ Main Settings

Both the All tab and Debug tab can be hidden or shown through these options.

![](/images/plugins/log/settings-main.jpg)

## Settings ➜ Tab Settings

You can add new tabs view this interface. Your available options are:

* RegEx: which allows you to allow any chat (*). e.g.: ^.+obtains.+$
* Name of the tab that will appear on the Home section of the plugin.
* The chat codes to listen on.

When you are ready simply press the Add Tab button.

![](/images/plugins/log/settings-tabs.jpg)

## Settings ➜ Translate Settings

These are the main translate settings.

You can choose which language to translate the game chat to. Use cases for this could be playing the game in English but translating the chatlog as it comes in to Spanish.

Translation of the game can be enabled or disabled here along with using “Romanization”. This is more of important in languages which don’t use the english alphabet and as long as Google supports this option you can see it with english text vs. the original.

For example when saying “moshi moshi” or “hello” in Japanese instead of it displaying もしもし it would display as just “moshi moshi”.

You would typically use this when translating text manually to paste into the game.

This option originally was designed to only translate text within a certain unicode range but really it’s “ignore english sentences”. It will check the current chatline and if any character is beyond code 128 it will send that off to Google.

![](/images/plugins/log/settings-translate.jpg)

## Settings ➜ Translatable Chat

Here you can choose which chat to translate. While it currently does not have an “ALL” option that can be easily added in for full game translation.

This would run the risk of being throttled by Google however.

![](/images/plugins/log/settings-translateable.jpg)

## About

Contains information such as version, copyright (if applicable) and allows a one-click link to open the source code repository on GitHub.

![](/images/plugins/log/about.jpg)
