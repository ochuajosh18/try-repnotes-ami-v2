import { 
    RepnotesSummaryCardsContainer, 
    RepnotesSummaryCard,
    RepnotesSummaryCardIconContainer,
    RepnotesSummaryCardDataContainer
} from '../../../common/RepnotesGeneralComponents';
import Information from 'react-ionicons/lib/Information';
import Box from '@material-ui/core/Box';

import { currencyConverter } from '../../../../util/utils';

interface QuotesByStatusStatusesProps {
    closeLost: string | number;
    withdraw: string | number;
    openQuotes: string | number;
    closeWon: string | number;
    viewType: string;
}

const QuotesByStatusStatuses = (props: QuotesByStatusStatusesProps) => {
    return (
        <RepnotesSummaryCardsContainer>
            <RepnotesSummaryCard>
                <RepnotesSummaryCardIconContainer bgcolor="#FFBD35">
                    <Information
                        color="#ffffff" 
                        title=""
                        height="40px"
                        width="40px"
                    />
                </RepnotesSummaryCardIconContainer>
                <RepnotesSummaryCardDataContainer>
                    <Box fontSize="13px" color="#1E73C6" fontWeight="bold">{(props.viewType !== 'Dollar') ? props.openQuotes : currencyConverter(props.openQuotes as number)}</Box>
                    <Box fontSize="11px" color="#1E73C6">OPEN QUOTES</Box>
                </RepnotesSummaryCardDataContainer>
            </RepnotesSummaryCard>
            <RepnotesSummaryCard>
                <RepnotesSummaryCardIconContainer bgcolor="#EC7D33">
                    <Information
                        color="#ffffff" 
                        title=""
                        height="40px"
                        width="40px"
                    />
                </RepnotesSummaryCardIconContainer>
                <RepnotesSummaryCardDataContainer>
                    <Box fontSize="13px" color="#1E73C6" fontWeight="bold">{(props.viewType !== 'Dollar') ? props.closeLost : currencyConverter(props.closeLost as number)}</Box>
                    <Box fontSize="11px" color="#1E73C6">CLOSE LOST</Box>
                </RepnotesSummaryCardDataContainer>
            </RepnotesSummaryCard>
            <RepnotesSummaryCard>
                <RepnotesSummaryCardIconContainer bgcolor="#2A9DD7">
                    <Information
                        color="#ffffff" 
                        title=""
                        height="40px"
                        width="40px"
                    />
                </RepnotesSummaryCardIconContainer>
                <RepnotesSummaryCardDataContainer>
                    <Box fontSize="13px" color="#1E73C6" fontWeight="bold">{(props.viewType !== 'Dollar') ? props.closeWon : currencyConverter(props.closeWon as number)}</Box>
                    <Box fontSize="11px" color="#1E73C6">CLOSE WON</Box>
                </RepnotesSummaryCardDataContainer>
            </RepnotesSummaryCard>
            <RepnotesSummaryCard>
                <RepnotesSummaryCardIconContainer bgcolor="#1E73C6">
                    <Information
                        color="#ffffff" 
                        title=""
                        height="40px"
                        width="40px"
                    />
                </RepnotesSummaryCardIconContainer>
                <RepnotesSummaryCardDataContainer>
                    <Box fontSize="13px" color="#1E73C6" fontWeight="bold">{(props.viewType !== 'Dollar') ? props.withdraw : currencyConverter(props.withdraw as number)}</Box>
                    <Box fontSize="11px" color="#1E73C6">WITHDRAW</Box>
                </RepnotesSummaryCardDataContainer>
            </RepnotesSummaryCard>
        </RepnotesSummaryCardsContainer>
    )
}

export default QuotesByStatusStatuses;