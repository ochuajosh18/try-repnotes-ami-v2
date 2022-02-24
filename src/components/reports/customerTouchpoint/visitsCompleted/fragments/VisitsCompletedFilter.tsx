/**
 * Filter list for Customer Touchpoint - Percentage of Calls/Visits Completed
 */
import { DynamicVisitsCompletedType } from '../../../../../store/report/customerTouchpoint/visitsCompleted/types';
import { SalesPersonDetails } from '../../../../../store/customerManagement/customer/types';
import { LocationDetails } from '../../../../../store/customerManagement/location/types';
import { IndustryDetails } from '../../../../../store/listManagement/industry/types';
import { CustomerTypeDetails } from '../../../../../store/listManagement/customerType/types';
import { CompanyDetails } from '../../../../../store/listManagement/company/types';
import {
    VisitsCompletedReportFiltersContainer,
    VisitsCompletedReportFilterGridContainer,
} from './VisitsCompletedComponents';
import VisitsCompletedFilterPopover from './VisitsCompletedFilterPopover';

// global
import { RepnotesInput } from '../../../../common/RepnotesInput';

import map from 'lodash/map';
import flatMap from 'lodash/flatMap';

interface VisitsCompletedFiltersProps {
    onVisitsCompletedInput: (field: string, value: DynamicVisitsCompletedType) => void;
    onExportClick: () => void;
    role: string;
    filterCompanies: Array<CompanyDetails>;
    company: string;
    salespersons: Array<SalesPersonDetails>;
    filterSelectedSalesperson: string;
    provinces: Array<LocationDetails>;
    filterSelectedProvince: string;
    industries: Array<IndustryDetails>;
    filterSelectedIndustry: string;
    customerTypes: Array<CustomerTypeDetails>;
    filterSelectedCustomerType: string;
    filterSelectedViewType: string;
}

const VisitsCompletedFilters = (props: VisitsCompletedFiltersProps) => {
    const { 
        onVisitsCompletedInput, salespersons, filterSelectedSalesperson,
        provinces, filterSelectedProvince, industries, filterSelectedIndustry,
        customerTypes, filterSelectedCustomerType, role, onExportClick,
        company, filterCompanies, filterSelectedViewType
    } = props;

    return (
        <VisitsCompletedReportFiltersContainer container spacing={3}>
            {role === 'SUPER ADMIN' && 
                <VisitsCompletedReportFilterGridContainer xs={3}>
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
                            onVisitsCompletedInput('filterSelectedCompany', e.target.value as string)
                        }}
                    />
                </VisitsCompletedReportFilterGridContainer>
            }
            {role.toLowerCase() !== 'sales engineer' && 
                <VisitsCompletedReportFilterGridContainer xs={3}>
                    <RepnotesInput
                        id="repnotes-salesperson-selection"
                        type="searchabledropdown"
                        label="Salesperson"
                        labelPosition="top"
                        value={filterSelectedSalesperson}
                        autocompleteOptions={map(salespersons, (f) => ({ label: f.name, value: f.id }))}
                        onAutocompleteChange={(e, o) => {
                            onVisitsCompletedInput('filterSelectedSalesperson', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                </VisitsCompletedReportFilterGridContainer>
            }
            <VisitsCompletedReportFilterGridContainer xs={3}>
                <RepnotesInput
                    id="repnotes-province-selection"
                    type="searchabledropdown"
                    label="Province"
                    labelPosition="top"
                    value={filterSelectedProvince}
                    autocompleteOptions={flatMap(provinces, (area) => flatMap(area.province, (province) => ({
                        value: province.name,
                        label: province.name
                    })))}
                    onAutocompleteChange={(e, o) => {
                        onVisitsCompletedInput('filterSelectedProvince', o ? o.value : '');
                    }}
                    disableAutocompletePopover={true}
                />
            </VisitsCompletedReportFilterGridContainer>
            {role !== 'SUPER ADMIN' && 
                <VisitsCompletedReportFilterGridContainer xs={3}>
                    <RepnotesInput
                        id="repnotes-industry"
                        type="searchabledropdown"
                        label="Industry"
                        labelPosition="top"
                        value={filterSelectedIndustry}
                        autocompleteOptions={map(industries, (f) => ({ label: f.name, value: f.id }))}
                        onAutocompleteChange={(e, o) => {
                            onVisitsCompletedInput('filterSelectedIndustry', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                </VisitsCompletedReportFilterGridContainer>
            }
            <VisitsCompletedReportFilterGridContainer xs={3}>
                <VisitsCompletedFilterPopover onExportClick={onExportClick}>
                    {role === 'SUPER ADMIN' && 
                        <RepnotesInput
                            id="repnotes-industry"
                            type="searchabledropdown"
                            label="Industry"
                            labelPosition="top"
                            value={filterSelectedIndustry}
                            autocompleteOptions={map(industries, (f) => ({ label: f.name, value: f.id }))}
                            onAutocompleteChange={(e, o) => {
                                onVisitsCompletedInput('filterSelectedIndustry', o ? o.value : '');
                            }}
                            disableAutocompletePopover={true}
                        />
                    }
                    <RepnotesInput
                        id="repnotes-customer-type"
                        type="searchabledropdown"
                        label="Customer Type"
                        labelPosition="top"
                        value={filterSelectedCustomerType}
                        autocompleteOptions={map(customerTypes, (f) => ({ label: f.name, value: f.id }))}
                        onAutocompleteChange={(e, o) => {
                            onVisitsCompletedInput('filterSelectedCustomerType', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                    <RepnotesInput
                        id="repnotes-view-type-selection"
                        type="select"
                        label="View Type"
                        labelPosition="top"
                        value={filterSelectedViewType}
                        options={map(['Weekly', 'Monthly', 'Yearly'], (t) => ({
                            id: t,
                            name: t
                        }))}
                        onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                            onVisitsCompletedInput('filterSelectedViewType', e.target.value as string)
                        }}
                    />
                </VisitsCompletedFilterPopover>
            </ VisitsCompletedReportFilterGridContainer>
        </VisitsCompletedReportFiltersContainer>
    )
}

export default VisitsCompletedFilters;