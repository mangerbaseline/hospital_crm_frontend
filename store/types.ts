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
  active: boolean;
}

export interface UpdateUserStatusPayload {
  id: string;
  active: boolean;
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
  adminUsers: User[];
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
  isUpdatingUserStatus: boolean;
  updateUserStatusError: string | null;
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
  totalAdminUsers: number;
  totalAdminPages: number;
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
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
      quantity?: number;
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
  beds: string;
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
      quantity?: number;
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
  product?: Product[];
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
  isUpdateHospitalLoading: boolean;
  fetchHospitalsError: string | null;
  fetchHospitalsWithDealsError: string | null;
  getSingleHospitalError: string | null;
  createHospitalError: string | null;
  updateHospitalError: string | null;
  page: number;
  limit: number;
  totalHospitals: number;
  totalPages: number;
  selectionPage: number;
  selectionTotalPages: number;
  hasMoreSelection: boolean;
}

export interface CreateHospitalPayload {
  idn: string;
  hospitalName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  gpo: string;
  userId?: string;
  // competitiveProduct: string;
  // teamHospital: boolean;
  // magnetHospital: boolean;
  // bedsWithMac: number;
  // ICUBeds: number;
}

export interface UpdateHospitalPayload extends Partial<CreateHospitalPayload> {
  id: string;
  user?: string;
}

export interface ContactState {
  contacts: Contact[];
  selectedContact: Contact | null;
  isFetchingContacts: boolean;
  isCreateContactLoading: boolean;
  isDeleteContactLoading: boolean;
  isGetSingleContactLoading: boolean;
  fetchContactsError: string | null;
  createContactError: string | null;
  deleteContactError: string | null;
  getSingleContactError: string | null;
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
  product?: string[];
}

export interface FetchContactsParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  productId?: string;
}

export interface FetchHospitalsParams {
  idn?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface FetchHospitalsDealsParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
  productStage?: string;
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
  selectionPage: number;
  selectionTotalPages: number;
  hasMoreSelection: boolean;
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
  CLOSED_LOST = "Closed Lost",
  GHOSTED = "Ghosted",
  IMPLEMENTED = "Implemented",
}

export interface DealProduct {
  product: string | Product;
  dealAmount?: number;
  quantity?: number;
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
    quantity?: number;
    stage?: DealProductStage;
    expectedCloseDate?: string | Date;
    beds?: number;
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
  quantity?: number;
  stage: string | DealProductStage;
  expectedCloseDate: string;
  dealDate?: string;
  beds?: number;
}

export interface FetchAllDealsParams {
  userId?: string;
  productIds?: string;
  gpoId?: string;
  page?: number;
  limit?: number;
  search?: string;
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
  page?: number;
  limit?: number;
  totalPages?: number;
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
  isDealProductLoading: boolean;
  dealProductError: string | null;
  stats: {
    totalHospitals: number;
    closedBusiness: number;
    productRevenue: ProductRevenue[];
  } | null;
  page: number;
  limit: number;
  totalDeals: number;
  totalPages: number;
  isDeleteDealLoading: boolean;
  deleteDealError: string | null;
  quickStats: {
    hospitalCount: number;
    productCount: number;
  } | null;
  isFetchingQuickStats: boolean;
  quickStatsError: string | null;
}

export interface AddDealProductPayload {
  hospitalId: string;
  product: string;
  dealAmount?: number;
  quantity?: number;
  stage?: string;
  expectedCloseDate?: string;
  dealDate?: string;
  beds?: number;
  idn?: string;
  gpo?: string;
}

export interface UpdateDealProductPayload {
  dealId: string;
  product?: string;
  dealAmount?: number;
  quantity?: number;
  stage?: string;
  expectedCloseDate?: string;
  dealDate?: string;
  beds?: number;
  userId?: string;
}

export interface RemoveDealProductPayload {
  dealId: string;
}

export enum ActivityType {
  CALL_LOG = "callLog",
  TASK = "task",
  NOTE = "note",
}

export interface CallLogData {
  Date: string | Date;
  contact: string;
  notes: string;
  hospital: string;
}

export interface NoteData {
  notes: string;
  hospital: string;
}

export interface TaskData {
  title: string;
  description: string;
  dueDate: string | Date;
  hospital: string;
  reminders: ("email" | "push")[];
}

export interface CreateActivityPayload {
  type: ActivityType;
  data: CallLogData | NoteData | TaskData;
}

export interface DeleteActivityPayload {
  id: string;
  type: ActivityType;
}

export interface ActivityHospital {
  _id: string;
  hospitalName: string;
}

export interface ActivityContact {
  _id: string;
  firstName: string;
}

export interface TaskActivity {
  _id: string;
  activityType: ActivityType.TASK;
  title: string;
  description: string;
  dueDate: string;
  hospital: ActivityHospital;
  user: string;
  reminders: ("email" | "push")[];
  createdAt: string;
  updatedAt: string;
}

