<?xml version="1.0"?>
<!--
  IE5 default style sheet, provides a view of any XML document
  and provides the following features:
  - color coding of markup
  - color coding of recognized namespaces - xml, xmlns, xsl, dt

  This style sheet is available in IE5 in a compact form at the URL
  "res://msxml.dll/DEFAULTSS.xsl".  This version differs only in the
  addition of comments and whitespace for readability.

  Author:  Jonathan Marsh ()
  Modified:   05/21/2001 by Nate Austin ()
                         Converted to use XSLT rather than WD-xsl
-->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:dt="urn:schemas-microsoft-com:datatypes" xmlns:d2="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">
  <xsl:strip-space elements="*"/>
  <xsl:output method="html"/>
  <xsl:template match="/">
    <HTML>
      <HEAD>
        <STYLE>
          BODY {font:x-small 'Courier New'; margin-right:1.5em}
          <!-- tag -->
          .t  {color:#990000}
          <!-- attribute names -->
          .an {color:#990000;}
          <!-- tag in xsl namespace -->
          .xt {color:#990099}
          <!-- attribute in xml or xmlns namespace -->
          .ns {color:red}
          <!-- attribute in dt namespace -->
          .dt {color:green}
          <!-- markup characters -->
          .m  {color:blue}
          <!-- text node -->
          .tx {font-weight:bold}
          <!-- single-line (inline) cdata -->
          .di {}
          <!-- DOCTYPE declaration -->
          .d  {color:blue}
          <!-- pi -->
          .pi {color:blue}
          <!-- single-line (inline) comment -->
          .ci {color:#888888}
        </STYLE>
      </HEAD>
      <BODY class="st">
        <xsl:apply-templates>
          <xsl:with-param name="depth">0</xsl:with-param>
        </xsl:apply-templates>
      </BODY>
    </HTML>
  </xsl:template>

  <!-- decides whether we have a tag in an xsl namespace or a regular tag -->
  <xsl:template name="classwriter">
    <xsl:param name="curname"/>
    <SPAN>
      <xsl:attribute name="class"><xsl:if test="starts-with($curname,'xsl:')">x</xsl:if>t</xsl:attribute>
      <xsl:value-of select="$curname"/>
    </SPAN>
  </xsl:template>

  <!-- Helper that does the indent -->
  <xsl:template name="indent">
    <xsl:param name="depth"/>
    <xsl:if test="$depth &gt; 0">
      <xsl:text>&#160;&#160;</xsl:text>
      <xsl:call-template name="indent">
        <xsl:with-param name="depth" select="$depth - 1"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:template>

  <!-- Template for pis not handled elsewhere -->
  <xsl:template match="processing-instruction()">
    <DIV class="e">
      <SPAN class="m">&lt;?</SPAN>
      <SPAN class="pi">
        <xsl:value-of select="name()"/>&#160;<xsl:value-of select="."/>
      </SPAN>
      <SPAN class="m">?&gt;</SPAN>
    </DIV>
  </xsl:template>

  <!-- Template for attributes not handled elsewhere -->
  <xsl:template match="@*">
    <SPAN class="an">&#160;<xsl:value-of select="name()"/></SPAN><SPAN class="m">="</SPAN><B><xsl:value-of select="."/></B><SPAN class="m">"</SPAN>
  </xsl:template>

  <!-- Template for text nodes -->
  <xsl:template match="text()">
    <DIV class="e">
      <SPAN class="tx">
        <xsl:value-of select="."/>
      </SPAN>
    </DIV>
  </xsl:template>


  <!-- Note that in the following templates for comments
and cdata, by default we apply a style appropriate for
single line content (e.g. non-expandable, single line
display).  But we also inject the attribute 'id="clean"' and
a script call 'f(clean)'.  As the output is read by the
browser, it executes the function immediately.  The function
checks to see if the comment or cdata has multi-line data,
in which case it changes the style to a expandable,
multi-line display.  Performing this switch in the DHTML
instead of from script in the XSL increases the performance
of the style sheet, especially in the browser's asynchronous
case -->

  <!-- Template for comment nodes -->
  <xsl:template match="comment()">
    <xsl:param name="depth"/>
    <DIV class="k">
      <SPAN>
        <SPAN class="m">
          <xsl:call-template name="indent">
            <xsl:with-param name="depth" select="$depth"/>
          </xsl:call-template>
          &lt;!--
        </SPAN>
      </SPAN>
      <SPAN class="ci">
        <xsl:value-of select="."/>
      </SPAN>
      <SPAN class="m">--&gt;</SPAN>
    </DIV>
  </xsl:template>

  <!-- Note the following templates for elements may
examine children.  This harms to some extent the ability to
process a document asynchronously - we can't process an
element until we have read and examined at least some of its
children.  Specifically, the first element child must be
read before any template can be chosen.  And any element
that does not have element children must be read completely
before the correct template can be chosen. This seems an
acceptable performance loss in the light of the formatting
possibilities available when examining children. -->

  <!-- Template for elements not handled elsewhere (leaf nodes) -->
  <xsl:template match="*">
    <xsl:param name="depth"/>
    <DIV class="e">
      <xsl:call-template name="indent">
        <xsl:with-param name="depth" select="$depth"/>
      </xsl:call-template>
      <SPAN class="m">&lt;</SPAN>
      <xsl:call-template name="classwriter"><xsl:with-param name="curname" select="name()"/></xsl:call-template>
      <xsl:apply-templates select="@*"/>
      <SPAN class="m"> /&gt;</SPAN>
    </DIV>
  </xsl:template>

  <!-- Template for elements with comment, pi and/or cdata children -->
  <xsl:template match="*[comment() | processing-instruction()]">
    <xsl:param name="depth"/>
    <DIV class="e">
      <SPAN class="m">&lt;</SPAN>
      <xsl:call-template name="classwriter"><xsl:with-param name="curname" select="name()"/></xsl:call-template>
      <xsl:apply-templates select="@*">
        <xsl:with-param name="depth" select="$depth + 1"/>
      </xsl:apply-templates>
      <SPAN class="m">&gt;</SPAN>
      <DIV>
        <xsl:apply-templates>
          <xsl:with-param name="depth" select="$depth + 1"/>
        </xsl:apply-templates>
        <DIV>
          <SPAN class="m">&lt;/</SPAN>
          <xsl:call-template name="classwriter"><xsl:with-param name="curname" select="name()"/></xsl:call-template>
          <SPAN class="m">&gt;</SPAN>
        </DIV>
      </DIV>
    </DIV>
  </xsl:template>

  <!-- Template for elements with only text children -->
  <xsl:template match="*[text() and not(comment() | processing-instruction())]">
    <xsl:param name="depth"/>
    <DIV class="e">
      <!-- write the starting tag -->
      <xsl:call-template name="indent">
        <xsl:with-param name="depth" select="$depth"/>
      </xsl:call-template>
      <SPAN class="m">&lt;</SPAN>
      <xsl:call-template name="classwriter"><xsl:with-param name="curname" select="name()"/></xsl:call-template>
      <xsl:apply-templates select="@*">
        <xsl:with-param name="depth" select="$depth + 1"/>
      </xsl:apply-templates>
      <SPAN class="m">&gt;</SPAN>
      <!-- write the tag content -->
      <SPAN class="tx">
        <xsl:value-of select="."/>
      </SPAN>
      <!-- write the end tag -->
      <SPAN class="m">&lt;/</SPAN>
      <xsl:call-template name="classwriter"><xsl:with-param name="curname" select="name()"/></xsl:call-template>
      <SPAN class="m">&gt;</SPAN>
    </DIV>
  </xsl:template>

  <!-- Template for elements with element children -->
  <xsl:template match="*[*]">
    <xsl:param name="depth"/>
    <DIV class="e">
      <xsl:call-template name="indent">
        <xsl:with-param name="depth" select="$depth"/>
      </xsl:call-template>
      <SPAN class="m">&lt;</SPAN>
      <xsl:call-template name="classwriter"><xsl:with-param name="curname" select="name()"/></xsl:call-template>
      <xsl:apply-templates select="@*" />
      <SPAN class="m">&gt;</SPAN>
      <DIV>
        <xsl:apply-templates>
          <xsl:with-param name="depth" select="$depth + 1"/>
        </xsl:apply-templates>
        <DIV>
          <xsl:call-template name="indent">
            <xsl:with-param name="depth" select="$depth"/>
          </xsl:call-template>
          <SPAN class="m">&lt;/</SPAN>
          <xsl:call-template name="classwriter"><xsl:with-param name="curname" select="name()"/></xsl:call-template>
          <SPAN class="m">&gt;</SPAN>
        </DIV>
      </DIV>
    </DIV>
  </xsl:template>

  <xsl:template match="text()" />
</xsl:stylesheet>