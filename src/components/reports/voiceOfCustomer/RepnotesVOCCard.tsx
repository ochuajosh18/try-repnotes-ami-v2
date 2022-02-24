import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Home from 'react-ionicons/lib/Home';
import LogoUsd from 'react-ionicons/lib/LogoUsd';
import FlashSharp from 'react-ionicons/lib/FlashSharp';
import Information from 'react-ionicons/lib/Information';
import HappySharp from 'react-ionicons/lib/HappySharp';
import ChatboxSharp from 'react-ionicons/lib/ChatboxSharp';
import StatsChartSharp from 'react-ionicons/lib/StatsChartSharp';
import ThumbsUpSharp from 'react-ionicons/lib/ThumbsUpSharp';
import FlagSharp from 'react-ionicons/lib/FlagSharp';
import ReceiptOutline from 'react-ionicons/lib/ReceiptOutline';
import BagHandle from 'react-ionicons/lib/BagHandle';
import Chatbubbles from 'react-ionicons/lib/Chatbubbles';
import Time from 'react-ionicons/lib/Time';
import Car from 'react-ionicons/lib/Car';
import CheckmarkCircle from 'react-ionicons/lib/CheckmarkCircle';
import Construct from 'react-ionicons/lib/Construct';
import Help from 'react-ionicons/lib/Help';
import PricetagsOutline from 'react-ionicons/lib/PricetagsOutline';
import GitCommitSharp from 'react-ionicons/lib/GitCommitSharp';
import CloudSharp from 'react-ionicons/lib/CloudSharp';
import { currencyConverter } from '../../../util/utils';


interface VOCCardSummaryProps {
    count: number | string;
    label?: string;
    color?: string;
}

