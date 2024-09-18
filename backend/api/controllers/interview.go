package api

import (
	"backend/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type InterviewRequest struct {
	CandidateFirstName string `json:"candidateFirstName" binding:"required" msg:"Candidate's first name is required"`
	CandidateEmail     string `json:"candidateEmail" binding:"required,email" msg:"CandidateEmail must be in a valid format"`
	PositionName       string `json:"positionName" binding:"required" msg:"Position name is required"`
	JobType            string `json:"jobType" binding:"required" msg:"JobType is required"`
	Salary             string `json:"salary" binding:"required" msg:"Salary must be specified"`
	CompanyName        string `json:"companyName" binding:"required" msg:"Company name is required"`
	Location           string `json:"location" binding:"required" msg:"Job location is required"`
	RoleDescription    string `json:"roleDescription" binding:"required" msg:"Role description is required"`
	EmployerEmail      string `json:"employerEmail" binding:"required,email" msg:"EmployerEmail must be in a valid format"`
	EmployerContact    string `json:"employerContact" binding:"required" msg:"Employer contact information is required"`
}

func ScheduleInterview(c *gin.Context) {

	var requestData InterviewRequest

	c.ShouldBindBodyWith(&requestData, binding.JSON)

	if ok, errMsg := utils.ValidateRequest(c, &InterviewRequest{}); !ok {
		c.IndentedJSON(http.StatusBadRequest, errMsg)
		return
	}

	subject := "Interview Invitation for " + requestData.PositionName + " at " + requestData.CompanyName
	htmlBody := composeInterviewEmail(requestData)

	err := sendEmail(emailConfig, requestData.CandidateEmail, subject, htmlBody)
	if err != nil {
		log.Println("Failed to send interview email:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "An error occurred while sending the interview email!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Interview invitation email sent successfully!",
	})
}

func composeInterviewEmail(data InterviewRequest) string {
	return `
		<!DOCTYPE html>
		<html>
		<head>
			<style>
				body {
					font-family: Arial, sans-serif;
				}
			</style>
		</head>
		<body>
			<p>Dear ` + data.CandidateFirstName + `,</p>
			<p>Greetings from the NextJob team! We are thrilled to inform you that your application for the <strong>` + data.PositionName + `</strong> at <strong>` + data.CompanyName + `</strong> has been shortlisted. The team at ` + data.CompanyName + ` is eager to learn more about your qualifications and how they align with their vision.</p>
			<h3>About the Job:</h3>
			<ul>
				<li><strong>Company Name:</strong> ` + data.CompanyName + `</li>
				<li><strong>Position:</strong> ` + data.PositionName + `</li>
				<li><strong>Type:</strong> ` + data.JobType + `</li>
				<li><strong>Location:</strong> ` + data.Location + `</li>
				<li><strong>Salary:</strong> $` + data.Salary + `</li>
				<li><strong>Role Description:</strong> ` + data.RoleDescription + `</li>
			</ul>
			<h3>Next Steps:</h3>
			<p>To proceed with the interview process, kindly contact the employer directly at <strong>` + data.EmployerEmail + `</strong> or <strong>` + data.EmployerContact + `</strong> to coordinate a suitable date and time for an online interview.</p>
			<h4>Preparation for the Online Interview:</h4>
			<ul>
				<li><strong>Tech Check:</strong> Ensure your camera and microphone are functioning correctly. It's advisable to test your internet connection in advance.</li>
				<li><strong>Research:</strong> Delve into ` + data.CompanyName + `'s values, mission, and recent projects. Visit their About Us page.</li>
			</ul>
			<p>If you have any questions or require further details about the process, we encourage you to reach out to the employer at your earliest convenience.</p>
			<p>Thank you for utilizing our job portal for your recruitment needs. We are committed to providing you with a seamless and efficient hiring experience. If you have any inquiries or require assistance, please don't hesitate to contact our support team.</p>
			<p>We wish you the best of luck with your interview at <strong>` + data.CompanyName + `</strong>!</p>
			<p style="color: grey;">Best regards,<br>Kishan Patel<br>Software Developer<br>NextJob <br>+1 123 456 6743 | nextjob.group1@gmail.com</p>
		</body>
		</html>
	`
}
