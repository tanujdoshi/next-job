package utils

import (
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func ValidateRequest(c *gin.Context, requestPayload interface{}) (bool, gin.H) {
	if err := c.ShouldBindBodyWith(requestPayload, binding.JSON); err != nil {
		if syntaxErr, ok := err.(*json.SyntaxError); ok {
			return false, gin.H{"errors": gin.H{"json": syntaxErr.Error()}}
		}

		errMsg := gin.H{}
		for _, fieldErr := range err.(validator.ValidationErrors) {
			field := fieldErr.Field()
			errMsg[field] = fieldErr.Tag() + " validation failed"

			if fieldErr.Param() != "" {
				errMsg[field] = fmt.Sprintf("%s %s", errMsg[field], fieldErr.Param())
			}

			if fieldTag, ok := reflect.TypeOf(requestPayload).Elem().FieldByName(field); ok {
				if msg, ok := fieldTag.Tag.Lookup("msg"); ok {
					errMsg[field] = msg
				}
			}
		}

		v := reflect.ValueOf(requestPayload).Elem()
		for i := 0; i < v.NumField(); i++ {
			field := v.Field(i)
			if field.Kind() == reflect.String && field.Len() == 0 {
				errMsg := gin.H{v.Type().Field(i).Name: v.Type().Field(i).Name + " is a required field"}
				return false, gin.H{"errors": errMsg}
			}
		}

		return false, gin.H{"errors": errMsg}
	}

	fmt.Printf("%+v\n", requestPayload)

	return true, gin.H{"requestPayload": requestPayload}
}
