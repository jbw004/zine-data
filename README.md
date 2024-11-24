# Zine Discovery Data

This repository contains the data that powers the Zine Discovery app, a curated collection of digital DIY magazines (zines). The app provides an easy way to discover and read digital zines across various topics and styles.

## Structure

The repository is organized as follows:
- `data.json`: Main data file containing all zine and issue information
- `images/`: Directory containing zine and issue cover images

## Data Format

The `data.json` file follows this structure:

```json
{
  "version": "1.0",
  "last_updated": "YYYY-MM-DD",
  "zines": [
    {
      "id": "string",
      "name": "string",
      "bio": "string",
      "cover_image_url": "string",
      "instagram_url": "string",
      "issues": [
        {
          "id": "string",
          "title": "string",
          "cover_image_url": "string",
          "link_url": "string",
          "published_date": "YYYY-MM-DD"
        }
      ]
    }
  ]
}
```
**FIELD DESCRIPTIONS**
**Zine Object**
- id: Unique identifier for the zine
- name: Display name of the zine
- bio: Short description of the zine
- cover_image_url: URL to the zine's cover image
- instagram_url: Link to the zine's Instagram profile
- issues: Array of issue objects

**Issue Object**
id: Unique identifier for the issue
title: Display title of the issue
cover_image_url: URL to the issue's cover image
link_url: URL where the issue can be viewed
published_date: Publication date in YYYY-MM-DD format

**DATA UPDATES**
This repository contains curated content for the Zine Discovery app. While we're not accepting direct contributions at this time, if you know of a great digital zine that should be included, feel free to:
1. Open an issue to suggest new zines
2. Report any outdated or incorrect information
3. Report broken links
Future versions of the app will include features for community contributions.

**LICENSE**
This project is licensed under the MIT License - see the LICENSE file for details.

**CONTACT**
jweldon64@gmail.com
