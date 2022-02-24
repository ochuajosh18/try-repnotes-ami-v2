/**
 * Filter list for Quotes By Status Report
 */
import { DynamicQuotesByStatusType } from '../../../../store/report/quotesByStatus/types';
import { SalesPersonDetails } from '../../../../store/customerManagement/customer/types';
import { LocationDetails } from '../../../../store/customerManagement/location/types';
import { IndustryDetails } from '../../../../store/listManagement/industry/types';
import { CustomerTypeDetails } from '../../../../store/listManagement/customerType/types';
import { CompanyDetails } from '../../../../store/listManagement/company/types';
import {
    QuotesByStatusReportFiltersContainer,
    QuotesByStatusReportFilterGridContainer
} from './QuotesByStatusComponents';
import QuotesByStatusFilterPopover from './QuotesByStatusFilterPopover';

// global
import { RepnotesInput } from '../../../common/RepnotesInput';

// utils
import map from 'lodash/map';
import flatMap from 'lodash/flatMap';

interface QuotesByStatusFiltersProps {
    onQuotesByStatusInput: (field: string, value: DynamicQuotesByStatusType) => void;
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
}

const QuotesByStatusFilters = (props: QuotesByStatusFiltersProps) => {
    const { 
        onQuotesByStatusInput, salespersons, filterSelectedSalesperson,
        provinces, filterSelectedProvince, industries, filterSelectedIndustry,
        customerTypes, filterSelectedCustomerType, role, onExportClick,
        company, filterCompanies
    } = props;

    return (
        <QuotesByStatusReportFiltersContainer container spacing={3}>
            {role === 'SUPER ADMIN' && 
                <QuotesByStatusReportFilterGridContainer xs={3}>
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
                            onQuotesByStatusInput('filterSelectedCompany', e.target.value as string)
                        }}
                    />
                </QuotesByStatusReportFilterGridContainer>
            }
            {role.toLowerCase() !== 'sales engineer' && 
                <QuotesByStatusReportFilterGridContainer xs={3}>
                    <RepnotesInput
                        id="repnotes-salesperson-selection"
                        type="searchabledropdown"
                        label="Salesperson"
                        labelPosition="top"
                        value={filterSelectedSalesperson}
                        autocompleteOptions={map(salespersons, (f) => ({ label: f.name, value: f.id }))}
                        onAutocompleteChange={(e, o) => {
                            onQuotesByStatusInput('filterSelectedSalesperson', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                </QuotesByStatusReportFilterGridContainer>
            }
            <QuotesByStatusReportFilterGridContainer xs={3}>
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
                        onQuotesByStatusInput('filterSelectedProvince', o ? o.value : '');
                    }}
                    disableAutocompletePopover={true}
                />
            </QuotesByStatusReportFilterGridContainer>
            {role !== 'SUPER ADMIN' && 
                <QuotesByStatusReportFilterGridContainer xs={3}>
                    <RepnotesInput
                        id="repnotes-industry"
                        type="searchabledropdown"
                        label="Industry"
                        labelPosition="top"
                        value={filterSelectedIndustry}
                        autocompleteOptions={map(industries, (f) => ({ label: f.name, value: f.id }))}
                        onAutocompleteChange={(e, o) => {
                            onQuotesByStatusInput('filterSelectedIndustry', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                </QuotesByStatusReportFilterGridContainer>
            }
            <QuotesByStatusReportFilterGridContainer xs={3}>
                <QuotesByStatusFilterPopover onExportClick={onExportClick}>
                    {role === 'SUPER ADMIN' && 
                        <RepnotesInput
                        id="repnotes-industry"
                        type="searchabledropdown"
                        label="Industry"
                        labelPosition="top"
                        value={filterSelectedIndustry}
                        autocompleteOptions={map(industries, (f) => ({ label: f.name, value: f.id }))}
                        onAutocompleteChange={(e, o) => {
                            onQuotesByStatusInput('filterSelectedIndustry', o ? o.value : '');
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
                            onQuotesByStatusInput('filterSelectedCustomerType', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                   
                </QuotesByStatusFilterPopover>
            </ QuotesByStatusReportFilterGridContainer>
        </QuotesByStatusReportFiltersContainer>
    )
}

export default QuotesByStatusFilters;