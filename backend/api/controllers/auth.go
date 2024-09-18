package api

import (
	"backend/configs"
	"backend/models/db"
	"backend/models/payload"
	"backend/utils"
	"context"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func Register(c *gin.Context) {
	var requestPayload payload.CreateUserPayload
	c.ShouldBindBodyWith(&requestPayload, binding.JSON)

	// ok, errMsg := utils.ValidateRequest(c, &payload.CreateUserPayload{})

	// if !ok {
	// 	c.JSON(http.StatusBadRequest, errMsg)
	// 	return
	// }

	coll := configs.Client.Database("jobportal").Collection("users")
	result := coll.FindOne(context.TODO(), bson.M{
		"email": requestPayload.Email,
	})

	if result.Err() == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "User already exists"})
		return
	}

	insertResult, err := coll.InsertOne(context.TODO(), db.User{
		FirstName: requestPayload.FirstName,
		LastName:  requestPayload.LastName,
		Email:     requestPayload.Email,
		Password:  utils.HashPassword(requestPayload.Password),
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error while registering user"})
		return
	}

	fmt.Println("Inserted a document to db ==>", insertResult)

	responseObject := gin.H{
		"message":   "User registered successfully",
		"id":        insertResult.InsertedID,
		"email":     requestPayload.Email,
		"firstName": requestPayload.FirstName,
		"lastName":  requestPayload.LastName,
		"token":     utils.GenerateJWT(requestPayload.Email),
	}

	c.IndentedJSON(http.StatusOK, gin.H{"response": responseObject})
}

func Login(c *gin.Context) {
	var requestPayload payload.LoginUserPayload
	c.ShouldBindBodyWith(&requestPayload, binding.JSON)
	// ok, errMsg := utils.ValidateRequest(c, &payload.LoginUserPayload{})

	// if !ok {
	// 	c.JSON(http.StatusBadRequest, errMsg)
	// 	return
	// }
	fmt.Println("login apiiii ====>>>>", requestPayload)
	coll := configs.Client.Database("jobportal").Collection("users")
	result := coll.FindOne(context.TODO(), bson.M{
		"email": requestPayload.Email,
	})

	var user db.User
	err := result.Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error while logging in"})
		return
	}
	fmt.Println("result ==>", user.Id)

	err = utils.VerifyHashPassword(user.Password, requestPayload.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid credentials"})
		return
	}

	if result.Err() != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid credentials"})
		return
	}

	token := utils.GenerateJWT(user.Email)
	fmt.Println("tokennn ==>", token)
	seekerResult := configs.Client.Database("jobportal").Collection("seekers").FindOne(context.TODO(), bson.M{
		"userId": user.Id.Hex(),
	})

	var seeker payload.Seeker
	err = seekerResult.Decode(&seeker)
	if err != nil {
		fmt.Println("error while decoding seeker ==>", err)
	}

	// print the result
	fmt.Println("Found a single document:", seeker.UserId, user.Id.Hex())

	var isSeeker bool
	if seeker.UserId == user.Id.Hex() {
		isSeeker = true
	} else {
		isSeeker = false
	}

	employerResult := configs.Client.Database("jobportal").Collection("employers").FindOne(context.TODO(), bson.M{
		"userId": user.Id.Hex(),
	})

	var employer payload.Employer
	err = employerResult.Decode(&employer)
	if err != nil {
	}

	// print the result
	fmt.Println("Found a single document:", employer.UserId, user.Id.Hex())

	var isEmployer bool
	if employer.UserId == user.Id.Hex() {
		isEmployer = true
	} else {
		isEmployer = false
	}

	fmt.Println("isSeeker ==>", isSeeker)

	var companyName string
	if isEmployer {
		companyName = employer.CompanyName
	} else {
		companyName = ""
	}

	fmt.Println("companyName ==>", companyName)

	var companyLogo string
	if isEmployer {
		companyLogo = employer.CompanyLogo
	} else {
		companyLogo = ""
	}

	fmt.Println("companyLogo ==>", companyLogo)

	responseObject := gin.H{
		"message":     "User logged in successfully",
		"token":       token,
		"firstName":   user.FirstName,
		"lastName":    user.LastName,
		"email":       user.Email,
		"id":          user.Id,
		"isSeeker":    isSeeker,
		"isEmployer":  isEmployer,
		"loginType":   requestPayload.LoginType,
		"companyName": companyName,
		"companyLogo": companyLogo,
	}

	c.IndentedJSON(http.StatusOK, gin.H{"response": responseObject})
}
