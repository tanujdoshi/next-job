package payload

import "go.mongodb.org/mongo-driver/bson/primitive"

type Employer struct {
	JobTitle      string `json:"jobTitle"`
	Phone         string `json:"phone"`
	CompanyName   string `json:"companyName"`
	Industry      string `json:"industry"`
	FoundedYear   string `json:"foundedYear"`
	CompanySize   string `json:"companySize"`
	CompanyType   string `json:"companyType"`
	Description   string `json:"description"`
	WebsiteURL    string `json:"websiteURL"`
	StreetAddress string `json:"streetAddress"`
	City          string `json:"city"`
	State         string `json:"state"`
	PostalCode    string `json:"postalCode"`
	Country       string `json:"country"`
	CompanyLogo   string `json:"companyLogo"`
	UserId        string `json:"userId" bson:"userId"`
}

type EmployerUpdate struct {
	ID            primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	JobTitle      string             `json:"jobTitle"`
	Phone         string             `json:"phone"`
	CompanyName   string             `json:"companyName"`
	Industry      string             `json:"industry"`
	FoundedYear   string             `json:"foundedYear"`
	CompanySize   string             `json:"companySize"`
	CompanyType   string             `json:"companyType"`
	Description   string             `json:"description"`
	WebsiteURL    string             `json:"websiteURL,omitempty"`
	StreetAddress string             `json:"streetAddress"`
	City          string             `json:"city"`
	State         string             `json:"state"`
	PostalCode    string             `json:"postalCode"`
	Country       string             `json:"country"`
	UserId        string             `json:"userId"`
	CompanyLogo   string             `json:"companyLogo,omitempty"`
}
