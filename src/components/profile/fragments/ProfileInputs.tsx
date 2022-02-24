import { RepnotesInput } from '../../common/RepnotesInput';
import { ProfileInputsContainer} from './ProfileComponents';
import Box from '@material-ui/core/Box';
import moment from 'moment';
interface ProfileInputsProps {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    memberSince: string | Date;
}

const ProfileInputs = (props: ProfileInputsProps) => {
    const { firstName, lastName, email, role, memberSince } = props;
    return (
        <ProfileInputsContainer>
            <Box width="60%">
                <RepnotesInput id="first-name" type="text" labelPosition="left" label="First Name" value={firstName} onChange={() => {}} disabled/>
                <RepnotesInput id="last-name" type="text" labelPosition="left" label="Last Name" value={lastName} onChange={() => {}} disabled />
                <RepnotesInput id="email" type="text" labelPosition="left" label="Email" value={email} onChange={() => {}} disabled />
                <RepnotesInput id="role" type="text" labelPosition="left" label="Role" value={role} onChange={() => {}} disabled />
            </Box>
            <Box fontSize="13px" marginTop="8px">Member since {moment(memberSince).format('MMM[.] YYYY')}</Box>
        </ProfileInputsContainer>
    )
}

export default ProfileInputs;