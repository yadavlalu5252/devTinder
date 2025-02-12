# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST / logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/send/:status/:userId == for both intereted and ignored

- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
- POST /request/review/:status/:requestId == for both accepted and rejected

## userRouter
- GET /user/connections
- GET /user/request/received
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignore, interested, accepted, rejected.