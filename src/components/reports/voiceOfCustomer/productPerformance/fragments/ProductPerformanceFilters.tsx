/**
 * Filter list for Product Performance - Voice of Customers Report
 */
import { DynamicProductPerformanceType } from '../../../../../store/report/voiceOfCustomer/productPerformance/types';
import { CustomerDetails, SalesPersonDetails } from '../../../../../store/customerManagement/customer/types';
import { LocationDetails } from '../../../../../store/customerManagement/location/types';
import { IndustryDetails } from '../../../../../store/listManagement/industry/types';
import { CustomerTypeDetails } from '../../../../../store/listManagement/customerType/types';
import { ProductFamilyDetails } from '../../../../../store/listManagement/productFamily/types';
import { CompanyDetails } from '../../../../../store/listManagement/company/types';
import {
    ProductPerformanceReportFiltersContainer,
    ProductPerformanceReportFilterGridContainer
} from './ProductPerformanceComponents';
import ProductPerformanceFilterPopover from './ProductPerformanceFilterPopover';

// global
import { RepnotesInput } from '../../../../common/RepnotesInput';

// utils
import map from 'lodash/map';
import flatMap from 'lodash/flatMap';
import { ProductDetails } from '../../../../../store/productManagement/product/types';

interface ProductPerformanceFiltersProps {
    onProductPerformanceInput: (field: string, value: DynamicProductPerformanceType) => void;
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
    customers: Array<CustomerDetails>;
    filterSelectedCustomer: string;
    models: Array<ProductDetails>;
    filterSelectedModel: string;
    productFamilies: Array<ProductFamilyDetails>;
    filterSelectedProductFamily: string;
    filterSelectedRating: string;
    filterSelectedServiceRanking: string
}

const ProductPerformanceFilters = (props: ProductPerformanceFiltersProps) => {
    const { 
        onProductPerformanceInput, salespersons, filterSelectedSalesperson,
        provinces, filterSelectedProvince, industries, filterSelectedIndustry,
        customerTypes, filterSelectedCustomerType, productFamilies, role,
        filterSelectedProductFamily, filterSelectedRating, onExportClick,
        company, filterCompanies, filterSelectedCustomer, customers, filterSelectedModel,
        models
    } = props;

    return (
        <ProductPerformanceReportFiltersContainer container spacing={3}>
            {role === 'SUPER ADMIN' && 
                <ProductPerformanceReportFilterGridContainer xs={3}>
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
                            onProductPerformanceInput('filterSelectedCompany', e.target.value as string)
                        }}
                    />
                </ProductPerformanceReportFilterGridContainer>
            }
            {role.toLowerCase() !== 'sales engineer' &&
                <ProductPerformanceReportFilterGridContainer xs={3}>
                    <RepnotesInput
                             id="repnotes-salesperson-selection"
                             type="searchabledropdown"
                             label="Salesperson"
                             labelPosition="top"
                             value={filterSelectedSalesperson}
                             autocompleteOptions={map(salespersons, (f) => ({ label: f.name, value: f.id }))}
                             onAutocompleteChange={(e, o) => {
                                onProductPerformanceInput('filterSelectedSalesperson', o ? o.value : '');
                             }}
                             disableAutocompletePopover={true}
                    />
                </ProductPerformanceReportFilterGridContainer>
            }
            <ProductPerformanceReportFilterGridContainer xs={3}>
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
                        onProductPerformanceInput('filterSelectedProvince', o ? o.value : '');
                    }}
                    disableAutocompletePopover={true}
                />
            </ProductPerformanceReportFilterGridContainer>
            {role !== 'SUPER ADMIN' && 
                <ProductPerformanceReportFilterGridContainer xs={3}>
                    <RepnotesInput
                        id="repnotes-industry"
                        type="searchabledropdown"
                        label="Industry"
                        labelPosition="top"
                        value={filterSelectedIndustry}
                        autocompleteOptions={map(industries, (f) => ({ label: f.name, value: f.id }))}
                        onAutocompleteChange={(e, o) => {
                            onProductPerformanceInput('filterSelectedIndustry', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                </ProductPerformanceReportFilterGridContainer>
            }
            <ProductPerformanceReportFilterGridContainer xs={3}>
                <ProductPerformanceFilterPopover onExportClick={onExportClick}>
                    {role === 'SUPER ADMIN' && 
                        <RepnotesInput
                            id="repnotes-industry-selection"
                            type="searchabledropdown"
                            label="Industry"
                            labelPosition="top"
                            value={filterSelectedIndustry}
                            autocompleteOptions={map(industries, (f) => ({ label: f.name, value: f.id }))}
                            onAutocompleteChange={(e, o) => {
                                onProductPerformanceInput('filterSelectedIndustry', o ? o.value : '');
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
                            onProductPerformanceInput('filterSelectedCustomerType', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                    <RepnotesInput
                        id="repnotes-product-family-selection"
                        type="searchabledropdown"
                        label="Product Family"
                        labelPosition="top"
                        firstSelectOption="all"
                        value={filterSelectedProductFamily}
                        autocompleteOptions={map(productFamilies, (f) => ({ label: f.name, value: f.id }))}
                        onAutocompleteChange={(e, o) => {
                            onProductPerformanceInput('filterSelectedProductFamily', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                    {/* <RepnotesInput
                        id="repnotes-ranking-selection"
                        type="select"
                        label="Service Ranking"
                        labelPosition="top"
                        firstSelectOption="all"
                        value={filterSelectedServiceRanking}
                        options={map([1,2,3,4,5], (n) => ({
                            id: n,
                            name: n
                        }))}
                        onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                            onProductPerformanceInput('filterSelectedServiceRanking', e.target.value as string)
                        }}
                    /> */}
                    <RepnotesInput
                        id="repnotes-customer-selection"
                        type="searchabledropdown"
                        label="Customer"
                        labelPosition="top"
                        firstSelectOption="all"
                        value={filterSelectedCustomer}
                        autocompleteOptions={map(customers, (f) => ({ label: f.name, value: f.id }))}
                        onAutocompleteChange={(e, o) => {
                            onProductPerformanceInput('filterSelectedCustomer', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                    <RepnotesInput
                        id="repnotes-model-selection"
                        type="searchabledropdown"
                        label="Model"
                        labelPosition="top"
                        value={filterSelectedModel}
                        autocompleteOptions={map(models, (f) => ({ label: f.modelName, value: f.modelName }))}
                        onAutocompleteChange={(e, o) => {
                            onProductPerformanceInput('filterSelectedModel', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                    <RepnotesInput
                        id="repnotes-rating-selection"
                        type="select"
                        label="Rating"
                        labelPosition="top"
                        firstSelectOption="all"
                        value={filterSelectedRating}
                        options={map([1,2,3,4,5], (n) => ({
                            id: n,
                            name: n
                        }))}
                        onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                            onProductPerformanceInput('filterSelectedRating', e.target.value as string)
                        }}
                    />
                </ProductPerformanceFilterPopover>
            </ ProductPerformanceReportFilterGridContainer>
        </ProductPerformanceReportFiltersContainer>
    )
}

export default ProductPerformanceFilters;