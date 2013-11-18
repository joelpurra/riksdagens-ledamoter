/*!
 * riksdagens-ledamoter scraper v0.1.0
 * https://github.com/joelpurra/riksdagens-ledamoter
 *
 * Copyright 2013, Joel Purra
 * http://joelpurra.com/
 * This content is released under the MIT license
 * http://joelpurra.mit-license.org/2013
 */

//
// DESCRIPTION
// This scraper extracts the current members of the Swedish parliament, straight from the website.
//
// USAGE
// $ phantomjs member-scraping.js > members.csv
//
// OUTPUT
// The output is list of members, with tab separated columns for first name, surname and email.
//

/*global require:true, phantom:true, setInterval:true, clearInterval:true, console:true, window:true */
/*jslint white:true, regexp:true, plusplus:true */

var pageFactory = require("webpage");

(function(global, phantom) {
    "use strict";

    // waitFor has been modified to not accept strings, jslint cleanup.

    /**
     * See https://github.com/ariya/phantomjs/blob/master/examples/waitfor.js
     *
     * Wait until the test condition is true or a timeout occurs. Useful for waiting
     * on a server response or for a ui change (fadeIn, etc.) to occur.
     *
     * @param testFx callback function that evaluates to a boolean,
     * @param onReady callback function executed testFx condition is fulfilled,
     * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
     */

    function waitFor(testFx, onReady, timeOutMillis) {
        var maxtimeOutMillis = timeOutMillis || 3000, //< Default Max Timout is 3s
            start = new Date().getTime(),
            condition = testFx(),
            interval = setInterval(function() {
                if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
                    // If not time-out yet and condition not yet fulfilled
                    condition = testFx();
                } else {
                    if (!condition) {
                        // If condition still not fulfilled (timeout but condition is 'false')
                        console.log("'waitFor()' timeout");
                        phantom.exit(1);
                    } else {
                        // Condition fulfilled (timeout and/or condition is 'true')
                        clearInterval(interval); //< Stop this interval
                        //console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                        onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    }
                }
            }, 250); //< repeat check every 250ms
    }

    global.waitFor = waitFor;
}(this, phantom));

(function(phantom, pageFactory, waitFor) {
    "use strict";

    var basePartyUrl = "http://www.riksdagen.se/sv/ledamoter-partier/${PARTYNAME}/Ledamoter/",

        partyNames = [
            "Socialdemokraterna",
            "Moderata-samlingspartiet",
            "Miljopartiet-de-grona",
            "Folkpartiet",
            "Centerpartiet",
            "Sverigedemokraterna",
            "Vansterpartiet",
            "Kristdemokraterna"
        ],

        inPageContext = {
            extractMemberArray: function(window) {
                var partyMembers = window.$("#ctl00_MainContent_MainRegion_pListResults dl").map(function() {
                    var $this = window.$(this),
                        name = $this.find("dt").text().replace(/\s+\(.*/, "").trim(),
                        nameparts = name.split(", "),
                        firstName = nameparts[1].trim(),
                        surName = nameparts[0].trim(),
                        email = $this.find("dd a").text().trim(),
                        member = {
                            firstName: firstName,
                            surName: surName,
                            email: email
                        };

                    return member;
                }).get();

                return partyMembers;
            }
        },

        inPhantomContext = {
            waitForJQuery: function(url, callback) {
                var page = pageFactory.create();

                page.onError = function(msg, trace) {
                    console.error(msg);
                    trace.forEach(function(item) {
                        console.error("  ", item.file, ":", item.line);
                    });
                };

                page.open(url, function(status) {
                    if (status !== "success") {
                        console.error("Unable to load the address!", url);

                        phantom.exit();
                    }

                    waitFor(function() {
                        var jQueryHasLoaded = page.evaluate(function() {
                            return window.hasOwnProperty("jQuery");
                        });

                        return jQueryHasLoaded;
                    }, function() {
                        callback.call(null, page);

                        // Async stuff could happen?
                        //page.close();
                    }, 10000);
                });
            },

            getMembers: function(partyName, callback) {
                var partyUrl = basePartyUrl.replace("${PARTYNAME}", partyName);

                inPhantomContext.waitForJQuery(partyUrl, function(page) {
                    var partyMembers = page.evaluate(inPageContext.extractMemberArray);

                    callback.call(null, partyMembers);
                });
            },

            getAllMembers: function(callback) {
                var allMembers = [],
                    outstandingRequests = 0;

                partyNames.forEach(function(partyName) {
                    outstandingRequests++;

                    inPhantomContext.getMembers(partyName, function(partyMembers) {
                        outstandingRequests--;

                        allMembers = allMembers.concat(partyMembers);

                        if (outstandingRequests === 0) {
                            callback.call(null, allMembers);
                        }
                    });
                });
            },

            printMember: function(member) {
                console.log([member.firstName, member.surName, member.email].join("\t"));
            },

            printMembers: function(members) {
                console.log(["First name", "Surname", "Email"].join("\t"));
                members.forEach(inPhantomContext.printMember);
            },

            main: function() {
                inPhantomContext.getAllMembers(function(allMembers) {
                    inPhantomContext.printMembers(allMembers);

                    phantom.exit();
                });
            }
        };

    inPhantomContext.main();
}(phantom, pageFactory, this.waitFor));