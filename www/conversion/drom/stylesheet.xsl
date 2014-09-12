<?xml version="1.0" encoding="WINDOWS-1251" ?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="records">
        <avtoxml>
            <lastBuildDate></lastBuildDate>
        <Offers>
            <xsl:for-each select="//record">
                <Offer>
                    <idOffer>
                        <xsl:value-of select="column[@name='AutoID']/value"/>
                    </idOffer>
                    <idMark><xsl:value-of select="column[@name='AutoAutomark']/value"/></idMark>
                    <idModel><xsl:value-of select="column[@name='AutoAutomodel']/value"/></idModel>
                    <idCountry>0</idCountry>
                    <idCity>109</idCity>
                    <YearOfMade>
                        <xsl:value-of select="column[@name='AutoYear']/value"/>
                    </YearOfMade>
                    <Price>
                        <xsl:value-of select="column[@name='form.DKomissiiSalePrice']/value"/>
                    </Price>
                    <idCurrency>1</idCurrency>
                    <idNewType><xsl:value-of select="column[@name='AutoMileageRF']/value"/></idNewType>
                    <Volume>
                        <xsl:value-of select="column[@name='AutoVolume']/value"/>
                    </Volume>
                    <idColor><xsl:value-of select="column[@name='AutoAutocolor']/value"/></idColor>
                    <idTransmission><xsl:value-of select="column[@name='AutoTransmissionType']/value"/></idTransmission>
                    <idEngineType><xsl:value-of select="column[@name='AutoEngineType']/value"/></idEngineType>
                    <idHybridType><xsl:value-of select="column[@name='AutoEngineType']/value"/></idHybridType>
                    <idDriveType><xsl:value-of select="column[@name='AutoDriveType']/value"/></idDriveType>
                    <idWheelType><xsl:value-of select="column[@name='AutoWheelType']/value"/></idWheelType>
                    <idHaulType>1</idHaulType>
                    <Haul>
                        <xsl:value-of select="column[@name='AutoMileage']/value"/>
                    </Haul>
                    <idHaulRussiaType><xsl:value-of select="column[@name='AutoMileageRF']/value"/></idHaulRussiaType>
                    <!--<Additional>-->
                        <!--<xsl:value-of select="column[@name='AutoDescription']/value"/>-->
                    <!--</Additional>-->
                    <Photos>
                        <xsl:for-each select="column[starts-with(@name,'AutoAutoFoto')]">
                            <Photo>
                                <xsl:value-of select="value"/>
                            </Photo>
                        </xsl:for-each>
                        <!--<xsl:value-of select="column[starts-with(@name,'AutoAutoFoto')]/value"/>-->
                        <!--<xsl:value-of select="column[@name='AutoAutoFoto.AutoImage1']/value"/>-->
                    </Photos>
                    <Whereabouts>0</Whereabouts>
                </Offer>
            </xsl:for-each>
        </Offers>
        </avtoxml>
    </xsl:template>
</xsl:stylesheet>
