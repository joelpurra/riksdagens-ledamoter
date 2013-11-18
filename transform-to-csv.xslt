<?xml version="1.0" ?>

<!--
riksdagens-ledamoter XSTL transform v0.1.0
https://github.com/joelpurra/riksdagens-ledamoter

Copyright 2013, Joel Purra
http://joelpurra.com/
This content is released under the MIT license
http://joelpurra.mit-license.org/2013
-->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:str="http://exslt.org/strings">
    <xsl:output method="text" encoding="UTF-8" />

    <!-- $newline/$tab workaround for tab/xsl text problems in xmlstarlet -->
    <!-- http://alistapart.com/d/usingxml/xml_uses_f.html -->
    <xsl:variable name="newline">
        <xsl:text>&#10;</xsl:text>
    </xsl:variable>
    <xsl:variable name="tab">
        <xsl:text>&#x09;</xsl:text>
    </xsl:variable>

    <xsl:template match="/"><xsl:apply-templates /></xsl:template>
    <xsl:template match="personlista">Efternamn<xsl:value-of select="$tab" />Tilltalsnamn<xsl:value-of select="$tab" />Email<xsl:apply-templates><xsl:sort select="person/sorteringsnamn" /></xsl:apply-templates></xsl:template>
    <xsl:template match="person">
        <xsl:value-of select="efternamn" />
        <xsl:value-of select="$tab" />
        <xsl:value-of select="tilltalsnamn" />
        <xsl:value-of select="$tab" />
        <xsl:value-of select="str:replace(personuppgift/uppgift[kod = 'Officiell e-postadress']/uppgift, '[på]', '@')" />
    </xsl:template>
</xsl:stylesheet>