<?xml version="1.0"?>
<xsl:stylesheet 
      xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
      version="1.0">
<xsl:output method="html" omit-xml-declaration="yes" standalone="no"/>      

<xsl:template match="/es">
<xsl:for-each select="e">
  <xsl:choose>
    <xsl:when test="position()!=last()">
      <xsl:element name="span">
        <xsl:attribute name="title">
          <xsl:value-of select="@a"/>
        </xsl:attribute>
        <xsl:value-of select="@d"/>
      </xsl:element>;
    </xsl:when>
    <xsl:otherwise>
      <xsl:element name="span">
        <xsl:attribute name="title">
          <xsl:value-of select="@a"/>
        </xsl:attribute>
        <xsl:value-of select="@d"/>
      </xsl:element>
    </xsl:otherwise>
  </xsl:choose>
</xsl:for-each>
</xsl:template>
</xsl:stylesheet>