export interface CallLogActivity {
  _id: string;
  activityType: ActivityType.CALL_LOG;
  Date: string;
  contact: ActivityContact;
  notes: string;
  hospital: ActivityHospital;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteActivity {
  _id: string;
  activityType: ActivityType.NOTE;
  notes: string;
  hospital: ActivityHospital;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityItem = TaskActivity | CallLogActivity | NoteActivity;

export interface FetchActivitiesParams {
  hospitalId?: string;
  limit?: number;
  page?: number;
  showAll?: boolean;
}

export interface FetchAllActivitiesResponse {
  success: boolean;
  total: number;
  data: ActivityItem[];
}

export interface ActivityState {
  activities: ActivityItem[];
  totalActivities: number;
  isFetchingActivities: boolean;
  fetchActivitiesError: string | null;
  isCreateActivityLoading: boolean;
  createActivityError: string | null;
  isDeleteActivityLoading: boolean;
  deleteActivityError: string | null;
}

export enum DocumentCategory {
  CONTRACT = "Contract",
  REPORT = "Report",
  QUOTE = "Quote",
  PRESENTATION = "Presentation",
  OTHER = "Other",
}

export interface HospitalDocument {
  _id: string;
  name: string;
  category: DocumentCategory;
  fileUrl: string;
  filename: string;
  hospital: string;
  user: { _id: string; name: string; email: string } | string;
  fileSize: number;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentPayload {
  file: File;
  name: string;
  category: DocumentCategory;
  hospitalId: string;
}

export interface DocumentState {
  documents: HospitalDocument[];
  isFetchingDocuments: boolean;
  fetchDocumentsError: string | null;
  isUploadingDocument: boolean;
  uploadDocumentError: string | null;
  isDeletingDocument: boolean;
  deleteDocumentError: string | null;
}

export interface FetchClosedWonParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type FetchImplementedParams = FetchClosedWonParams;

export interface ClosedWonProduct {
  _id: string;
  product: {
    _id: string;
    name: string;
  };
  dealAmount: number;
  stage: string;
  expectedCloseDate: string;
  dealDate: string;
}

export interface ClosedWonDeal {
  _id: string;
  hospitalName: string;
  totalAmount: number;
  productsCount: number;
  products: ClosedWonProduct[];
}

export interface ClosedWonResponse {
  success: boolean;
  page: number;
  limit: number;
  totalHospitals: number;
  totalPages: number;
  hasMore: boolean;
  amount: number;
  productsCount: number;
  data: ClosedWonDeal[];
}

export interface DashboardStatsResponse {
  totalHospitals: number;
  totalHospitalsInDB: number;
  totalProductsInDB: number;
  totalDeals: number;
  activeDeals: number;
  totalPipelineAmount: number;
  closedBusiness: { totalAmount: number; hospitalCount: number };
  implemented: { totalAmount: number; hospitalCount: number };
  pipeline: {
    stage: string;
    amount: number;
    hospitalCount: number;
  }[];
}

export interface DashboardTask {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  hospital: {
    _id: string;
    hospitalName: string;
  };
  user: string;
  reminders: ("email" | "push")[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardTasksResponse {
  success: boolean;
  page: number;
  limit: number;
  totalTasks: number;
  totalPages: number;
  data: DashboardTask[];
}

export interface DashboardActivityItem {
  _id: string;
  activityType: string;
  notes?: string;
  Date?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  contact?: {
    _id: string;
    firstName: string;
    lastName?: string;
  };
  hospital: {
    _id: string;
    hospitalName: string;
  };
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardActivityResponse {
  success: boolean;
  page?: number;
  limit?: number;
  totalPages?: number;
  totalActivities?: number;
  data: DashboardActivityItem[];
}

export interface FetchDashboardTasksParams {
  page?: number;
  limit?: number;
}

export interface FetchDashboardActivityParams {
  page?: number;
  limit?: number;
}

export interface DashboardState {
  dashboardStats: DashboardStatsResponse | null;
  isFetchingDashboardStats: boolean;
  fetchDashboardError: string | null;

  closedWonData: ClosedWonResponse | null;
  isFetchingClosedWon: boolean;
  fetchClosedWonError: string | null;

  implementedData: ClosedWonResponse | null;
  isFetchingImplemented: boolean;
  fetchImplementedError: string | null;

  dashboardTasks: DashboardTask[];
  isFetchingDashboardTasks: boolean;
  fetchDashboardTasksError: string | null;
  dashboardTasksPage: number;
  dashboardTasksTotalPages: number;
  dashboardTasksHasMore: boolean;

  dashboardActivities: DashboardActivityItem[];
  isFetchingDashboardActivities: boolean;
  fetchDashboardActivitiesError: string | null;
  dashboardActivityPage: number;
  dashboardActivityTotalPages: number;
  dashboardActivityHasMore: boolean;
}

export interface EmailAddress {
  name: string;
  address: string;
}

export interface EmailBody {
  contentType: string;
  content: string;
}

export interface EmailMessage {
  _id: string;
  graphId: string;
  body: EmailBody;
  bccRecipients: EmailAddress[];
  bodyPreview: string;
  ccRecipients: EmailAddress[];
  conversationId: string;
  createdAt: string;
  from: EmailAddress;
  hasAttachments: boolean;
  attachments?: {
    name: string;
    contentType: string;
    contentId: string;
    fileUrl: string;
    isInline: boolean;
  }[];
  importance: string;
  isDraft: boolean;
  isRead: boolean;
  receivedDateTime: string;
  sender: EmailAddress;
  sentDateTime: string;
  subject: string;
  toRecipients: EmailAddress[];
  updatedAt: string;
  webLink: string;
}

export interface ReplyEmailPayload {
  messageId: string;
  comment: string;
  ccEmails?: string[];
  bccEmails?: string[];
}

export interface SendEmailPayload {
  fromEmail: string;
  toEmail: string;
  subject: string;
  content: string;
  ccEmails?: string[];
  bccEmails?: string[];
}

export interface MailboxState {
  receivedEmails: EmailMessage[];
  sentEmails: EmailMessage[];
  isFetchingReceived: boolean;
  isFetchingSent: boolean;
  fetchReceivedError: string | null;
  fetchSentError: string | null;
  pageReceived: number;
  pageSent: number;
  totalReceived: number;
  totalSent: number;
  isSyncing: boolean;
  syncError: string | null;
  isReplying: boolean;
  replyError: string | null;
  isSending: boolean;
  sendError: string | null;
}
