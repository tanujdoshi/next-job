package api

import (
	"backend/configs"
	"backend/models/payload"
	"context"

	// "fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddEmployer(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 10<<20) // 10 MB
	err := c.Request.ParseMultipartForm(10 << 20)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	employerData := payload.Employer{
		JobTitle:      c.PostForm("jobTitle"),
		Phone:         c.PostForm("phone"),
		CompanyName:   c.PostForm("companyName"),
		Industry:      c.PostForm("industry"),
		FoundedYear:   c.PostForm("foundedYear"),
		CompanySize:   c.PostForm("companySize"),
		CompanyType:   c.PostForm("companyType"),
		Description:   c.PostForm("description"),
		WebsiteURL:    c.PostForm("websiteURL"),
		StreetAddress: c.PostForm("streetAddress"),
		City:          c.PostForm("city"),
		State:         c.PostForm("state"),
		PostalCode:    c.PostForm("postalCode"),
		Country:       c.PostForm("country"),
		UserId:        c.PostForm("userId"),
		CompanyLogo:   c.PostForm("companyLogo"),
	}
	collection := configs.Client.Database("jobportal").Collection("employers")
	insertResult, err := collection.InsertOne(context.Background(), employerData)

	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error while inserting employer",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Employer inserted successfully",
		"id":      insertResult.InsertedID,
	})
}

func UpdateEmployerById(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 10<<20) // 10 MB
	err := c.Request.ParseMultipartForm(10 << 20)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	employerData := payload.EmployerUpdate{
		JobTitle:      c.PostForm("jobTitle"),
		Phone:         c.PostForm("phone"),
		CompanyName:   c.PostForm("companyName"),
		Industry:      c.PostForm("industry"),
		FoundedYear:   c.PostForm("foundedYear"),
		CompanySize:   c.PostForm("companySize"),
		CompanyType:   c.PostForm("companyType"),
		Description:   c.PostForm("description"),
		WebsiteURL:    c.PostForm("websiteURL"),
		StreetAddress: c.PostForm("streetAddress"),
		City:          c.PostForm("city"),
		State:         c.PostForm("state"),
		PostalCode:    c.PostForm("postalCode"),
		Country:       c.PostForm("country"),
		UserId:        c.PostForm("userId"),
	}

	// Read id
	objectId, _ := primitive.ObjectIDFromHex(c.PostForm("ID"))
	employerData.ID = objectId

	collection := configs.Client.Database("jobportal").Collection("employers")
	_, err = collection.UpdateOne(context.Background(), bson.M{"userId": employerData.UserId}, bson.D{{"$set", employerData}})

	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error while updating employer",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Employer updated successfully",
		"id":      employerData.ID,
	})
}

// GetEmployerById to get employer by id
func GetEmployerById(c *gin.Context) {
	requestId := c.Param("id")

	collection := configs.Client.Database("jobportal").Collection("employers")
	objectId, _ := primitive.ObjectIDFromHex(requestId)

	cursor, _ := collection.Find(context.Background(), bson.M{"_id": objectId})

	var employers payload.EmployerUpdate
	var employersList []payload.EmployerUpdate

	for cursor.Next(context.Background()) {
		cursor.Decode(&employers)
		employersList = append(employersList, employers)
	}

	c.JSON(200, gin.H{
		"employers": employersList,
	})
}

// GetEmployerById to get employer by user id
func GetEmployerByUserId(c *gin.Context) {
	requestId := c.Param("id")

	collection := configs.Client.Database("jobportal").Collection("employers")

	cursor, _ := collection.Find(context.Background(), bson.M{"userId": requestId})

	var employers payload.EmployerUpdate
	var employersList []payload.EmployerUpdate

	for cursor.Next(context.Background()) {
		cursor.Decode(&employers)
		employersList = append(employersList, employers)
	}

	c.JSON(200, gin.H{
		"employers": employersList,
	})
}

// GetEmployers to get all employers
func GetEmployers(c *gin.Context) {
	collection := configs.Client.Database("jobportal").Collection("employers")

	cursor, _ := collection.Find(context.Background(), bson.M{})

	var employers payload.EmployerUpdate
	var employersList []payload.EmployerUpdate

	for cursor.Next(context.Background()) {
		cursor.Decode(&employers)
		employersList = append(employersList, employers)
	}

	c.JSON(200, gin.H{
		"employers": employersList,
	})
}
