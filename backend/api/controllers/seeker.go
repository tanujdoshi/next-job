package api

import (
	"backend/configs"
	"backend/models/payload"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Api to update seeker in mongodb with request type SeekerUpdate
func UpdateSeekerById(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 10<<20) // 10 MB
	err := c.Request.ParseMultipartForm(10 << 20)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	seekerPayload := payload.SeekerUpdate{
		Email:      c.PostForm("email"),
		Phone:      c.PostForm("phone"),
		Address1:   c.PostForm("address1"),
		Address2:   c.PostForm("address2"),
		State:      c.PostForm("state"),
		PostalCode: c.PostForm("postalCode"),
		UserId:     c.PostForm("userId"),
	}

	fmt.Println("seekerPayload ==>", seekerPayload)

	// Read id
	objectId, _ := primitive.ObjectIDFromHex(c.PostForm("ID"))
	seekerPayload.ID = objectId

	// Read and unmarshal educations from JSON string
	educations := c.PostForm("educations")
	err = json.Unmarshal([]byte(educations), &seekerPayload.Educations)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Read and unmarshal experiences from JSON string
	experiences := c.PostForm("experiences")
	err = json.Unmarshal([]byte(experiences), &seekerPayload.Experiences)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := configs.Client.Database("jobportal").Collection("seekers")

	_, err = collection.UpdateOne(context.Background(), bson.M{"userId": seekerPayload.UserId}, bson.D{{"$set", seekerPayload}})

	fmt.Println("seekerPayload ==>", seekerPayload)
	fmt.Println("err ==>", err)
	fmt.Println("seekerPayload.ID ==>", seekerPayload.ID)

	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error while updating seeker",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Seeker updated successfully",
		"id":      seekerPayload.ID,
	})
}

// GetSeekerById to get seeker by id
func GetSeekerById(c *gin.Context) {
	requestId := c.Param("id")

	collection := configs.Client.Database("jobportal").Collection("seekers")
	// objectId, _ := primitive.ObjectIDFromHex(requestId)

	cursor, _ := collection.Find(context.Background(), bson.M{"userId": requestId})

	var seekers payload.SeekerUpdate
	var seekersList []payload.SeekerUpdate

	for cursor.Next(context.Background()) {
		cursor.Decode(&seekers)
		seekersList = append(seekersList, seekers)
	}

	c.JSON(200, gin.H{
		"seekers": seekersList,
	})
}

// Api to save new seeker in mongodb and resume as file with type of post request and url of http://localhost:8080/addSeeker
func AddSeeker(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 10<<20) // 10 MB
	err := c.Request.ParseMultipartForm(10 << 20)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	seekerPayload := payload.Seeker{
		Email:      c.PostForm("email"),
		Phone:      c.PostForm("phone"),
		Address1:   c.PostForm("address1"),
		Address2:   c.PostForm("address2"),
		State:      c.PostForm("state"),
		PostalCode: c.PostForm("postalCode"),
		UserId:     c.PostForm("userId"),
	}

	// Read and unmarshal educations from JSON string
	educations := c.PostForm("educations")
	err = json.Unmarshal([]byte(educations), &seekerPayload.Educations)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Read and unmarshal experiences from JSON string
	experiences := c.PostForm("experiences")
	err = json.Unmarshal([]byte(experiences), &seekerPayload.Experiences)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	file, _, err := c.Request.FormFile("resume")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	defer file.Close()

	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	seekerPayload.Resume = fileBytes

	collection := configs.Client.Database("jobportal").Collection("seekers")
	insertResult, err := collection.InsertOne(context.Background(), seekerPayload)

	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error while inserting seeker",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Seeker inserted successfully",
		"id":      insertResult.InsertedID,
	})
}