export const RepnotesPercentCard = ({ count }: VOCCardSummaryProps) => (
    <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6', marginRight: 16, }}>
        <CardContent style={{backgroundColor:"#4572C4", fontSize: 32, fontWeight: 'bold', paddingLeft:'10px', color: '#FFF', paddingRight:'10px',  textAlign: 'center'}}>
            %
        </CardContent>
        <CardContent style={{width:'106px !important'}} >
            <Typography variant="h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                {isNaN(count as number) ? '0.00' : count.toLocaleString(undefined, { minimumFractionDigits: 2 })}%
            </Typography>
            <Typography style={{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                Margin
            </Typography>
        </CardContent>
    </Card>
)

export const RepnotesVOCCardCommercial = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#1E73C6", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <Home
                    color="#ffffff"
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    COMMERCIAL TERMS
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardPricing = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#FF7426", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <LogoUsd
                    color="#ffffff"
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    PRICING
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardActivities = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#7F7F7F", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <FlashSharp
                    color="#ffffff"
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    ACTIVITIES
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardCompetitionInfo = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#1E73C6", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <Information
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    COMPETITION INFO
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardCustomerExperience = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#FF7426", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <HappySharp
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style={{ color:'#FF7426', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{ color:'#FF7426', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    CUSTOMER EXPERIENCE
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardGeneralCommnets = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#7F7F7F", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <ChatboxSharp
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style={{ color:'#7F7F7F', fontSize:'18px', fontWeight: 'bold', textAlign: 'left'}}>
                   {count}
                </Typography>
                <Typography style={{color:'#7F7F7F', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    GENERAL COMMENTS
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardProductPerformance = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#FFBD35", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <StatsChartSharp
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style={{ color:'#FFBD35', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#FFBD35', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    PRODUCT PERFORMANCE
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardDynamic = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#FFBD35", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <StatsChartSharp
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style={{ color:'#FFBD35', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#FFBD35', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    PRODUCT PERFORMANCE
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardProductQuality = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style= {{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#2A9DD7", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <ThumbsUpSharp
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style= {{ color:'#2A9DD7', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{ color:'#2A9DD7', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    PRODUCT QUALITY
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardUnmetNeed = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#4FAF43", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <FlagSharp
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style={{ color:'#4FAF43', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{ color:'#4FAF43', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    UNMET NEED
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardInvoiceAmount = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#4572C4", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <ReceiptOutline
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important', paddingLeft:'10px', paddingRight:'10px'}} >
                <Typography variant="h4" noWrap style={{ color:'#4572C4', fontSize:'14px', fontWeight: 'bold', textAlign: 'left' }}>
                {currencyConverter(count as number)}
                </Typography>
                <Typography style={{ color:'#4572C4', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    INVOICE AMOUNT
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardCost = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style= {{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#4572C4", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <LogoUsd
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant= "h4" noWrap style={{ color:'#4572C4', fontSize:'14px', fontWeight: 'bold', textAlign: 'left', textOverflow: "ellipsis", overflow: "hidden" }}>
                {currencyConverter(count as number)}
                </Typography>
                <Typography style= {{ color:'#4572C4', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    COST
                </Typography>
            </CardContent>
        </Card>
    )
}
               
export const RepnotesVOCCardOpenSO = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style= {{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#A3D4F5", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <Information
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important', paddingLeft:'10px', paddingRight:'10px'}} >
                <Typography variant="h4" style= {{ color:'#1E73C6', fontSize:'14px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#1E73C6', fontSize:'9px', textAlign: 'left' }} gutterBottom>
                    OPEN SALES OPPORTUNITIES
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardOpenQuotes = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#429AD5", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <Information
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style={{ color:'#1E73C6', fontSize:'14px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    OPEN QOUTES
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardLostDealtoDate = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#047BEE", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <Information
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style={{ color:'#1E73C6', fontSize:'14px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{color:'#1E73C6', fontSize:'9px', textAlign: 'left'}} gutterBottom>
                    LOST DEAL TO DATE
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardPurchasingExperience = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#1E73C6", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <BagHandle
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant= "h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    PURCHASING EXPERIENCE
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardCommunicationOfOrderStatus = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#FF7426", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <Chatbubbles
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant= "h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#1E73C6', fontSize:'9px', textAlign: 'left' }} gutterBottom>
                    COMMUNICATION OF ORDER STATUS
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardProductLeadTime = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#7F7F7F", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <Time
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant= "h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    PRODUCT LEAD TIME
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardDeliveryExperience = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#FFBD35", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <Car
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant= "h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    DELIVERY EXPERIENCE
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardPartsAvailability = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style= {{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#2A9DD7", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <CheckmarkCircle
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant= "h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    PARTS AVAILABILITY
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardPartsPricing = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#4FAF43", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <LogoUsd
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant= "h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    PARTS PRICING
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardServiceTechnicianSupport = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#0ac0ef", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <Construct
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant= "h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#1E73C6', fontSize:'9px', textAlign: 'left' }} gutterBottom>
                    SERVICE TECHNICIAN SUPPORT
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardOthers = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#05a559", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
               <Help
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant= "h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style= {{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    OTHERS
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardMarketSize = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#4572C4", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <Information
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style= {{ color:'#7F7F7F', fontSize:'18px', fontWeight: 'bold', textAlign: 'left'}}>
                   {count}
                </Typography>
                <Typography style={{color:'#7F7F7F', fontSize:'10px', textAlign: 'left' }} gutterBottom>
                    TOTAL MARKET SIZE
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardUnitSize = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#EC7D33", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <Information
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style={{ color:'#7F7F7F', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{color:'#7F7F7F', fontSize:'10px', textAlign: 'left'}} gutterBottom>
                    TOTAL UNIT SALES
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesDynamicVOCCard = ({count, label, color}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:color, paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <PricetagsOutline
                    color="#ffffff" 
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style={{ color:'#7F7F7F', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{color:'#7F7F7F', fontSize:'10px', textAlign: 'left'}} gutterBottom>
                    {label?.toUpperCase()}
                </Typography>
            </CardContent>
        </Card>
    )
}


export const RepnotesVOCCardCustomerBusiness = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#1E73C6", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <HappySharp
                    color="#ffffff"
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    CUSTOMER BUSINESS
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardProjectPipeline = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#FF7426", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <GitCommitSharp
                    color="#ffffff"
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{ color:'#1E73C6', fontSize:'11px', textAlign: 'left' }} gutterBottom>
                    PROJECT PIPELINE
                </Typography>
            </CardContent>
        </Card>
    )
}

export const RepnotesVOCCardMacroClimate = ({count}: VOCCardSummaryProps) => {
    return(
        <Card style={{ height: '80px', width: '166px', display: 'flex', backgroundColor: '#F0F0F6' }}>
            <CardContent style={{backgroundColor:"#7F7F7F", paddingLeft:'10px', paddingRight:'10px',  textAlign: 'center'}}>
                <CloudSharp
                    color="#ffffff"
                    title=""
                    height="40px"
                    width="40px"
                />
            </CardContent>
            <CardContent style={{width:'106px !important'}} >
                <Typography variant="h4" style= {{ color:'#1E73C6', fontSize:'18px', fontWeight: 'bold', textAlign: 'left' }}>
                   {count}
                </Typography>
                <Typography style={{ color:'#1E73C6', fontSize:'9px', textAlign: 'left' }} gutterBottom>
                    MACRO BUSINESS CLIMATE
                </Typography>
            </CardContent>
        </Card>
    )
}
