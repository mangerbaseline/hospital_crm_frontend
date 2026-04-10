export enum UserRole {
  SALES = "Sales",
  CUSTOMER_SUCCESS = "Customer Success",
  EXECUTIVE = "Executive",
  ADMIN = "Admin",
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponseData extends User {
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id: string;
}

export interface UserState {
  users: User[];
  selectedUser: User | null;
  isFetchingUsers: boolean;
  isGetSingleUserLoading: boolean;
  isCreateUserLoading: boolean;
  isUpdateUserLoading: boolean;
  isDeleteUserLoading: boolean;
  fetchUsersError: string | null;
  getSingleUserError: string | null;
  createUserError: string | null;
  updateUserError: string | null;
  deleteUserError: string | null;
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  page: number;
  limit: number;
  totalUsers?: number;
  totalHospitals?: number;
  totalContacts?: number;
  totalProducts?: number;
  totalGPOs?: number;
  totalIDNs?: number;
  totalDeals?: number;
  totalPages: number;
}

export interface HospitalForSelection {
  _id: string;
  idn: { _id: string; name: string };
  gpo: { _id: string; name: string };
  hospitalName: string;
}

export interface HospitalWithDeals {
  _id: string;
  hospitalName: string;
  city: string;
  state: string;
  zip: string;
  idn: { _id: string; name: string; user: string };
  gpo: { _id: string; name: string; user: string };
  deals: {
    products: {
      product: string;
      dealAmount: number;
      stage: string;
      expectedCloseDate: string;
      _id: string;
    }[];
  }[];
}

export interface Hospital {
  _id: string;
  idn: { _id: string; name: string };
  hospitalName: string;
  address: string;
  user: string;
  city: string;
  state: string;
  zip: string;
  gpo: { _id: string; name: string } | string;
  competitiveProduct?: string;
  teamHospital?: boolean;
  magnetHospital?: boolean;
  bedsWithMac?: number;
  ICUBeds?: number;
  products?: string[];
  notes?: string;
  contacts: {
    _id: string;
    firstName: string;
    lastName: string;
    designation: string;
    phoneNumber: string;
    email: string;
  }[];
  documents?: string[];
  deals?: {
    _id: string;
    products: {
      product: { _id: string; name: string } | any;
      dealAmount: number;
      stage: string;
      expectedCloseDate: string;
      _id: string;
      dealDate?: string;
    }[];
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  user: string;
  designation: string;
  hospital: string | Hospital;
  phoneNumber: string;
  email: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HospitalState {
  hospitals: HospitalForSelection[];
  hospitalsWithDeals: HospitalWithDeals[];
  selectedHospital: Hospital | null;
  isFetchingHospitals: boolean;
  isFetchingHospitalsWithDeals: boolean;
  isGetSingleHospitalLoading: boolean;
  isCreateHospitalLoading: boolean;
  fetchHospitalsError: string | null;
  fetchHospitalsWithDealsError: string | null;
  getSingleHospitalError: string | null;
  createHospitalError: string | null;
  page: number;
  limit: number;
  totalHospitals: number;
  totalPages: number;
}

export interface CreateHospitalPayload {
  idn: string;
  hospitalName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  gpo: string;
  competitiveProduct: string;
  teamHospital: boolean;
  magnetHospital: boolean;
  bedsWithMac: number;
  ICUBeds: number;
}

export interface ContactState {
  contacts: Contact[];
  selectedContact: Contact | null;
  isFetchingContacts: boolean;
  isCreateContactLoading: boolean;
  fetchContactsError: string | null;
  createContactError: string | null;
  page: number;
  limit: number;
  totalContacts: number;
  totalPages: number;
}

export interface CreateContactPayload {
  firstName: string;
  lastName: string;
  designation: string;
  hospital: string;
  phoneNumber: string;
  email: string;
  isPrimary: boolean;
}

export interface FetchContactsParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
}

export interface FetchHospitalsParams {
  idn?: string;
}

export interface FetchHospitalsDealsParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isFetchingProducts: boolean;
  isGetSingleProductLoading: boolean;
  isCreateProductLoading: boolean;
  isUpdateProductLoading: boolean;
  isDeleteProductLoading: boolean;
  fetchProductsError: string | null;
  getSingleProductError: string | null;
  createProductError: string | null;
  updateProductError: string | null;
  deleteProductError: string | null;
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: string;
}

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GPO {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GPOHospitalWithARR {
  _id: string;
  idn: { _id: string; name: string };
  gpo: string;
  hospitalName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  competitiveProduct?: string;
  teamHospital?: boolean;
  magnetHospital?: boolean;
  bedsWithMac?: number;
  ICUBeds?: number;
  totalExpectedARR?: number;
  expectedARRByProduct?: { name: string; amount: number }[];
}

export interface GPOWithDeals {
  _id: string;
  name: string;
  hospitals: GPOHospitalWithARR[];
  user: string;
  createdAt?: string;
  updatedAt?: string;
  totalHospitals?: number;
  gpoTotalExpectedARR?: number;
  gpoARRByProduct?: { name: string; amount: number }[];
}

export interface GPOState {
  gpos: GPO[];
  gposWithDeals: GPOWithDeals[];
  selectedGPO: GPO | null;
  isFetchingGPOs: boolean;
  isFetchingGPOsWithDeals: boolean;
  isGetSingleGPOLoading: boolean;
  isCreateGPOLoading: boolean;
  isUpdateGPOLoading: boolean;
  isDeleteGPOLoading: boolean;
  fetchGPOsError: string | null;
  fetchGPOsWithDealsError: string | null;
  getSingleGPOError: string | null;
  createGPOError: string | null;
  updateGPOError: string | null;
  deleteGPOError: string | null;
  page: number;
  limit: number;
  totalGPOs: number;
  totalPages: number;
}

export interface CreateGPOPayload {
  name: string;
}

export interface UpdateGPOPayload extends Partial<CreateGPOPayload> {
  id: string;
}

export interface FetchGPOsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FetchGPOsDealsParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
}

export interface IDN {
  _id: string;
  name: string;
}

export interface IDNHospitalWithARR {
  _id: string;
  idn: string;
  gpo: { _id: string; name: string };
  hospitalName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  competitiveProduct?: string;
  teamHospital?: boolean;
  magnetHospital?: boolean;
  bedsWithMac?: number;
  ICUBeds?: number;
  totalExpectedARR?: number;
  expectedARRByProduct?: { name: string; amount: number }[];
}

export interface IDNWithDeals {
  _id: string;
  name: string;
  hospitals: IDNHospitalWithARR[];
  user: string;
  createdAt?: string;
  updatedAt?: string;
  totalHospitals?: number;
  idnTotalExpectedARR?: number;
  idnARRByProduct?: { name: string; amount: number }[];
}

export interface IDNState {
  idns: IDN[];
  idnsWithDeals: IDNWithDeals[];
  selectedIDN: IDN | null;
  isFetchingIDNs: boolean;
  isFetchingIDNsWithDeals: boolean;
  isGetSingleIDNLoading: boolean;
  isCreateIDNLoading: boolean;
  isUpdateIDNLoading: boolean;
  isDeleteIDNLoading: boolean;
  fetchIDNsError: string | null;
  fetchIDNsWithDealsError: string | null;
  getSingleIDNError: string | null;
  createIDNError: string | null;
  updateIDNError: string | null;
  deleteIDNError: string | null;
  page: number;
  limit: number;
  totalIDNs: number;
  totalPages: number;
}

export interface CreateIDNPayload {
  name: string;
}

export interface UpdateIDNPayload extends Partial<CreateIDNPayload> {
  id: string;
}

export interface FetchIDNsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FetchIDNsDealsParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
}

