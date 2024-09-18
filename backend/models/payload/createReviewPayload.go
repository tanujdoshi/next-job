package payload

type ReviewPayload struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Review    string `json:"review"`
	CompanyId string `json:"companyId"`
}
