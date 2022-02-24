/**
 * Filter list for Product Performance - Voice of Customers Report
 */
import { CustomerDetails, SalesPersonDetails } from '../../../store/customerManagement/customer/types';
import { DynamicDashboardType } from '../../../store/dashboard/types';
import { LocationDetails } from '../../../store/customerManagement/location/types';
import { CompanyDetails } from '../../../store/listManagement/company/types';
import { DashboardFilterGridContainer, DashboardFiltersContainer } from '../RepnotesDashboardComponent';

// global
import { RepnotesInput } from '../../common/RepnotesInput';

// utils
import map from 'lodash/map';
import flatMap from 'lodash/flatMap';

interface DashboardFiltersProps {
    onDashboardInput: (field: string, value: DynamicDashboardType) => void;
    role: string;
    filterCompanies: Array<CompanyDetails>;
    company: string;
    salespersons: Array<SalesPersonDetails>;
    filterSelectedSalesperson: string;
    provinces: Array<LocationDetails>;
    filterSelectedProvince: string;
    customers: Array<CustomerDetails>;
    filterSelectedCustomer: string;
}

const DashboardFilters = (props: DashboardFiltersProps) => {
    const { 
        onDashboardInput, salespersons, filterSelectedSalesperson,
        provinces, filterSelectedProvince, role,
        company, filterCompanies, filterSelectedCustomer, customers
    } = props;

    return (
        <DashboardFiltersContainer container spacing={3}>
            {role === 'SUPER ADMIN' && 
                <DashboardFilterGridContainer xs={3}>
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
                            onDashboardInput('filterSelectedCompany', e.target.value as string)
                        }}
                    />
                </DashboardFilterGridContainer>
            }
            {role.toLowerCase() !== 'sales engineer' &&
                <DashboardFilterGridContainer xs={3}>
                    <RepnotesInput
                             id="repnotes-salesperson-selection"
                             type="searchabledropdown"
                             label="Salesperson"
                             labelPosition="top"
                             value={filterSelectedSalesperson}
                             autocompleteOptions={map(salespersons, (f) => ({ label: f.name, value: f.id }))}
                             onAutocompleteChange={(e, o) => {
                                onDashboardInput('filterSelectedSalesperson', o ? o.value : '');
                             }}
                             disableAutocompletePopover={true}
                    />
                </DashboardFilterGridContainer>
            }
            <DashboardFilterGridContainer xs={3}>
                <RepnotesInput
                    id="repnotes-customer-selection"
                    type="searchabledropdown"
                    label="Customer"
                    labelPosition="top"
                    firstSelectOption="all"
                    value={filterSelectedCustomer}
                    autocompleteOptions={map(customers, (f) => ({ label: f.name, value: f.id }))}
                    onAutocompleteChange={(e, o) => {
                        onDashboardInput('filterSelectedCustomer', o ? o.value : '');
                    }}
                    disableAutocompletePopover={true}
                />
            </DashboardFilterGridContainer>
            <DashboardFilterGridContainer xs={3}>
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
                        onDashboardInput('filterSelectedProvince', o ? o.value : '');
                    }}
                    disableAutocompletePopover={true}
                />
            </DashboardFilterGridContainer>
        </DashboardFiltersContainer>
    )
}

export default DashboardFilters;