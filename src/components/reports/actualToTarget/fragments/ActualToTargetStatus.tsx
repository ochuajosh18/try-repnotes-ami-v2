import { ActualVsTargetStatus } from '../../../../store/report/actualToTarget/types';
import { ActualToTargetStatusContainer, ActualToTargetStatusGraphContainer } from './ActualToTargetComponents';
import ActualToTargetStatusGraph from './ActualToTargetStatusGraph';
import { 
    RepnotesSummaryCardsContainer, 
    RepnotesSummaryCard,
    RepnotesSummaryCardIconContainer,
    RepnotesSummaryCardDataContainer
} from '../../../common/RepnotesGeneralComponents';
import Information from 'react-ionicons/lib/Information';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { currencyConverter } from '../../../../util/utils';

interface ActualToTargetStatusProps {
    actualVsTargetData?: ActualVsTargetStatus;
    type: string;
}

const ActualToTargetStatus = (props: ActualToTargetStatusProps) => {
    return (
        <ActualToTargetStatusContainer>
            <Grid container>
                <Typography variant="h6" style={{ fontWeight: 550, paddingBottom: 15 }}>Summary Per Status</Typography>
            </Grid>
            <RepnotesSummaryCardsContainer>
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
                        <Box fontSize="14px" color="#1E73C6" fontWeight="bold">{currencyConverter(props.actualVsTargetData ? props.actualVsTargetData.yearToDate.summaryWholeYearTarget : 0)}</Box>
                        <Box fontSize="11px" color="#1E73C6">WHOLE YEAR TARGET</Box>
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
                        <Box fontSize="14px" color="#1E73C6" fontWeight="bold">{currencyConverter(props.actualVsTargetData ? props.actualVsTargetData.yearToDate.summaryActualSalesToDate : 0)}</Box>
                        <Box fontSize="11px" color="#1E73C6">ACTUAL SALES TO DATE</Box>
                    </RepnotesSummaryCardDataContainer>
                </RepnotesSummaryCard>
                <RepnotesSummaryCard>
                    <RepnotesSummaryCardIconContainer bgcolor="#7F7F7F">
                        <Information
                            color="#ffffff" 
                            title=""
                            height="40px"
                            width="40px"
                        />
                    </RepnotesSummaryCardIconContainer>
                    <RepnotesSummaryCardDataContainer>
                        <Box fontSize="14px" color="#1E73C6" fontWeight="bold">{currencyConverter(props.actualVsTargetData ? props.actualVsTargetData.yearToDate.summaryBacklogToDate : 0)}</Box>
                        <Box fontSize="11px" color="#1E73C6">BACKLOG TO DATE</Box>
                    </RepnotesSummaryCardDataContainer>
                </RepnotesSummaryCard>
            </RepnotesSummaryCardsContainer>
            <ActualToTargetStatusGraphContainer>
                <ActualToTargetStatusGraph
                    data={props.actualVsTargetData}
                    type={props.type}
                />
            </ActualToTargetStatusGraphContainer>
        </ActualToTargetStatusContainer>
    )
}

export default ActualToTargetStatus;