package api

import (
	"backend/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type ContactRequest struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Mobile  string `json:"mobile" binding:"required"`
	Subject string `json:"subject" binding:"required"`
	Message string `json:"message" binding:"required"`
}

func ContactUs(c *gin.Context) {

	var requestData ContactRequest

	c.ShouldBindBodyWith(&requestData, binding.JSON)

	if ok, errMsg := utils.ValidateRequest(c, &ContactRequest{}); !ok {
		c.IndentedJSON(http.StatusBadRequest, errMsg)
		return
	}

	subject := "Contact Us: " + requestData.Subject
	htmlBody := composeContactEmail(requestData)

	err := sendEmail(emailConfig, emailConfig.FromEmail, subject, htmlBody)
	if err != nil {
		log.Println("Failed to send contact email:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "An error occurred while sending the contact email!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Contact email sent successfully!",
	})
}

func composeContactEmail(data ContactRequest) string {
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
			<p>Dear NextJob Team,</p>
			<p>We have received a new message through the <strong>'Contact Us'</strong> form on our website. Below are the details of the submission:</p>

			<h3>Contact Information</h3>
			<ul>
				<li><strong>Name:</strong> ` + data.Name + `</li>
				<li><strong>Email:</strong> ` + data.Email + `</li>
				<li><strong>Mobile:</strong> ` + data.Mobile + `</li>
			</ul>

			<h3>Message Details</h3>
			<p><strong>Subject:</strong> ` + data.Subject + `</p>
			<p><strong>Message:</strong></p>
			<p><i>` + data.Message + `</i></p>

			<p>We recommend addressing this message promptly to ensure our users receive timely responses and maintain a positive impression of our platform. For any clarifications or additional details, feel free to reach out to the user directly using the contact details provided above.</p>

			<p>This is an automated email. Please do not reply directly to this email. Instead, use the user's contact details provided above.</p>

			<p style="color: grey;">Warm regards,<br>The NextJob Automated System</p>
		</body>
		</html>
	`
}
