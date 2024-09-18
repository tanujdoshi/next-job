package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	api "backend/api/controllers"
	"backend/configs"
	"backend/middlewares"
)

func main() {
	configs.ConnectDB()

	router := gin.Default()

	router.Use(middlewares.CorsMiddleware())

	// public routes. No need to add Authorization header to request these routes. The API would look like this: http://localhost:8080/pub/
	public := router.Group("/pub")
	public.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"resp": "Hello World without JWT token"})
	})
	public.POST("/login", api.Login)
	public.POST("/register", api.Register)
	public.POST("/contactUs", api.ContactUs)

	// protected routes. For this routes you need to add Authorization header which contains JWT token. The API would look like this: http://localhost:8080/api/
	protected := router.Group("/api")
	protected.Use(middlewares.JwtAuthMiddleware())
	protected.GET(("/"), func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"resp": "Hello World with JWT token"})
	})

	protected.POST("/createJob", api.CreateJob)
	protected.GET("/getJobs", api.GetJobs)
	protected.GET("/getJob/:id", api.GetJobById)
	protected.PUT("/updateJob", api.UpdateJob)
	protected.DELETE("/deleteJob/:id", api.DeleteJob)
	router.GET("/getJobsByCompany/:companyName", api.GetJobsByCompany)

	// create a new route for getting jobs based on radius and latitude and longitude. Here the latitude and longitude will be in passed in query params
	protected.GET("/getJobByRadius/:lat/:lng", api.GetJobByRadius)

	protected.POST("/seeker", api.AddSeeker)
	protected.PUT("/seeker", api.UpdateSeekerById)
	protected.GET("/seeker/:id", api.GetSeekerById)

	protected.POST("/employer", api.AddEmployer)
	protected.PUT("/employer", api.UpdateEmployerById)
	protected.GET("/employer/:id", api.GetEmployerById)
	protected.GET("/employerByUserId/:id", api.GetEmployerByUserId)
	protected.GET("/getJobApplicantIdsByJobId/:id", api.GetJobApplicantIdsByJobId)
	protected.POST("/apply", api.ApplyJob)
	protected.POST("/scheduleInterview", api.ScheduleInterview)
	protected.GET("/getEmployers", api.GetEmployers)

	protected.POST("/review", api.WriteReview)
	protected.GET("/getReview/:companyId", api.GetReviewByCompany)
	protected.GET("/getUser/:id", api.GetUserById)
	router.Run(":8080")
}
