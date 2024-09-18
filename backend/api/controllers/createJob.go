package api

import (
	"backend/configs"
	"backend/models/db"
	"backend/models/payload"
	"backend/utils"
	"context"
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateJob(c *gin.Context) {
	var requestPayload payload.CreateJobPayload
	c.ShouldBindBodyWith(&requestPayload, binding.JSON)

	fmt.Println("request Payload for CreateJob API ==>", requestPayload)

	ok, errMsg := utils.ValidateRequest(c, &payload.CreateJobPayload{})
	if !ok {
		c.JSON(400, errMsg)
		return
	}

	collection := configs.Client.Database("jobportal").Collection("jobs")

	indexModel := mongo.IndexModel{
		Keys: bson.D{{Key: "location", Value: "2dsphere"}},
	}

	name, err := collection.Indexes().CreateOne(context.TODO(), indexModel)
	if err != nil {
		panic(err)
	}

	fmt.Println("name ==>", name)
	success, err := collection.InsertOne(context.TODO(), db.Job{
		JobTitle:       requestPayload.JobTitle,
		JobDescription: requestPayload.JobDescription,
		Skills:         requestPayload.Skills,
		JobStatus:      requestPayload.JobStatus,
		NoOfPositions:  requestPayload.NoOfPositions,
		JobType:        requestPayload.JobType,
		Salary:         requestPayload.Salary,
		Experience:     requestPayload.Experience,
		OpenDate:       requestPayload.OpenDate,
		Location: db.JobLocation{
			Type:        "Point",
			Coordinates: []float64{requestPayload.JobLocation.Lng, requestPayload.JobLocation.Lat},
			PlaceID:     requestPayload.JobLocation.PlaceId,
			PlaceName:   requestPayload.JobLocation.PlaceName,
			City:        requestPayload.JobLocation.City,
			State:       requestPayload.JobLocation.State,
			Country:     requestPayload.JobLocation.Country,
		},
		EmployerId:     requestPayload.EmployerId,
		JobCompany:     requestPayload.JobCompany,
		JobCompanyLogo: requestPayload.JobCompanyLogo,
		EmployerEmail:  requestPayload.EmployerEmail,
	})

	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error while creating job",
		})
		return
	}

	fmt.Println("Inserted a document to db ==>", success.InsertedID)

	c.JSON(200, gin.H{
		"message": "Job Successfully Created",
	})
}

func UpdateJob(c *gin.Context) {
	var requestPayload payload.CreateJobPayload
	c.ShouldBindBodyWith(&requestPayload, binding.JSON)

	fmt.Println("request Payload for UpdateJob API ==>", requestPayload)

	collection := configs.Client.Database("jobportal").Collection("jobs")
	requestObjectID, errObjectId := primitive.ObjectIDFromHex(requestPayload.Id.Hex())

	if errObjectId != nil {
		c.JSON(500, gin.H{
			"message": "Error while updating job",
		})
		return
	}

	success, err := collection.UpdateOne(context.Background(), bson.M{"_id": requestObjectID}, bson.M{
		"$set": db.Job{
			JobTitle:       requestPayload.JobTitle,
			JobDescription: requestPayload.JobDescription,
			Skills:         requestPayload.Skills,
			JobStatus:      requestPayload.JobStatus,
			NoOfPositions:  requestPayload.NoOfPositions,
			JobType:        requestPayload.JobType,
			Salary:         requestPayload.Salary,
			Experience:     requestPayload.Experience,
			OpenDate:       requestPayload.OpenDate,
			Location: db.JobLocation{
				Type:        "Point",
				Coordinates: []float64{requestPayload.JobLocation.Lng, requestPayload.JobLocation.Lat},
				PlaceID:     requestPayload.JobLocation.PlaceId,
				PlaceName:   requestPayload.JobLocation.PlaceName,
				City:        requestPayload.JobLocation.City,
				State:       requestPayload.JobLocation.State,
				Country:     requestPayload.JobLocation.Country,
			},
			EmployerId:     requestPayload.EmployerId,
			JobCompany:     requestPayload.JobCompany,
			JobCompanyLogo: requestPayload.JobCompanyLogo,
			EmployerEmail:  requestPayload.EmployerEmail,
		},
	})

	if err != nil {
		fmt.Println("Error while updating job ==>", err)
		c.JSON(500, gin.H{
			"message": "Error while updating job",
		})
		return
	}

	fmt.Println("Updated a document to db ==>", success)

	c.JSON(200, gin.H{
		"message": "Job Successfully Updated",
	})
}

func DeleteJob(c *gin.Context) {
	requestId := c.Param("id")

	collection := configs.Client.Database("jobportal").Collection("jobs")
	objectId, errObjectId := primitive.ObjectIDFromHex(requestId)

	if errObjectId != nil {
		c.JSON(500, gin.H{
			"message": "Error while deleting job",
		})
		return
	}

	success, err := collection.DeleteOne(context.Background(), bson.M{"_id": objectId})

	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error while deleting job",
		})
		return
	}

	fmt.Println("Deleted a document from db ==>", success)

	c.JSON(200, gin.H{
		"message": "Job Successfully Deleted",
	})
}

func GetJobByRadius(c *gin.Context) {
	latParam := c.Param("lat")
	lngParam := c.Param("lng")

	fmt.Println("latParam ==>", latParam)
	fmt.Println("lngParam ==>", lngParam)

	floatLat, floatLatErr := strconv.ParseFloat(latParam, 64)
	floatLng, floatLngErr := strconv.ParseFloat(lngParam, 64)

	if floatLatErr != nil || floatLngErr != nil {
		fmt.Println("Error while converting lat and lng to float ==>", floatLatErr, floatLngErr)
		c.JSON(500, gin.H{
			"message": "Error whiladsde getting jobs",
		})
		return
	}

	collection := configs.Client.Database("jobportal").Collection("jobs")

	dataCheck := bson.D{{Key: "type", Value: "Point"}, {Key: "coordinates", Value: []float64{floatLng, floatLat}}}
	filter := bson.D{
		{Key: "location", Value: bson.D{
			{Key: "$near", Value: bson.D{
				{Key: "$geometry", Value: dataCheck},
				{Key: "$maxDistance", Value: 3000},
			}},
		}},
	}

	var places []db.Job
	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		fmt.Println("Error while getting jobs ==>", err)
		c.JSON(500, gin.H{
			"message": "Error while getting jobs",
		})
		return
	}

	cursor.All(context.TODO(), &places)

	fmt.Println("places ==>", places)

	c.JSON(200, gin.H{
		"jobs": places,
	})
}

// GetJobsByCompany to get jobs by company name
func GetJobsByCompany(c *gin.Context) {
	requestCompany := c.Param("companyName")

	collection := configs.Client.Database("jobportal").Collection("jobs")

	cursor, _ := collection.Find(context.Background(), bson.M{"jobcompany": requestCompany})

	var jobs db.Job
	var jobsList []db.Job

	for cursor.Next(context.Background()) {
		cursor.Decode(&jobs)
		jobsList = append(jobsList, jobs)
	}

	c.JSON(200, gin.H{
		"jobs": jobsList,
	})
}
