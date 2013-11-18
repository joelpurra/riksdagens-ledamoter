# [Riksdagens Ledamöter](https://github.com/joelpurra/riksdagens-ledamoter) (riksdagens-ledamoter)

A small utility to extract a list of first name, surname and email to [all members](http://www.riksdagen.se/en/Members-and-parties/) of the [Swedish Parliament](http://www.riksdagen.se/en/).


## Version

This is the XSLT tr version. The scraper extracts the current members of the Swedish parliament, [straight from the website](http://www.riksdagen.se/sv/ledamoter-partier/).


## Usage

```bash
$ phantomjs member-scraping.js > members.csv
```


## Output

The output is list of members, with tab separated columns for first name, surname and email.


## License

Copyright (c) 2013, [Joel Purra](http://joelpurra.com/) All rights reserved.

When using riksdagens-ledamoter, comply to the [MIT license](http://joelpurra.mit-license.org/2013). Please see the LICENSE file for details, and the [MIT License on Wikipedia](http://en.wikipedia.org/wiki/MIT_License).
