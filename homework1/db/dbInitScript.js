conn = new Mongo("localhost:27017");
db = conn.getDB("cooking")

db.createCollection("users",{
	validator: {
	
		$jsonSchema: {
			bsonType: "object",
			required: ["name", "username", "gender", "role", "description", "status", "password"],
			// additionalProperties: false,
			properties: {
				name: {
					bsonType: "string",					
				},
				username: {
					bsonType: "string",
					pattern: "^[a-zA-Z0-9_]{1,15}$"
				},
				password: {
					bsonType: "string",
					pattern: "^(?=.*?[^0-9a-zA-Z])(?=.*?[0-9]).{8,}$"
							
				},
				registeredAt: {
					bsonType: "date"
				},
				gender: {
					enum: ["male", "Male", "female", "Female"]
				},
				role: {
					enum: ["user", "admin"]
				},
				description: {
					bsonType: "string",
					maxLength: 150
				},
				createdAt: {
					bsonType: "date"
				},
				modifiedAt: {
					bsonType: "date"
				},
				status: {
					enum: ["active", "suspended", "deactivated"]
				}
			}

		}
	}
})
db.createCollection("recipe",
	{validator: {
			$jsonSchema: {
				bsonType: "object",
				required: ["name", "shortDescription", "timeToCook", "products", "longDescription", "keywords"],
				properties: {
					createAt: {
						bsonType: "string"
					},
					user_id: {						
							bsonType: "objectId"						
					},
					name: {
						bsonType: "string",
						maxLength: 80
					},shortDescription: {
						bsonType: "string",
						maxLength: 246
					}
					,timeToCook: {
						bsonType: "string",
						pattern: "^[0-9]+$"
					}
					,products: {
						bsonType: "array"
					},longDescription: {
						bsonType: "string",
						maxLength: 2048
					},
					keywords: {
						bsonType: "array"
					}
				}
				// ,additionalProperties: false
			
		}
	}
})

db.getCollectionInfos({name: "users"})
db.getCollectionInfos({name: "recipe"})