export enum DealProductStage {
  DEMO = "Demo",
  CPA = "CPA",
  COMMITTEE = "Committee",
  TRIAL = "Trial",
  PENDING_DECISION = "Pending Decision",
  CLOSED_WON = "Closed Won",
  IMPLEMENTED = "Implemented",
}

export interface DealProduct {
  product: string | Product;
  dealAmount?: number;
  stage?: DealProductStage;
  expectedCloseDate?: string | Date;
}

export interface Deal {
  _id: string;
  hospital: string | Hospital;
  contact?: string | Contact;
  user: string | User;
  gpo: string | GPO;
  idn: string | IDN;
  products: DealProduct[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDealPayload {
  hospital: string;
  idn: string;
  gpo: string;
  contact?: string;
  products: {
    product: string;
    dealAmount?: number;
    stage?: DealProductStage;
    expectedCloseDate?: string | Date;
  }[];
  notes?: string;
}

export interface PipelineDeal {
  _id: string;
  dealId: string;
  hospital: {
    _id: string;
    idn: { _id: string; name: string };
    gpo: { _id: string; name: string };
    hospitalName: string;
    city: string;
    state: string;
    zip: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  product: {
    _id: string;
    name: string;
    description: string;
    Marketprice: number;
    createdAt: string;
    updatedAt: string;
  };
  dealAmount: number;
  stage: string | DealProductStage;
  expectedCloseDate: string;
  dealDate?: string;
}

export interface FetchAllDealsParams {
  userId?: string;
}

export interface ProductRevenue {
  ARR: number;
  productId: string;
  productName: string;
}

export interface FetchAllDealsResponse {
  success: boolean;
  totalDeals: number;
  totalHospitals: number;
  closedBusiness: number;
  productRevenue: ProductRevenue[];
  data: PipelineDeal[];
}

export interface UpdateDealStagePayload {
  hospitalId: string;
  dealId: string;
  productId: string;
  stage: string;
}

export interface DealState {
  isCreateDealLoading: boolean;
  createDealError: string | null;
  deals: PipelineDeal[];
  isFetchingDeals: boolean;
  fetchDealsError: string | null;
  isUpdateDealStageLoading: boolean;
  updateDealStageError: string | null;
  stats: {
    totalHospitals: number;
    closedBusiness: number;
    productRevenue: ProductRevenue[];
  } | null;
}
