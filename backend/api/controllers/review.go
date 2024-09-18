package api

import (
	"backend/configs"
	"backend/models/db"
	"backend/models/payload"
	"context"
	"fmt"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func WriteReview(c *gin.Context) {
	var requestPayload payload.ReviewPayload
	c.BindJSON(&requestPayload)

	collection := configs.Client.Database("jobportal").Collection("reviews")

	_, err := collection.InsertOne(context.TODO(), requestPayload)

	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error while inserting review",
		})
		return
	}

	c.JSON(200, gin.H{
		"message": "Review inserted successfully",
	})
}

func GetReviewByCompany(c *gin.Context) {
	companyId := c.Param("companyId")

	collection := configs.Client.Database("jobportal").Collection("reviews")

	cursor, _ := collection.Find(context.TODO(), primitive.M{"companyid": companyId})

	var reviews db.Review
	var reviewsList []db.Review

	for cursor.Next(context.Background()) {
		cursor.Decode(&reviews)
		reviewsList = append(reviewsList, reviews)
	}

	fmt.Println("review List ==>", reviewsList)

	c.JSON(200, gin.H{
		"reviews": reviewsList,
	})
}
