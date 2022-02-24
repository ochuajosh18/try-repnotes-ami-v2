/**
 * Filter list for Actual vs Target Report
 */

import { 
    DynamicActualToTargetType, ProvinceDetails
} from '../../../../store/report/actualToTarget/types';
import { CompanyDetails } from '../../../../store/listManagement/company/types';
import { SalesPersonDetails } from '../../../../store/customerManagement/customer/types';
import {
     ActualToTargetReportFiltersContainer,
     ActualToTargetReportFilterGridContainer
} from './ActualToTargetComponents';
import ActualToTargetFilterPopover from './ActualToTargetFilterPopover';

// global
import { RepnotesInput } from '../../../common/RepnotesInput';
 
// utils
import map from 'lodash/map';

interface ActualToTargetFiltersProps {
    onActualToTargetInput: (field: string, value: DynamicActualToTargetType) => void;
    onExportClick: () => void;
    importActualToTargetData: (value: unknown) => void;
    role: string;
    company: string;
    filterCompanies: Array<CompanyDetails>;
    salespersons: Array<SalesPersonDetails>;
    filterSelectedSalesperson: string;
    filterSelectedGraphType: string;
    provinces: Array<ProvinceDetails>;
    filterSelectedProvince: string;
}

const ActualToTargetFilters = (props: ActualToTargetFiltersProps) => {
    const { 
        onActualToTargetInput, onExportClick, importActualToTargetData, company, filterCompanies,
        role, salespersons, filterSelectedSalesperson, provinces,
        filterSelectedProvince, filterSelectedGraphType
    } = props;

    return (
        <ActualToTargetReportFiltersContainer container spacing={2}>
            {role === 'SUPER ADMIN' && 
                <ActualToTargetReportFilterGridContainer xs={2}>
                    <RepnotesInput
                        id="repnotes-company-selection"
                        type="select"
                        label="Company Name"
                        labelPosition="top"
                        firstSelectOption={company !== '' ? "removeall" : ''}
                        value={company}
                        options={map(filterCompanies, (data) => ({
                            id: data.companyId,
                            name: data.name
                        }))}
                        onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                            onActualToTargetInput('filterSelectedCompany', e.target.value as string)
                        }}
                    />
                </ActualToTargetReportFilterGridContainer>
            }
            {role.toLowerCase() !== 'sales engineer' &&
                <ActualToTargetReportFilterGridContainer xs={2}>
                    <RepnotesInput
                         id="repnotes-salesperson-selection"
                         type="searchabledropdown"
                         label="Salesperson"
                         labelPosition="top"
                         value={filterSelectedSalesperson}
                         autocompleteOptions={map(salespersons, (f) => ({ label: f.name, value: f.id }))}
                         onAutocompleteChange={(e, o) => {
                            onActualToTargetInput('filterSelectedSalesperson', o ? o.value : '');
                         }}
                         disableAutocompletePopover={true}
                    />
                </ActualToTargetReportFilterGridContainer>
            }
            <ActualToTargetReportFilterGridContainer xs={2}>
                <RepnotesInput
                    id="repnotes-graphy-type-selection"
                    type="select"
                    label="Graph Type"
                    labelPosition="top"
                    firstSelectOption="None"
                    value={filterSelectedGraphType}
                    options={map(['YTD', 'QTD'], (t) => ({
                        id: t,
                        name: t
                    }))}
                    onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                        onActualToTargetInput('filterSelectedGraphType', e.target.value as string)
                    }}
                />
            </ActualToTargetReportFilterGridContainer>
            {false && 
                <ActualToTargetReportFilterGridContainer xs={2}>
                    <RepnotesInput
                       id="repnotes-province-selection"
                       type="searchabledropdown"
                       label="Province"
                       labelPosition="top"
                       value={filterSelectedProvince}
                       autocompleteOptions={map(provinces, (f) => ({ label: f.area, value: f.area }))}
                       onAutocompleteChange={(e, o) => {
                           onActualToTargetInput('filterSelectedProvince', o ? o.value : '');
                       }}
                       disableAutocompletePopover={true}
                    />
                </ActualToTargetReportFilterGridContainer>
            }
            <ActualToTargetReportFilterGridContainer xs={6}>
                <ActualToTargetFilterPopover 
                    onExportClick={onExportClick}
                    importActualToTargetData={importActualToTargetData}
                    role={false}
                >
                    {false && 
                        <RepnotesInput
                            id="repnotes-province-selection"
                            type="searchabledropdown"
                            label="Province"
                            labelPosition="top"
                            value={filterSelectedProvince}
                            autocompleteOptions={map(provinces, (f) => ({ label: f.area, value: f.area }))}
                            onAutocompleteChange={(e, o) => {
                                onActualToTargetInput('filterSelectedProvince', o ? o.value : '');
                            }}
                            disableAutocompletePopover={true}
                        />
                    }
                </ActualToTargetFilterPopover>
            </ ActualToTargetReportFilterGridContainer>
        </ActualToTargetReportFiltersContainer>
    )
}

export default ActualToTargetFilters;