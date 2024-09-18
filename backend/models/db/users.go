package db

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	FirstName string
	LastName  string
	Email     string
	Password  string
	Id        primitive.ObjectID `bson:"_id,omitempty"`
}
