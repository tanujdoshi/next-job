package configs

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() *mongo.Client {
	ctx := context.TODO()
	mongoConnect := options.Client().ApplyURI("mongodb+srv://root:root@jobportal-main.pksbr6y.mongodb.net/?retryWrites=true&w=majority")
	mongoClient, err := mongo.Connect(ctx, mongoConnect)

	if err != nil {
		log.Fatal(err)
	}

	if err := mongoClient.Ping(ctx, nil); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")

	return mongoClient
}

var Client *mongo.Client = ConnectDB()
