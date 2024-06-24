<?xml version='1.0'?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
   <xsl:output method="xml"/>
   
   <xsl:template match="/">
	<xsl:element name="Tree">
		<xsl:apply-templates/>
	</xsl:element>
   </xsl:template>

   <xsl:template match="Node">
    <xsl:param name="Href">
			<xsl:call-template name="generatehref">
				<xsl:with-param name="anclist" select="ancestor::*[position()!=last()]"/>
			</xsl:call-template>
			<xsl:if test="count(ancestor::*)>0">
				<xsl:value-of select="@Path"/>	
			</xsl:if>
			<xsl:value-of select="@Page"/>
	</xsl:param>
	<xsl:choose>
	 <xsl:when test="@Visible='false'">
	 </xsl:when>
	 
	 <xsl:otherwise>
	  <xsl:element name="Node">
		<xsl:attribute name="Text">
			<xsl:value-of select="@Name"/>
		</xsl:attribute>
		<xsl:attribute name="Image">
			<xsl:value-of select="@Image"/>
		</xsl:attribute>
		
		<xsl:if test="@ContextMenuName">
			<xsl:attribute name="ContextMenuName">
				<xsl:value-of select="@ContextMenuName"/>
			</xsl:attribute>
		</xsl:if>

    <xsl:attribute name="Href">
      <xsl:value-of select="$Href"/>
    </xsl:attribute>

    <xsl:attribute name="Target">ContentFrame</xsl:attribute>

		<xsl:attribute name="Value">
			<xsl:value-of select="$Href"/>
		</xsl:attribute>
		<xsl:if test="count(ancestor::*)=0">
			<xsl:attribute name="Expanded">true</xsl:attribute>	
		</xsl:if>
		<xsl:apply-templates select="Node"/>
	  </xsl:element>
	 </xsl:otherwise>
	
	</xsl:choose>
   </xsl:template>
   
   <xsl:template name="generatehref">
		<xsl:param name="anclist"/>
		<xsl:param name="hasroot"/>
		<xsl:variable name="first" select="$anclist[1]"/>
		<xsl:variable name="rest" select="$anclist[position()!=1]"/>
		
		<xsl:value-of select="$first/@Path"/>
			
		<xsl:if test="$rest">
		<xsl:call-template name="generatehref">
			<xsl:with-param name="anclist" select="$rest"/>
			
		</xsl:call-template>
		</xsl:if>
			

    </xsl:template>

</xsl:stylesheet>
