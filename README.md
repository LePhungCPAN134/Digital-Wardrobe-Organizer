# Digital-Wardrobe-Organizer
Phase 2:
1. Create data structure
Defined entities: users, clothingItems, outfits
Added sample JSON data

2. Apply modular architecture
Organized code into feature-based modules
Each module contain models, routes, and middlewares

3. CRUD logic in models
getAll<Entity>(), get<Entity>ById(), add<Entity>(), update<Entity>(), delete<Entity>()

4. Independent routes
Used express router for each module
Routes call model functions

5. Validation middlewares
Used express-validator for POST and PUT
Each module has its own validation rules

6. Application-level middlewares
express.json() and express.urlencoded()
404 handler and error-handling middleware

7. HTTP responses
200 OK
201 created
400 bad request
404 not found
500 internal server error

8. Data files
Added sample JSON fiiles in /data folder: users.json, clothingItems.json, outfits.json

9. File ultilities
Implemented for reading and writing JSON data

10. Testing
Tested all using POSTMAN
