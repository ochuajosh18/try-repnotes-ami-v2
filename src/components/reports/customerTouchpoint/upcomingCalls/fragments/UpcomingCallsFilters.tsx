/**
 * Filter list for Product Performance - Voice of Customers Report
 */
import { DynamicUpcomingCallsType } from '../../../../../store/report/customerTouchpoint/upcomingCalls/types';
import { SalesPersonDetails } from '../../../../../store/customerManagement/customer/types';
import { LocationDetails } from '../../../../../store/customerManagement/location/types';
import { IndustryDetails } from '../../../../../store/listManagement/industry/types';
import { CustomerTypeDetails } from '../../../../../store/listManagement/customerType/types';
import { CompanyDetails } from '../../../../../store/listManagement/company/types';
import {
    UpcomingCallsReportFiltersContainer,
    UpcomingCallsReportFilterGridContainer
} from './UpcomingCallsComponents';
import UpcomingCallsFilterPopover from './UpcomingCallsFilterPopover';

// global
import { RepnotesInput } from '../../../../common/RepnotesInput';

// utils
import map from 'lodash/map';
import flatMap from 'lodash/flatMap';

interface UpcomingCallsFiltersProps {
    onUpcomingCallsInput: (field: string, value: DynamicUpcomingCallsType) => void;
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

const UpcomingCallsFilters = (props: UpcomingCallsFiltersProps) => {
    const { 
        onUpcomingCallsInput, salespersons, filterSelectedSalesperson,
        provinces, filterSelectedProvince, industries, filterSelectedIndustry,
        customerTypes, filterSelectedCustomerType, role, onExportClick,
        company, filterCompanies, filterSelectedViewType
    } = props;

    return (
        <UpcomingCallsReportFiltersContainer container spacing={3}>
            {role === 'SUPER ADMIN' && 
                <UpcomingCallsReportFilterGridContainer xs={3}>
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
                            onUpcomingCallsInput('filterSelectedCompany', e.target.value as string)
                        }}
                    />
                </UpcomingCallsReportFilterGridContainer>
            }
            {role.toLowerCase() !== 'sales engineer' && 
                <UpcomingCallsReportFilterGridContainer xs={3}>
                    <RepnotesInput
                        id="repnotes-salesperson-selection"
                        type="searchabledropdown"
                        label="Salesperson"
                        labelPosition="top"
                        value={filterSelectedSalesperson}
                        autocompleteOptions={map(salespersons, (f) => ({ label: f.name, value: f.id }))}
                        onAutocompleteChange={(e, o) => {
                            onUpcomingCallsInput('filterSelectedSalesperson', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                </UpcomingCallsReportFilterGridContainer>
            }
            <UpcomingCallsReportFilterGridContainer xs={3}>
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
                        onUpcomingCallsInput('filterSelectedProvince', o ? o.value : '');
                    }}
                    disableAutocompletePopover={true}
                />
            </UpcomingCallsReportFilterGridContainer>
            {role !== 'SUPER ADMIN' && 
                <UpcomingCallsReportFilterGridContainer xs={3}>
                    <RepnotesInput
                      id="repnotes-industry"
                      type="searchabledropdown"
                      label="Industry"
                      labelPosition="top"
                      value={filterSelectedIndustry}
                      autocompleteOptions={map(industries, (f) => ({ label: f.name, value: f.id }))}
                      onAutocompleteChange={(e, o) => {
                          onUpcomingCallsInput('filterSelectedIndustry', o ? o.value : '');
                      }}
                      disableAutocompletePopover={true}
                    />
                </UpcomingCallsReportFilterGridContainer>
            }
            <UpcomingCallsReportFilterGridContainer xs={3}>
                <UpcomingCallsFilterPopover onExportClick={onExportClick}>
                    {role === 'SUPER ADMIN' && 
                        <RepnotesInput
                            id="repnotes-industry"
                            type="searchabledropdown"
                            label="Industry"
                            labelPosition="top"
                            value={filterSelectedIndustry}
                            autocompleteOptions={map(industries, (f) => ({ label: f.name, value: f.id }))}
                            onAutocompleteChange={(e, o) => {
                                onUpcomingCallsInput('filterSelectedIndustry', o ? o.value : '');
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
                             onUpcomingCallsInput('filterSelectedCustomerType', o ? o.value : '');
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
                            onUpcomingCallsInput('filterSelectedViewType', e.target.value as string)
                        }}
                    />
                </UpcomingCallsFilterPopover>
            </ UpcomingCallsReportFilterGridContainer>
        </UpcomingCallsReportFiltersContainer>
    )
}

export default UpcomingCallsFilters;