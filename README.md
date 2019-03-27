# m3-project
Module 3 project Ironhack by Andreu, Agustin &amp; Xavi
# Project Name

## Description

This is a system acution intended for services between privates.

## User Stories

-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
-  **Signup:** As an anon I can sign up in the platform so that I can start saving favorite restaurants
-  **Login:** As a user I can login to the platform so that I can see my favorite restaurants
-  **Logout:** As a user I can logout from the platform so no one else can use it
-  **Add Service** As a user I can CRUD an auction to provide a service so anybody can buy it
-  **List Auctions** As a user I'll list the open auctions.
-  **Edit my profile** As a user I'll feed my profile, update it or even delete it. (CRUD )
-  **Auctions detail** As a user I want to see my auctions detail (img,name, desc, ..., 
-  **See my offering auctions** As a user I want to list my autions on bid
-  **See finished auction ** As a user I want to see finished auction and counterpart contact info


## Backlog

User profile:

- Messaging. to the users from the system to notify auction events, between users fr 

Geo Location:
- add geolocation to the users / services
- show event in a map in event detail page
- show all events in a map in the event list page

Homepage:
- ...
  
# Client

## Routes
| Method | Path 		| Component 		| Permissions	| Behavior | 
|--------|----------------------|-----------------------|---------------|-------------------------------------------------------------|
 `get`   |`/`		 	|HomePageComponent	|public         |
 `post`  |`/auth/signup` 	|SignupPageComponent	|anon only	|signup form, link to login, navigate to homepage after signup
 `post`  |`/auth/login` 	|LoginPageComponent 	|anon only 	|Login form, link to signup, navigate to homepage after login 
 `post`  |`/auth/logout` 	|n/a	 		|anon only 	|navigate to homepage after logout, expire session 
 `get` 	 |`/user/me`     	|UserProfile		|user only 	|details of my user
 `put` 	 |`/user/:id/edit` 	|UserProfile Edit	|user only 	|edit my user profile
 `get`   |`/auctions` 	 	|List Auctioms	 	|user only 	|show all auctions except mine ones
 `get`   |`/auction/:id` 	|Auction Detail	 	|user only 	|show auction details
 `post`	 |`/auctions/create` 	|Auction Create	 	|user only 	|create a new auction
 `delete`|`/auction/:id` 	|Auction Delete	 	|user only 	|delete auction





## Components
- Homepage
- Form Signup
- Form Login
- AuctionList 
 - AuctionCard component
- AuctionDetail
- Auction Create
 - Form create auction
- Profile
 - AuctionCard component 
- 					NAVBAR


## Services

- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.me()
  - auth.getUser() // synchronous
- Auction Service
  - auction.list()
  - auction.create(data)
  - auction.detail(id)
  - auction.delete(id)
  
# Server

## Models

User model

```
username - String // required
password - String // required
image	 - String // optional
Mobile	 - Phone??  // optional
```

Service model

```
owner		 - ObjectID<User> // required
name		 - String // required
description 	 - String // required
starting price   - Number // require
Ending time	 - Date DD/MM/YYYY HH:MM:SS //required

```

Bid model
``` 
Service		- ObjectID<User> // required
Buyer		- ObjectID<User> // required
Price		- Number	 // required
SellerRating	- Number         // optional
BuyerRating 	- Number         // optional

## API Endpoints (backend routes)

- GET /auth/me
  - 404 if no user in session
  - 200 with user object
- POST /auth/signup
  - 401 if user logged in
  - body:
    - username
    - email
    - password
  - validation
    - fields not empty (422)
    - user not exists (409)
  - create user with encrypted password
  - store user in session
  - 200 with user object
- POST /auth/login
  - 401 if user logged in
  - body:
    - username
    - password
  - validation
    - fields not empty (422)
    - user exists (404)
    - passdword matches (404)
  - store user in session
  - 200 with user object
- POST /auth/logout
  - body: (empty)
  - 204

 - GET `/user/me`  
   - 403 if no user in session 
   - 401 if user-id <> me
   - 200/202 with user object  
		

 - PUT `/user/:id/edit` 
   - 403 if no user session
   - 404 if no user id
   - 401 if user not me

   - 200/202 with user object  
   
 - GET `/auctions` 
    - 200/202 with auction list
    - 204 with nothing

 - GET  `/auction/:id` 
    - 200 with auction object.
    - 404 when not found
    - 401 when no session     

-  POST  `/auctions/create` 
    - body : (empty )
    - 204 no content
      

-  DELETE `/auction/:id` 
    - body: (empty - the user is already stored in the session)
    - remove from favorites
    - updates user in session


## Links

### Trello
	https://trello.com/b/0dXAukbd


### Git

	https://github.com/xavivax1/m3-project

[Client repository Link](http://github.com)
[Server repository Link](http://github.com)
[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

	https://slides.com/xavierdeviala/deck/edit
