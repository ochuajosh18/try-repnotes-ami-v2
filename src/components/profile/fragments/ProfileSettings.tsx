import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DynamicProfileType } from '../../../store/profile/types';
import { RepnotesInput } from '../../common/RepnotesInput';
import { RepnotesDefaultButton, RepnotesPrimaryButton } from '../../common/RepnotesButton';
import { ProfileSettingsContainer, ProfileSettingsStrengthBox, ProfileSettingsStrengthContainer } from './ProfileComponents';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

interface ProfileSettingsProps {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    onProfileInput: (field: string, value: DynamicProfileType) => void;
    onPasswordSave: () => void;
    loading: boolean;
}

const ProfileSettings = (props: ProfileSettingsProps) => {
    const [passwordStrength, setPasswordStrength] = useState<number>(0);
    const [strengthVisible, setStrengthVisible] = useState(false);
    const { oldPassword, newPassword, confirmNewPassword, loading, onProfileInput, onPasswordSave } = props;
    
    useEffect(() => {
        if (newPassword) {
            let strength = 0;
            if (/(?=.*[a-z])/.test(newPassword)) strength += 0.2;
            if (/(?=.*[A-Z])/.test(newPassword)) strength += 0.2;
            if (/(?=.*\d)/.test(newPassword)) strength += 0.2;
            if (/(?=.*[-+_!@#$%^&*.,?])/.test(newPassword)) strength += 0.2;
            if (newPassword.length >= 8) strength += 0.2;
            setPasswordStrength(strength);
        }
        else setPasswordStrength(0);
    }, [passwordStrength, oldPassword, newPassword, confirmNewPassword]);

    return (
        <ProfileSettingsContainer>
            {loading ?
                <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress style={{ width: 40, height: 40 }} />
                </Box>
                :
                <>
                    <Box width="60%" display="flex" flexDirection="column">
                        <RepnotesInput 
                            id="old-password" 
                            type="password" 
                            labelPosition="left" 
                            label="Old Password" 
                            value={oldPassword} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProfileInput('oldPassword', e.target.value)} 
                        />
                        <RepnotesInput 
                            id="new-password" 
                            type="password" 
                            labelPosition="left" 
                            label="New Password" 
                            value={newPassword} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProfileInput('newPassword', e.target.value)} 
                            onFocus={() => setStrengthVisible(true)}
                            onBlur={() => setStrengthVisible(false)}
                        />
                        {strengthVisible &&
                            <Grid container>
                                <Grid item xs={4} />
                                <Grid item xs={8}>
                                    <ProfileSettingsStrengthContainer>
                                        <ProfileSettingsStrengthBox width={`${passwordStrength * 100}%`} bgcolor={passwordStrength >= 0.8 ? '#06bf06' : passwordStrength >= 0.6 ? '#ffa200' : '#de1616'} />
                                    </ProfileSettingsStrengthContainer>
                                </Grid>
                            </Grid>
                        }
                        <RepnotesInput 
                            id="confirm-new-password" 
                            type="password"
                            labelPosition="left" 
                            label="Confirm Password" 
                            value={confirmNewPassword} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onProfileInput('confirmNewPassword', e.target.value)} 
                        />
                        <Box alignSelf="flex-end" marginTop="8px">
                            <Link to="/dashboard" style={{ textTransform: 'none', textDecoration: 'none' }}>
                                <RepnotesDefaultButton style={{ marginRight: 0, width: 40, minWidth: 40 }}>
                                    Cancel
                                </RepnotesDefaultButton>
                            </Link>
                            <RepnotesPrimaryButton style={{ marginRight: 0, marginTop: 1, width: 40, minWidth: 40 }} onClick={onPasswordSave}>
                                Save
                            </RepnotesPrimaryButton>
                        </Box>
                    </Box>
                    <Box width="calc(40% - 24px)" marginLeft="16px" marginRight="8px" marginTop="6px" boxSizing="border-box" padding="16px" border="1px solid #E7E7E7">
                        <Box boxSizing="border-box" borderBottom="1px solid #E7E7E7" paddingBottom="12px" fontSize="18px" fontWeight="bold" marginBottom="12px">Password Guidelines</Box>
                        <Box fontSize="13px" color={/(?=.*[a-z])/.test(newPassword) ? 'green' : '#000'}>A lowercase letter</Box>
                        <Box fontSize="13px" color={/(?=.*[A-Z])/.test(newPassword) ? 'green' : '#000'}>An uppercase letter</Box>
                        <Box fontSize="13px" color={/(?=.*\d)/.test(newPassword) ? 'green' : '#000'}>A number</Box>
                        <Box fontSize="13px" color={newPassword.length >= 8 ? 'green' : '#000'}>8 - 36 characters</Box>
                        <Box fontSize="13px" color={/(?=.*[-+_!@#$%^&*.,?])/.test(newPassword) ? 'green' : '#000'}>A special character</Box>
                    </Box>
                </>
            }
        </ProfileSettingsContainer>
    )
}

export default ProfileSettings;