package payload

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Education struct {
	School       string `json:"school" bson:"school"`
	Degree       string `json:"degree" bson:"degree"`
	FieldOfStudy string `json:"fieldOfStudy" bson:"fieldOfStudy"`
	StartDate    string `json:"startDate" bson:"startDate"`
	EndDate      string `json:"endDate,omitempty" bson:"endDate,omitempty"`
}

type Experience struct {
	Company   string `json:"company" bson:"company"`
	Title     string `json:"title" bson:"title"`
	Location  string `json:"location" bson:"location"`
	StartDate string `json:"startDate" bson:"startDate"`
	EndDate   string `json:"endDate,omitempty" bson:"endDate,omitempty"`
	Details   string `json:"details,omitempty" bson:"details,omitempty"`
}

type Seeker struct {
	Email       string       `json:"email,omitempty" bson:"email" validate:"required,email"`
	Phone       string       `json:"phone,omitempty" bson:"phone" validate:"required,numeric,len=10"`
	Address1    string       `json:"address1,omitempty" bson:"address1" validate:"required,alphanum"`
	Address2    string       `json:"address2,omitempty" bson:"address2" validate:"omitempty,alphanum"`
	State       string       `json:"state,omitempty" bson:"state" validate:"required,alpha,len=2"`
	PostalCode  string       `json:"postalCode,omitempty" bson:"postalCode" validate:"required,numeric,len=5"`
	Educations  []Education  `json:"educations,omitempty" bson:"educations"`
	Experiences []Experience `json:"experiences,omitempty" bson:"experiences"`
	Resume      []byte       `json:"resume,omitempty" bson:"resume"`
	UserId      string       `json:"userId" bson:"userId"`
}

type SeekerUpdate struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email       string             `json:"email,omitempty" bson:"email" validate:"required,email"`
	Phone       string             `json:"phone,omitempty" bson:"phone" validate:"required,numeric,len=10"`
	Address1    string             `json:"address1,omitempty" bson:"address1" validate:"required,alphanum"`
	Address2    string             `json:"address2,omitempty" bson:"address2" validate:"omitempty,alphanum"`
	State       string             `json:"state,omitempty" bson:"state" validate:"required,alpha,len=2"`
	PostalCode  string             `json:"postalCode,omitempty" bson:"postalCode" validate:"required,numeric,len=5"`
	Educations  []Education        `json:"educations,omitempty" bson:"educations"`
	Experiences []Experience       `json:"experiences,omitempty" bson:"experiences"`
	UserId      string             `json:"userId" bson:"userId"`
	// Resume      []byte             `json:"resume,omitempty" bson:"resume,omitempty"`
}
