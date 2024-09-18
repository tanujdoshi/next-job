package api

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"backend/configs"
	"backend/models/payload"
)

func GetUserById(c *gin.Context) {
	requestID := c.Param("id")

	collection := configs.Client.Database("jobportal").Collection("users")

	objectID, errObjectID := primitive.ObjectIDFromHex(requestID)
	if errObjectID != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Invalid user ID",
		})
		return
	}

	filter := bson.M{"_id": objectID}

	var user payload.GetUser
	err := collection.FindOne(context.Background(), filter).Decode(&user)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Error while fetching user data",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}
